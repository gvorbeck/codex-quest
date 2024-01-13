import { toSlugCase } from "@/support/stringSupport";

export const useImages = () => {
  const getRaceClassImage = (name: string) => {
    const classImages = import.meta.glob("@/assets/images/classes/*.jpg");
    const raceImages = import.meta.glob("@/assets/images/races/*.jpg");

    return (
      classImages[`/src/assets/images/classes/${toSlugCase(name)}.jpg`]?.name ??
      raceImages[`/src/assets/images/races/${toSlugCase(name)}.jpg`]?.name
    );
  };

  const getSpellImage = (name: string) => {
    const spellImages = import.meta.glob("@/assets/images/spells/*.jpg");
    return spellImages[`/src/assets/images/spells/${toSlugCase(name)}.jpg`]
      ?.name;
  };
  return { getRaceClassImage, getSpellImage };
};
