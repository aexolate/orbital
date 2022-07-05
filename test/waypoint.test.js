import { distanceBetween } from '../src/utils/distance.js';

describe('WaypointsManager', () => {
  it('sameCoords', () => {
    const c1 = {latitude: 0, longitude: 0};
    const c2 = {latitude: 0, longitude: 0};
    const dist = distanceBetween(c1, c2);
    expect(dist).toBe(0);
  });

  it('differentCoords', () => {
    const c1 = {latitude: 40.689202777778, longitude: -74.044219444444};
    const c2 = {latitude: 38.889069444444, longitude: -77.034502777778};
    const dist = distanceBetween(c1, c2);
    expect(dist.toFixed(2)).toBe('324534.89');
  });

  it('missing values', () => {
    const c1 = {latitude: 0};
    const c2 = {latitude: 1, longitude: 1};
    const dist = distanceBetween(c1, c2);
    expect(dist).toBe(NaN);
  });

  it('missing values_2', () => {
    const c1 = {foo: 0};
    const c2 = {par: 1, bar: 1};
    const dist = distanceBetween(c1, c2);
    expect(dist).toBe(NaN);
  });
});
