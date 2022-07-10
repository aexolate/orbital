import React from 'react';
import { distanceBetween } from '../utils/distance';

export type Waypoint = {
  title: string;
  latitude: number;
  longitude: number;
  radius: number;
};

export type LatLng = {
  latitude: number;
  longitude: number;
};

export const WaypointsManager = () => {
  const [waypoints, setWaypoints] = React.useState<Waypoint[]>([]);

  //Removes all the stored waypoints
  const clearWaypoints = () => setWaypoints([]);

  //Returns the number of waypoints stored
  const getWaypointCount = () => waypoints.length;

  /**
   * Add a waypoint to the storage
   * @param waypoint Waypoint to be added
   */
  const addWaypoint = (waypoint: Waypoint) => setWaypoints((cur) => [...cur, waypoint]);

  //Remove waypoint(s) with the same coordinate from storage
  const removeWaypoint = (coords: LatLng) => {
    setWaypoints((wp) =>
      wp.filter((x) => !(x.latitude == coords.latitude && x.longitude == coords.longitude)),
    );
  };

  //Returns the distance to the nearest waypoint from a provided coordinate
  const distanceToNearestWP = (coords: LatLng) => {
    return Math.min(...waypoints.map((wp) => distanceBetween(wp, coords)));
  };

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
