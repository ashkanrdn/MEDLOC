import React from "react";
import {
  VictoryChart,
  VictoryZoomContainer,
  VictoryLine,
  VictoryBrushContainer,
  VictoryAxis,
  VictoryTheme,
  VictoryBoxPlot,
  VictoryLabel,
} from "victory";

class Boxplot extends React.Component {
  //   constructor() {
  //     super();
  //     this.state = {};
  //   }
  state = {};

  handleZoom(domain) {
    this.setState({ selectedDomain: domain });
  }

  handleBrush(domain) {
    this.setState({ zoomDomain: domain });
  }

  render() {
    // console.log(this.data);
    return (
      <div>
        <VictoryChart
          domainPadding={10}
          width={500}
          height={300}
          theme={VictoryTheme.material}
          // colorScale={"warm"}
          containerComponent={
            <VictoryZoomContainer
              responsive={false}
              zoomDimension="x"
              zoomDomain={this.state.zoomDomain}
              onZoomDomainChange={this.handleZoom.bind(this)}
            />
          }
        >
          <VictoryLabel
            text={`${this.props.columnName} by cluster`}
            x={225}
            y={20}
            textAnchor="middle"
          />
          <VictoryBoxPlot
            // style={{
            // 	data: {
            // 		fill: "tomato"
            // 	}
            // }}
            // boxWidth={20}
            data={this.props.data.features.map((f) => {
              return {
                x: f.properties.clusters,
                y: f.properties[this.props.columnName],
              };
            })}
          />
        </VictoryChart>
      </div>
    );
  }
}
export default Boxplot;
