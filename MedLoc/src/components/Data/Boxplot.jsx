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
import * as d3 from "d3";

class Boxplot extends React.Component {
  //   constructor() {
  //     super();
  //     this.state = {};
  //   }
  state = {};

  breaks = new Set(this.props.data.features.map((f) => f.properties.clusters));
  // console.log(breaks);
  colorScale = d3.scaleOrdinal().domain(this.breaks).range(d3.schemeCategory10);

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
          domainPadding={30}
          width={500}
          height={300}
          //   theme={VictoryTheme.material}
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
            y={25}
            textAnchor="middle"
          />
          <VictoryBoxPlot
            style={{
              //   min: { stroke: "tomato" },
              //   max: { stroke: "orange" },
              q1: {
                fill: (d) => {
                  console.log(d);
                  return this.colorScale(d.datum.x);
                },
              },
              q3: {
                fill: (d) => {
                  console.log(d);
                  return this.colorScale(d.datum.x);
                },
              },
              median: { stroke: "white", strokeWidth: 2 },
              //   minLabels: { fill: "tomato" },
              //   maxLabels: { fill: "orange" },
            }}
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
