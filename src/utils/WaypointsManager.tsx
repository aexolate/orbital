import React from 'react';
import { distanceBetween } from '../utils/distance.js';

export const WaypointsManager = () => {
  const [waypoints, setWaypoints] = React.useState([]);

  const addWaypoint = (waypoint) => setWaypoints((wp) => [...wp, waypoint]);

  const removeWaypoint = (waypoint) => {
    setWaypoints((wp) =>
      wp.filter((x) => !(x.latitude == waypoint.latitude && x.longitude == waypoint.longitude)),
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
//   latitude: Number,
//   longitude: Number,
//   radius: Number,
// }
