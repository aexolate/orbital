import React, { useState } from 'react';
import * as Location from 'expo-location';

export const WaypointsManager = () => {
  const [waypoints, setWaypoints] = React.useState([]);

  const addWaypoint = (coord) => {
    setWaypoints((wp) => [...wp, coord]);
  };

  const removeWaypoint = (coord) => {
    setWaypoints((wp) =>
      wp.filter((x) => {
        !(x.latitude == coord.latitude && x.longitude == coord.longitude);
      }),
    );
  };

  const getWaypoints = () => {
    return waypoints;
  };

  const getWaypointCount = () => {
    return waypoints.length;
  };

  //const distanceToNearestWaypoint = () => {
  //TODO
  //};

  return { addWaypoint, removeWaypoint, getWaypoints, getWaypointCount };
};
export default WaypointsManager;
