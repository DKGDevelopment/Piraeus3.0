export const SKY34_VIEWER_CONFIG = {
  model: "/sky34-viewer/assets/sky34-viewer.glb",
  poster: "/sky34-viewer/assets/skyway-reference.webp",
  stageTexture: "/sky34-viewer/assets/sky34-dusk-texture.jpg",
  logo: "/sky34-viewer/assets/sky34-logo.png",
  defaultCameraOrbit: "35deg 68deg auto",
  fieldOfView: "35deg",
} as const;

export const SKY34_FLOORS = [
  "Ground", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
] as const;

export const SKY34_APARTMENTS = [
  "Apartment 01", "Apartment 02", "Apartment 03", "Apartment 04",
] as const;

export type Sky34UnitDetails = {
  apartment: string;
  floor: string;
  aspect: string;
  area: string;
  rooms: string;
  floorPlanUrl?: string;
};

export function getSky34UnitDetails(apartment: string, floor: string): Sky34UnitDetails {
  return {
    apartment,
    floor: floor === "Ground" ? "Ground floor" : `Floor ${floor}`,
    aspect: "To be confirmed",
    area: "To be confirmed",
    rooms: "To be confirmed",
  };
}

export const SKY34_MATERIAL_FAMILIES = {
  facade: { label: "Walls / balconies", color: "#c7b08e" },
  glazing: { label: "Blue glazing", color: "#174a78" },
  pool: { label: "Pool / water", color: "#1683aa" },
  light: { label: "Lighting accents", color: "#c86f4a" },
} as const;
