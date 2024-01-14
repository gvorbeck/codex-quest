import { toSnakeCase } from "@/support/stringSupport";
import { images as classImages } from "@/assets/images/classes/imageAssets";
import { images as raceImages } from "@/assets/images/races/imageAssets";
import { images as spellImages } from "@/assets/images/spells/imageAssets";

export const useImages = () => {
  const getRaceClassImage = (name: string) =>
    classImages[toSnakeCase(name) as keyof typeof classImages] ??
    raceImages[toSnakeCase(name) as keyof typeof raceImages];

  const getSpellImage = (name: string) =>
    spellImages[toSnakeCase(name) as keyof typeof spellImages];

  return { getRaceClassImage, getSpellImage };
};
