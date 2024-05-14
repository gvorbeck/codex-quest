import config from "../../tailwind.config";

export const ColorScheme = {
  SEABUCKTHORN: config.theme.colors.seaBuckthorn,
  SUSHI: config.theme.colors.sushi,
  CALIFORNIA: config.theme.colors.california,
  POMEGRANATE: config.theme.colors.pomegranite,
  SHIPGRAY: config.theme.colors.shipGray,
  SPRINGWOOD: config.theme.colors.springWood,
  STONE: config.theme.colors.stone,
  RUST: config.theme.colors.rust,
};

export const darkenHexColor = (hex: string, percent: number): string => {
  // Convert hex to RGB first
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  // Decrease each RGB component by the percentage provided
  r = Math.floor(r * (1 - percent / 100));
  g = Math.floor(g * (1 - percent / 100));
  b = Math.floor(b * (1 - percent / 100));

  // Convert RGB back to hex
  return (
    "#" +
    ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()
  );
};

export const lightenHexColor = (hex: string, percent: number): string => {
  // Convert hex to RGB first
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  // Increase each RGB component by the percentage provided
  r = Math.floor(r + ((255 - r) * percent) / 100);
  g = Math.floor(g + ((255 - g) * percent) / 100);
  b = Math.floor(b + ((255 - b) * percent) / 100);

  // Ensure values don't exceed 255
  r = r > 255 ? 255 : r;
  g = g > 255 ? 255 : g;
  b = b > 255 ? 255 : b;

  // Convert RGB back to hex
  return (
    "#" +
    ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()
  );
};
