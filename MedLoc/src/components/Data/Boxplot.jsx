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

  handleZoom(domain) {
    this.setState({ selectedDomain: domain });
  }

  handleBrush(domain) {
    this.setState({ zoomDomain: domain });
  }

  render() {
    let breaks = Array.from(
      new Set(this.props.data.features.map((f) => f.properties.clusters))
    ).sort((a, b) => {
      return +a - +b;
    });
    console.log(breaks);
    let colorScale = d3
      .scaleOrdinal()
      .domain(breaks)
      .range(d3.schemeCategory10);
    return (
      <div>
        <VictoryChart
          domainPadding={30}
          width={600}
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
            sortKey={(datum) => +datum.x}
            // sortOrder="descending"
            style={{
              //   min: { stroke: "tomato" },
              //   max: { stroke: "orange" },
              q1: {
                fill: (d) => {
                  return colorScale(d.datum.x);
                },
              },
              q3: {
                fill: (d) => {
                  return colorScale(d.datum.x);
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
