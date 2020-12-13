import React from "react";
import {
	VictoryChart,
	VictoryZoomContainer,
	VictoryLine,
	VictoryBrushContainer,
	VictoryAxis,
	VictoryTheme,
	VictoryBoxPlot
} from "victory";

class Boxplot extends React.Component {
	//   constructor() {
	//     super();
	//     this.state = {};
	//   }
	state = {};

	handleZoom (domain) {
		this.setState({ selectedDomain: domain });
	}

	handleBrush (domain) {
		this.setState({ zoomDomain: domain });
	}

	render () {
		// console.log(this.data);
		return (
			<div>
				<VictoryChart
					domainPadding={20}
					width={500}
					height={300}
					theme={VictoryTheme.material}
					colorScale={"warm"}
					style={{
						data: {
							fill: (datum) => {
								console.log(datum);
								return "red";
							},
							strokeWidth: (datum) => {
								return "green";
							}
						}
					}}
					containerComponent={
						<VictoryZoomContainer
							responsive={false}
							zoomDimension='x'
							zoomDomain={this.state.zoomDomain}
							onZoomDomainChange={this.handleZoom.bind(this)}
						/>
					}>
					<VictoryBoxPlot
						// boxWidth={20}
						data={this.props.data.features.map((f) => {
							return {
								x: f.properties.clusters,
								y: f.properties[this.props.columnName]
							};
						})}
					/>
				</VictoryChart>
			</div>
		);
	}
}
export default Boxplot;
