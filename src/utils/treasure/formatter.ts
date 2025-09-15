import type { TreasureResult } from "./types";

export function formatTreasureResult(treasure: TreasureResult): string {
  const parts: string[] = [];
  
  // Add description
  parts.push(`**${treasure.description}**\n`);
  
  // Add coins
  const coins: string[] = [];
  if (treasure.platinum > 0) coins.push(`${treasure.platinum} pp`);
  if (treasure.gold > 0) coins.push(`${treasure.gold} gp`);
  if (treasure.electrum > 0) coins.push(`${treasure.electrum} ep`);
  if (treasure.silver > 0) coins.push(`${treasure.silver} sp`);
  if (treasure.copper > 0) coins.push(`${treasure.copper} cp`);
  
  if (coins.length > 0) {
    parts.push(`**Coins:** ${coins.join(", ")}`);
  }
  
  // Add gems and jewelry
  if (treasure.gemsAndJewelry.length > 0) {
    parts.push(`**Gems & Jewelry:**`);
    treasure.gemsAndJewelry.forEach(item => {
      parts.push(`• ${item}`);
    });
  }
  
  // Add magic items
  if (treasure.magicItems.length > 0) {
    parts.push(`**Magic Items:**`);
    treasure.magicItems.forEach(item => {
      parts.push(`• ${item}`);
    });
  }
  
  // Add breakdown if requested
  if (treasure.breakdown.length > 0) {
    parts.push(`\n**Generation Details:**`);
    treasure.breakdown.forEach(detail => {
      parts.push(`• ${detail}`);
    });
  }
  
  return parts.join("\n");
}