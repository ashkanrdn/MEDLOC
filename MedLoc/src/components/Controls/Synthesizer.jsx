import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
function a11yProps (index){
	return {
		id: `scrollable-auto-tab-${index}`,
		"aria-controls": `scrollable-auto-tabpanel-${index}`
	};
}

const useStyles = makeStyles((theme) => ({
	tabsRoot: { height: "30px" },
	tabRoot: { height: "42px" },
	root: {
		width: "100%",
		height: "50%"
	}
}));

export default function Synthesizer (props){
	const [ value, setValue ] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
		props.handleIteration(newValue);
		// console.log(newValue);
	};

	const tabs = props.history.map((clusters, i) => {
		return <Tab label={`Iter-${i}`} key={`Iter-${i}`} {...a11yProps(0)} />;
	});

	return (
		<Paper square>
			<Tabs
				style={{ height: "30px" }}
				value={value}
				onChange={handleChange}
				indicatorColor='primary'
				textColor='primary'
				variant='scrollable'
				scrollButtons='auto'
				aria-label='scrollable auto tabs example'>
				{/* <Tab label='Iteration One' {...a11yProps(0)} />
				<Tab label='Iteration Two' {...a11yProps(1)} />
				<Tab label='Iteration Three' {...a11yProps(2)} />
				<Tab label='Iteration Four' {...a11yProps(3)} />
				<Tab label='Iteration Five' {...a11yProps(4)} />
				<Tab label='Iteration Six' {...a11yProps(5)} />
				<Tab label='Iteration Seven' {...a11yProps(6)} /> */}
				{tabs}
			</Tabs>
		</Paper>
	);
}
