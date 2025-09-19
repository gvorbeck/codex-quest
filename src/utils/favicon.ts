/**
 * Utility functions for dynamically changing favicon based on app mode
 */

import { isMockMode } from "@/lib/mockMode";

/**
 * Creates a simple colored favicon as a data URL
 * @param color - The color for the favicon (hex or CSS color)
 * @param size - Size of the favicon (default: 32)
 */
function createColoredFavicon(color: string, size: number = 32): string {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return "";
  }

  canvas.width = size;
  canvas.height = size;

  // Create a simple colored circle or square
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);

  // Add a border
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, size - 2, size - 2);

  // Add a small "M" for mock mode
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("M", size / 2, size / 2);

  return canvas.toDataURL("image/png");
}

/**
 * Updates the favicon links in the document head
 * @param href - The new favicon URL (can be a file path or data URL)
 */
function updateFaviconLinks(href: string): void {
  // Update all favicon links
  const faviconLinks = document.querySelectorAll('link[rel*="icon"]');

  faviconLinks.forEach((link) => {
    const linkElement = link as HTMLLinkElement;
    linkElement.href = href;
  });

  // Also update shortcut icon if it exists
  const shortcutIcon = document.querySelector(
    'link[rel="shortcut icon"]'
  ) as HTMLLinkElement;
  if (shortcutIcon) {
    shortcutIcon.href = href;
  }
}

/**
 * Sets the favicon based on whether the app is in mock mode
 * @param isMockMode - Whether the app is running in mock mode
 */
export function setFaviconForMode(isMockMode: boolean): void {
  if (isMockMode) {
    // Create a orange/amber colored favicon for mock mode
    const mockFavicon = createColoredFavicon("#f59e0b"); // amber-500
    updateFaviconLinks(mockFavicon);

    // Also update the document title to indicate mock mode
    const currentTitle = document.title;
    if (!currentTitle.includes("Mock")) {
      document.title = currentTitle.replace("Codex.Quest", "Codex.Mock");
    }
  } else {
    // Use the original favicon for production mode
    updateFaviconLinks("/icons/favicon.ico");

    // Ensure title doesn't have mock in it
    const currentTitle = document.title;
    if (currentTitle.includes("Mock")) {
      document.title = currentTitle.replace("Codex.Mock", "Codex.Quest");
    }
  }
}

/**
 * Initialize favicon based on current mode
 * Call this when the app loads
 */
export function initializeFavicon(): void {
  setFaviconForMode(isMockMode());
}
