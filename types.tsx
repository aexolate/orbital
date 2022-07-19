export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Waypoint = {
  title: string;
  radius: number;
  coords: Coordinates;
};

export type Alarm = {
  title: string;
  waypoints: Waypoint[];
};
