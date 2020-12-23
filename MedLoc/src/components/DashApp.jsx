// Libraries import

import React, { useEffect, useState, useRef } from "react";

import axios from "axios";
import "../styles/dashStyle.css";

// ____________________________________ Imports ____________________________________

//Data
import WorldTable from "./Data/WorldTable";

//Visualizations

import BoxPlot from "./Data/Boxplot";

// Maps
import Mainmap from "./Maps/Mainmap";
import PreviewMap from "./Maps/PreviewMap";

// Feature
import ListSelector from "./Controls/ListSelector";
import Synthesizer from "./Controls/Synthesizer";
import MLSetup from "./Controls/MLSetup";

// UI

import Loading from "./Loading";
import Navbar from "./Interface/Navbar";

// ____________________________________APP____________________________________

function DashApp (){
	// To Do : useMemo hook for improving performance for the functions that are heavy
	const stageCanvasRef = useRef(null);
	const [ divHeight, setDivHeight ] = useState("200px");
	const [ isSending, setIsSending ] = useState(false);

	useEffect(() => {
		// The 'current' property contains info of the reference:
		// align, title, ... , width, height, etc.
		if (stageCanvasRef.current) {
			setDivHeight(stageCanvasRef.current.offsetHeight);
			// let width  = stageCanvasRef.current.offsetWidth;
		}
	});

	//Fetching data
	const fetchUrl =
		"https://raw.githubusercontent.com/AhmadzadehSanaz/Studio-Lab-Healthcare-Ellinger/main/Data%20Pipeline/hexagon_collection_master.geojson";

	const [ history, setHistory ] = useState([]);
	const [ data, setData ] = useState(null);

	const handleHistory = (newCluster) => {
		let historyCopy = [ ...history ];
		historyCopy.push(newCluster);
		setHistory(historyCopy);
	};

	const handleIteration = (index) => {
		let ClusterData = history[index];
		let dataCopy = JSON.parse(JSON.stringify(data));
		dataCopy.features.forEach((f) => {
			f.properties.clusters = ClusterData.fidClusterMap[f.properties.fid];
		});
		setData(dataCopy);
	};

	async function getData (){
		axios
			.get(fetchUrl)
			.then((res) => {
				let data = res.data;
				data.features.forEach((f) => (f.properties.clusters = "0"));
				setData(data);
			})
			.catch((err) => {
				console.log(err.message);
			});
	}
	useEffect(() => {
		getData();
	}, []);

	// State for getting user selected feature which will be passed to maps
	const [ userSelected, setUserSelected ] = useState("Preview_Map");

	// state for maps
	const [ userClicked, setUserClicked ] = useState(false);

	// state for toggle between table and viz
	const [ checkedMain, setCheckedMain ] = React.useState(false);
	const toggleCheckedMain = () => {
		setCheckedMain((prev) => !prev);
	};

	// Sate for getting features user selected for running the model
	const [ userFeatures, setUserFeatures ] = useState(null);

	// State for submit

	const [ userSubmit, setUserSubmit ] = useState(false);
	const toggleSubmit = () => {
		setUserSubmit((prev) => !prev);
	};

	// Sending POST request to ML API using axios

	const handleSubmit = (clusterNum, Features) => {
		let mlApiUrl = "/get_kmeans_cluster/";

		// replacing space with _ for sending to serve
		let featuresToAPI = Features.map((item) => item.replace(/ /g, "_"));
		let mlRequest = {
			"selected features": featuresToAPI,
			"number of clusters": clusterNum
		};

		setIsSending(true);

		axios
			.post(mlApiUrl, JSON.stringify(mlRequest), {
				withCredentials: true,
				headers: {
					"Access-Control-Allow-Origin": "*",
					Accept: "application/json",
					"Content-Type": "application/json"
				}
			})
			.then(function (response){
				let responseData = response.data;

				let fidClusterMap = {};
				Object.keys(responseData).forEach((f) => {
					f = responseData[f];
					fidClusterMap[f.fid] = f.clusters.toString();
				});
				handleHistory({
					features: featuresToAPI,
					fidClusterMap: fidClusterMap
				});

				let dataCopy = JSON.parse(JSON.stringify(data));
				dataCopy.features.forEach((f) => {
					f.properties.clusters = fidClusterMap[f.properties.fid];
				});
				setData(dataCopy);
				setIsSending(false);
			})
			.catch(function (error){
				console.log(error);
				setIsSending(false);
			});
	};
	//

	// if (userFeatures !== null) {
	// 	let featuresToOptCluster = userFeatures.map((item) => item.replace(/ /g, "_"));

	// 	let mlOptClusterNumURL = "/get_kmeans_silouhette_optimun_cluster_number/";

	// 	let mlOptNumRequest = {
	// 		"selected features": featuresToOptCluster
	// 	};

	// 	// console.log(mlOptNumRequest, "ml");
	// 	axios
	// 		.post(mlOptClusterNumURL, JSON.stringify(mlOptNumRequest), {
	// 			withCredentials: true,
	// 			headers: {
	// 				"Access-Control-Allow-Origin": "*",
	// 				Accept: "application/json",
	// 				"Content-Type": "application/json"
	// 			}
	// 		})
	// 		.then(function (response){
	// 			let responseData = response.data;
	// 			console.log(responseData, "opt");
	// 		})
	// 		.catch(function (error){
	// 			console.log(error);
	// 		});

	// 	// console.log(featuresToOptCluster, "userml");
	// }

	const handleUpdateCluster = (clusterData) => {};
	return (
		<div className='App'>
			{
				data !== null ? <div className='containerDash'>
					{/* ------------------ NavBar ------------------*/}
					<nav className='navDash generalComp'>
						<Navbar />
					</nav>

					{/*  ------------------Map History Browser ------------------  */}
					<div className='mainDash generalComp'>
						<Synthesizer history={history} handleIteration={handleIteration} />
					</div>

					{/*  ------------------ Data Selector ------------------ */}

					<div className='sidebarDash generalComp' style={{ padding: "5px" }}>
						<ListSelector
							dataProps={data}
							methodProps={setUserSelected}
							featureProps={setUserFeatures}
							handleSubmit={handleSubmit}
							userFeatures={userFeatures}
						/>
						{
							isSending ? <div
								style={{
									height: "60px",
									display: "flex",
									justifyContent: "center",
									alignItems: "center"
								}}>
								<Loading />
							</div> :
							<MLSetup
								handleHistory={handleHistory}
								handleSubmit={handleSubmit}
								userFeatures={userFeatures}
							/>}
					</div>

					{/*  ------------------ Map Preview ------------------*/}
					<div className='content4 generalComp'>
						<span>
							<PreviewMap
								dataProps={data}
								userSelectedItems={userSelected}
								userClickedProp={userClicked}
							/>
						</span>
					</div>
					{/* ------------------ Main Map ------------------*/}
					<div className='content5 generalComp'>
						<span>
							<Mainmap
								dataProps={data}
								userSelectedItems={"clusters"}
								userClickedProp={userClicked}
							/>
						</span>
					</div>

					{/* ------------------ Mix Viz ------------------*/}
					<div
						className='content6 generalComp'
						style={{
							display: "grid",

							placeItems: "center"
						}}>
						<BoxPlot data={data} columnName={userSelected} />
					</div>

					{/* ----------- Data Table /Viz ------------------ */}
					<div className='content7 generalComp' id='tble' ref={stageCanvasRef}>
						<WorldTable
							style={{ padding: "5px" }}
							dataProps={data}
							userFeaturesProps={userFeatures}
							heightProp={divHeight}
						/>
					</div>
				</div> :
				// Loading
				<div
					style={{
						height: "100vh",
						display: "flex",
						justifyContent: "center",
						alignItems: "center"
					}}>
					<Loading />
				</div>}
		</div>
	);
}

export default DashApp;
