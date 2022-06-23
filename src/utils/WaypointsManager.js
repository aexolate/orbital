import React from 'react';
import { distanceBetween } from '../utils/distance.js';

export const WaypointsManager = () => {
  const [waypoints, setWaypoints] = React.useState([]);

  const addWaypoint = (coord) => setWaypoints((wp) => [...wp, coord]);

  const removeWaypoint = (coord) => {
    setWaypoints((wp) =>
      wp.filter((x) => !(x.latitude == coord.latitude && x.longitude == coord.longitude)),
    );
  };

  const clearWaypoints = () => setWaypoints([]);

  const getWaypointCount = () => waypoints.length;

  const distanceToNearestWP = (curLocation) =>
    Math.min(...waypoints.map((wp) => distanceBetween(wp, curLocation)));

  return {
    addWaypoint,
    removeWaypoint,
    waypoints,
    getWaypointCount,
    clearWaypoints,
    distanceToNearestWP,
  };
};
export default WaypointsManager;

// type LatLng = {
//   latitude: Number,
//   longitude: Number,
// }

// type Waypoint = {
//   title: String,
//   coords: LatLng,
//   radius: Number,
// }
