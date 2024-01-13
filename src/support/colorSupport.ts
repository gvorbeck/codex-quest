export enum ColorScheme {
  SEABUCKTHORN = "#F9B32A",
  SUSHI = "#80B045",
  CALIFORNIA = "#FDA00D",
  POMEGRANATE = "#F44336",
  SHIPGRAY = "#3E3643",
  SPRINGWOOD = "#F4F5EB",
  STONE = "#9F9B8F",
  RUST = "#965247",
}

export const hexToRgba = (hex: string, alpha = 1) => {
  // Ensure the hex value starts with a hash symbol
  const sanitizedHex = hex.startsWith("#") ? hex : "#" + hex;

  // Extract red, green, and blue values
  const [r, g, b] =
    sanitizedHex.length === 7
      ? [
          parseInt(sanitizedHex.slice(1, 3), 16),
          parseInt(sanitizedHex.slice(3, 5), 16),
          parseInt(sanitizedHex.slice(5, 7), 16),
        ]
      : [
          parseInt(sanitizedHex.slice(1, 2).repeat(2), 16),
          parseInt(sanitizedHex.slice(2, 3).repeat(2), 16),
          parseInt(sanitizedHex.slice(3, 4).repeat(2), 16),
        ];

  // Return the RGBA string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
