
export interface RoomTemplate {
  id: string;
  name: string;
  imageUrl: string;
  defaultScale?: number;
  defaultPlaneSize?: [number, number];
  defaultCameraPosition?: [number, number, number];
  gridSize?: number;
  ambientLightIntensity?: number;
  furnitureStartPosition?: [number, number, number];
}

export const roomTemplates: RoomTemplate[] = [
  {
    id: 'living-room-1',
    name: 'Living Room',
    imageUrl: '/assets/templates/OIP.jpg',
    defaultScale: 1,
    defaultPlaneSize: [12, 7], // example
    defaultCameraPosition: [0, 2, 10],
    gridSize: 0.5,
    ambientLightIntensity: 0.6,
    furnitureStartPosition: [0, 0, 0],
  },
  // More templates later...
];
