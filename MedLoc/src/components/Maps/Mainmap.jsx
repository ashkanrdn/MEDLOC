/* eslint-disable no-unreachable */
import React, { useState, useEffect, useRef } from "react";

import { Map, GeoJSON, TileLayer, LayersControl } from "react-leaflet";
import FeatureName from "./Legend";
import HighlightedGeoJson from "./HighlightedGeoJson";
import * as ss from "simple-statistics";
import * as d3 from "d3";
import L from "leaflet";
import Legend from "./Legend";
// import * as turf from "@turf/turf";

function MainMap(props) {
  //getting the first object from geojson to extract column names
  // console.log(props.dataProps);
  let dataPopulator = props.dataProps.features;
  const geojson = useRef();
  const legend = useRef(null);
  const map = useRef();
  const featureName = useRef(null);
  const MapName = useRef(null);

  if (dataPopulator !== null) {
    for (var key in dataPopulator) {
      if (dataPopulator.hasOwnProperty(key)) {
        let firstProp = dataPopulator[key];
        let listItems = Object.keys(firstProp.properties);

        // let listValue = Object.values(firstProp.properties);

        break;
      }
    }
  }

  // var dissolved = turf.dissolve(dataPopulator, { propertyName: "cluster" });

  //Getting the values from the feature and defining color ranges
  let columnName = props.userSelectedItems;
  let columnNameClean = columnName.replace(/_/g, " ");

  let columnValues = dataPopulator.map((f) => f.properties[columnName]);
  let type = typeof columnValues[0];
  let breaks;
  let colorScale;
  if (type !== "string") {
    let colorsBrewer = [
      "#8dd3c7,",
      "#ffffb3",
      "#bebada",
      "#fb8072",
      "#80b1d3",
      "#fdb462",
    ];
    let groups = ss.ckmeans(columnValues, 7);
    breaks = groups.map((cluster) => {
      return cluster[0];
    });

    //Quant Breaks
    colorScale = d3.scaleQuantile().domain(breaks).range(colorsBrewer);
  } else {
    breaks = new Set(columnValues);
    breaks = Array.from(breaks).sort((a, b) => {
      return +a - +b;
    });
    console.log(breaks);
    // console.log(breaks);
    colorScale = d3.scaleOrdinal().domain(breaks).range(d3.schemeCategory10);
  }

  // let extent = d3.extent(columnValues);
  // //Linear breaks
  // let colorScale = d3.scaleLinear().domain(d3.extent(columnValues)).range([ "coral", "blue" ]);
  // let colorScaleCategorical = d3
  // 	.scaleLinear()
  // 	.domain(d3.extent(columnValues))
  // 	.range([ "coral", "blue" ]);

  //Coloring each feature based on the user selected values from the list selector

  //Leaflet Components
  const { BaseLayer, Overlay } = LayersControl;

  //Map center on load
  const center = [41.8781, -87.6298];

  useEffect(() => {
    if (map.current) {
      function styles(feature) {
        return {
          fillColor: colorScale(feature.properties[columnName]),
          weight: 0,
          opacity: 1,
          color: "white",
          dashArray: "3",
          fillOpacity: 1,
        };
      }

      console.log(props.dataProps, "props");
      // if (type === "string") {
      // 	var dissolved = turf.dissolve(props.dataProps.features, {
      // 		propertyName: columnName
      // 	});
      // 	geojson.current = L.geoJSON(dissolved, { style: styles });
      // } else {
      // 	geojson.current = L.geoJSON(props.dataProps, { style: styles });
      // }
      geojson.current = L.geoJSON(props.dataProps, { style: styles });

      geojson.current.eachLayer(function (layer) {
        // console.log(layer);
        layer.bindPopup(
          `${columnName} : ${layer.feature.properties[columnName]}`
        );
      });
      // map.current.leafletElement.eachLayer((layer) => {
      // 	console.log(layer);
      // });
      if (legend.current !== null) {
        map.current.leafletElement.removeControl(legend.current);
      }
      if (geojson.current !== null) {
        map.current.leafletElement.removeLayer(geojson.current);
      }
      if (featureName.current !== null) {
        map.current.leafletElement.removeControl(featureName.current);
      }
      if (MapName.current !== null) {
        map.current.leafletElement.removeControl(MapName.current);
      }

      legend.current = L.control({ position: "topright" });
      featureName.current = L.control({ position: "topright" });
      MapName.current = L.control({ position: "bottomright" });

      featureName.current.onAdd = () => {
        const div = L.DomUtil.create("div", "info titleMap");
        div.innerHTML = `<p> ${columnNameClean}</p>`;
        return div;
      };

      MapName.current.onAdd = () => {
        const div = L.DomUtil.create("div", "info titleMap");
        div.innerHTML = `<p> Main Map </p>`;
        return div;
      };

      legend.current.onAdd = () => {
        const div = L.DomUtil.create("div", "info legend");
        // const grades = [
        // 	this.props.extentProps,
        // 	this.props.extentProps,
        // 	this.props.extentProps
        // ];
        let labels = [];
        let from;
        let to;
        breaks = Array.from(breaks);
        let breaksCopy = Array.from(breaks).slice(0, 7);
        // console.log(breaksCopy);
        // if (breaks > 7 && type === "string") {
        //   breaksCopy.push("Others...");
        // }
        for (let i = 0; i < breaksCopy.length; i++) {
          if (type === "number") {
            let isinteger = breaksCopy[i] % 1 === 0;
            from = isinteger ? breaksCopy[i] : breaks[i].toFixed(2);
            to = breaksCopy[i + 1]
              ? isinteger
                ? breaksCopy[i + 1]
                : breaksCopy[i + 1].toFixed(2)
              : breaksCopy[i + 1];
          } else {
            // console.log(breaksCopy[i].length);
            // from =
            //   breaksCopy[i].length > 20
            //     ? `${breaksCopy[i].slice(0, 20)}...`
            //     : breaksCopy[i];
            // to = undefined;
            from = breaksCopy[i];
            to = undefined;
          }

          labels.push(
            '<i style="background:' +
              colorScale(breaksCopy[i]) +
              '"></i> ' +
              from +
              (to ? " &ndash; " + to : type !== "string" ? "+" : "")
          );
        }

        div.innerHTML = labels.join("<br>");
        return div;
      };
      geojson.current.addTo(map.current.leafletElement);
      featureName.current.addTo(map.current.leafletElement);
      legend.current.addTo(map.current.leafletElement);
      MapName.current.addTo(map.current.leafletElement);
    }
  }, [columnName, props.dataProps]);

  // WIP Section end ____________________________________

  return (
    <Map
      attributionControl={false}
      ref={map}
      center={center}
      zoom={10}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="	https://api.mapbox.com/styles/v1/aradnia/ckilrttol26ng17pa9l4m0ucd/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYXJhZG5pYSIsImEiOiJjanlhZDdienQwNGN0M212MHp3Z21mMXhvIn0.lPiKb_x0vr1H62G_jHgf7w" />
    </Map>
  );
}
export default MainMap;
