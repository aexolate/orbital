import { LatLng } from './WaypointsManager';

/**
 * Calculates the great-circle distance between two coordinates using haversine formula
 * i.e. shortest distance over earth's surface
 * @param {LatLng} c1 First Coordinate
 * @param {LatLng} c2 Second Coordinate
 * @returns {Number} distance between the two coordinates
 */
export const distanceBetween = (c1: LatLng, c2: LatLng): number => {
  let lat1 = c1.latitude;
  let lon1 = c1.longitude;
  let lat2 = c2.latitude;
  let lon2 = c2.longitude;
  let R = 6371e3; //Earth's Radius 6371km
  let phi1 = (lat1 * Math.PI) / 180;
  let phi2 = (lat2 * Math.PI) / 180;
  let dPhi = ((lat2 - lat1) * Math.PI) / 180;
  let dLambda = ((lon2 - lon1) * Math.PI) / 180;
  let a =
    Math.sin(dPhi / 2) * Math.sin(dPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) * Math.sin(dLambda / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; //distance in metres
};
