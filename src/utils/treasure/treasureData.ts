import type { 
  LairTreasureType, 
  IndividualTreasureType, 
  UnguardedTreasureLevel,
  TreasureConfig,
  IndividualTreasureConfig,
  UnguardedTreasureConfig
} from "./types";

export const LAIR_TREASURE_CONFIGS: Record<LairTreasureType, TreasureConfig> = {
  A: {
    copper: { chance: 50, amount: "5d6" },
    silver: { chance: 60, amount: "5d6" },
    electrum: { chance: 40, amount: "5d4" },
    gold: { chance: 70, amount: "10d6" },
    platinum: { chance: 50, amount: "1d10" },
    gems: { chance: 50, amount: "6d6" },
    jewelry: { chance: 50, amount: "6d6" },
    magic: { chance: 30, amount: 3 }
  },
  B: {
    copper: { chance: 75, amount: "5d10" },
    silver: { chance: 50, amount: "5d6" },
    electrum: { chance: 50, amount: "5d4" },
    gold: { chance: 50, amount: "3d6" },
    platinum: { chance: 0, amount: "0" },
    gems: { chance: 25, amount: "1d6" },
    jewelry: { chance: 25, amount: "1d6" },
    magic: { chance: 10, amount: 1 }
  },
  C: {
    copper: { chance: 60, amount: "6d6" },
    silver: { chance: 60, amount: "5d4" },
    electrum: { chance: 30, amount: "2d6" },
    gold: { chance: 0, amount: "0" },
    platinum: { chance: 0, amount: "0" },
    gems: { chance: 25, amount: "1d4" },
    jewelry: { chance: 25, amount: "1d4" },
    magic: { chance: 15, amount: 2 }
  },
  D: {
    copper: { chance: 30, amount: "4d6" },
    silver: { chance: 45, amount: "6d6" },
    electrum: { chance: 0, amount: "0" },
    gold: { chance: 90, amount: "5d8" },
    platinum: { chance: 0, amount: "0" },
    gems: { chance: 30, amount: "1d8" },
    jewelry: { chance: 30, amount: "1d8" },
    magic: { chance: 20, amount: 2 }
  },
  E: {
    copper: { chance: 30, amount: "2d8" },
    silver: { chance: 60, amount: "6d10" },
    electrum: { chance: 50, amount: "3d8" },
    gold: { chance: 50, amount: "4d10" },
    platinum: { chance: 0, amount: "0" },
    gems: { chance: 10, amount: "1d10" },
    jewelry: { chance: 10, amount: "1d10" },
    magic: { chance: 30, amount: 4 }
  },
  F: {
    copper: { chance: 0, amount: "0" },
    silver: { chance: 40, amount: "3d8" },
    electrum: { chance: 50, amount: "4d8" },
    gold: { chance: 85, amount: "6d10" },
    platinum: { chance: 70, amount: "2d8" },
    gems: { chance: 20, amount: "2d12" },
    jewelry: { chance: 10, amount: "1d12" },
    magic: { chance: 35, amount: 4 }
  },
  G: {
    copper: { chance: 0, amount: "0" },
    silver: { chance: 0, amount: "0" },
    electrum: { chance: 0, amount: "0" },
    gold: { chance: 90, amount: "4d6x10" },
    platinum: { chance: 75, amount: "5d8" },
    gems: { chance: 25, amount: "3d6" },
    jewelry: { chance: 25, amount: "1d10" },
    magic: { chance: 50, amount: 4 }
  },
  H: {
    copper: { chance: 0, amount: "0" },
    silver: { chance: 0, amount: "0" },
    electrum: { chance: 0, amount: "0" },
    gold: { chance: 0, amount: "0" },
    platinum: { chance: 0, amount: "0" },
    gems: { chance: 0, amount: "0" },
    jewelry: { chance: 0, amount: "0" },
    magic: { chance: 0, amount: 4 }
  },
  I: {
    copper: { chance: 0, amount: "0" },
    silver: { chance: 0, amount: "0" },
    electrum: { chance: 0, amount: "0" },
    gold: { chance: 0, amount: "0" },
    platinum: { chance: 80, amount: "3d10" },
    gems: { chance: 50, amount: "2d6" },
    jewelry: { chance: 50, amount: "2d6" },
    magic: { chance: 15, amount: 1 }
  },
  J: {
    copper: { chance: 45, amount: "3d8" },
    silver: { chance: 45, amount: "1d8" },
    electrum: { chance: 0, amount: "0" },
    gold: { chance: 0, amount: "0" },
    platinum: { chance: 0, amount: "0" },
    gems: { chance: 0, amount: "0" },
    jewelry: { chance: 0, amount: "0" },
    magic: { chance: 0, amount: 0 }
  },
  K: {
    copper: { chance: 0, amount: "0" },
    silver: { chance: 90, amount: "2d10" },
    electrum: { chance: 35, amount: "1d8" },
    gold: { chance: 0, amount: "0" },
    platinum: { chance: 0, amount: "0" },
    gems: { chance: 0, amount: "0" },
    jewelry: { chance: 0, amount: "0" },
    magic: { chance: 0, amount: 0 }
  },
  L: {
    copper: { chance: 0, amount: "0" },
    silver: { chance: 0, amount: "0" },
    electrum: { chance: 0, amount: "0" },
    gold: { chance: 0, amount: "0" },
    platinum: { chance: 0, amount: "0" },
    gems: { chance: 50, amount: "1d4" },
    jewelry: { chance: 0, amount: "0" },
    magic: { chance: 0, amount: 0 }
  },
  M: {
    copper: { chance: 0, amount: "0" },
    silver: { chance: 0, amount: "0" },
    electrum: { chance: 0, amount: "0" },
    gold: { chance: 90, amount: "4d10" },
    platinum: { chance: 90, amount: "2d8x10" },
    gems: { chance: 55, amount: "5d4" },
    jewelry: { chance: 45, amount: "2d6" },
    magic: { chance: 0, amount: 0 }
  },
  N: {
    copper: { chance: 0, amount: "0" },
    silver: { chance: 0, amount: "0" },
    electrum: { chance: 0, amount: "0" },
    gold: { chance: 0, amount: "0" },
    platinum: { chance: 0, amount: "0" },
    gems: { chance: 0, amount: "0" },
    jewelry: { chance: 0, amount: "0" },
    magic: { chance: 40, amount: 4 }
  },
  O: {
    copper: { chance: 0, amount: "0" },
    silver: { chance: 0, amount: "0" },
    electrum: { chance: 0, amount: "0" },
    gold: { chance: 0, amount: "0" },
    platinum: { chance: 0, amount: "0" },
    gems: { chance: 0, amount: "0" },
    jewelry: { chance: 0, amount: "0" },
    magic: { chance: 50, amount: 4 }
  }
};

export const INDIVIDUAL_TREASURE_CONFIGS: Record<IndividualTreasureType, IndividualTreasureConfig> = {
  P: {
    copper: { amount: "3d8" },
    silver: { amount: "0" },
    electrum: { amount: "0" },
    gold: { amount: "0" },
    platinum: { amount: "0" },
    gems: { amount: "0" },
    jewelry: { amount: "0" },
    magic: { amount: 0 }
  },
  Q: {
    copper: { amount: "0" },
    silver: { amount: "3d6" },
    electrum: { amount: "0" },
    gold: { amount: "0" },
    platinum: { amount: "0" },
    gems: { amount: "0" },
    jewelry: { amount: "0" },
    magic: { amount: 0 }
  },
  R: {
    copper: { amount: "0" },
    silver: { amount: "0" },
    electrum: { amount: "2d6" },
    gold: { amount: "0" },
    platinum: { amount: "0" },
    gems: { amount: "0" },
    jewelry: { amount: "0" },
    magic: { amount: 0 }
  },
  S: {
    copper: { amount: "0" },
    silver: { amount: "0" },
    electrum: { amount: "0" },
    gold: { amount: "2d4" },
    platinum: { amount: "0" },
    gems: { amount: "0" },
    jewelry: { amount: "0" },
    magic: { amount: 0 }
  },
  T: {
    copper: { amount: "0" },
    silver: { amount: "0" },
    electrum: { amount: "0" },
    gold: { amount: "0" },
    platinum: { amount: "1d6" },
    gems: { amount: "0" },
    jewelry: { amount: "0" },
    magic: { amount: 0 }
  },
  U: {
    copper: { chance: 50, amount: "1d20" },
    silver: { chance: 50, amount: "1d20" },
    electrum: { chance: 0, amount: "0" },
    gold: { chance: 25, amount: "1d20" },
    platinum: { chance: 0, amount: "0" },
    gems: { chance: 5, amount: "1d4" },
    jewelry: { chance: 5, amount: "1d4" },
    magic: { chance: 2, amount: 1 }
  },
  V: {
    copper: { chance: 0, amount: "0" },
    silver: { chance: 25, amount: "1d20" },
    electrum: { chance: 25, amount: "1d20" },
    gold: { chance: 50, amount: "1d20" },
    platinum: { chance: 25, amount: "1d20" },
    gems: { chance: 10, amount: "1d4" },
    jewelry: { chance: 10, amount: "1d4" },
    magic: { chance: 5, amount: 1 }
  }
};

export const UNGUARDED_TREASURE_CONFIGS: Record<UnguardedTreasureLevel, UnguardedTreasureConfig> = {
  1: {
    copper: { chance: 75, amount: "1d8" },
    silver: { chance: 50, amount: "1d6" },
    electrum: { chance: 25, amount: "1d4" },
    gold: { chance: 7, amount: "1d4" },
    platinum: { chance: 1, amount: "1d4" },
    gems: { chance: 7, amount: "1d4" },
    jewelry: { chance: 3, amount: "1d4" },
    magic: { chance: 2, amount: 1 }
  },
  2: {
    copper: { chance: 50, amount: "1d10" },
    silver: { chance: 50, amount: "1d8" },
    electrum: { chance: 25, amount: "1d6" },
    gold: { chance: 20, amount: "1d6" },
    platinum: { chance: 2, amount: "1d4" },
    gems: { chance: 10, amount: "1d6" },
    jewelry: { chance: 7, amount: "1d4" },
    magic: { chance: 5, amount: 1 }
  },
  3: {
    copper: { chance: 30, amount: "2d6" },
    silver: { chance: 50, amount: "1d10" },
    electrum: { chance: 25, amount: "1d8" },
    gold: { chance: 50, amount: "1d6" },
    platinum: { chance: 4, amount: "1d4" },
    gems: { chance: 15, amount: "1d6" },
    jewelry: { chance: 7, amount: "1d6" },
    magic: { chance: 8, amount: 1 }
  },
  4: {
    copper: { chance: 20, amount: "3d6" },
    silver: { chance: 50, amount: "2d6" },
    electrum: { chance: 25, amount: "1d10" },
    gold: { chance: 50, amount: "2d6" },
    platinum: { chance: 8, amount: "1d4" },
    gems: { chance: 20, amount: "1d8" },
    jewelry: { chance: 10, amount: "1d6" },
    magic: { chance: 12, amount: 1 }
  },
  5: {
    copper: { chance: 15, amount: "4d6" },
    silver: { chance: 50, amount: "3d6" },
    electrum: { chance: 25, amount: "1d12" },
    gold: { chance: 70, amount: "2d8" },
    platinum: { chance: 15, amount: "1d4" },
    gems: { chance: 30, amount: "1d8" },
    jewelry: { chance: 15, amount: "1d6" },
    magic: { chance: 16, amount: 1 }
  },
  6: {
    copper: { chance: 10, amount: "5d6" },
    silver: { chance: 50, amount: "5d6" },
    electrum: { chance: 25, amount: "2d8" },
    gold: { chance: 75, amount: "4d6" },
    platinum: { chance: 30, amount: "1d4" },
    gems: { chance: 40, amount: "1d8" },
    jewelry: { chance: 30, amount: "1d8" },
    magic: { chance: 20, amount: 1 }
  },
  7: {
    copper: { chance: 10, amount: "5d6" },
    silver: { chance: 50, amount: "5d6" },
    electrum: { chance: 25, amount: "2d8" },
    gold: { chance: 75, amount: "4d6" },
    platinum: { chance: 30, amount: "1d4" },
    gems: { chance: 40, amount: "1d8" },
    jewelry: { chance: 30, amount: "1d8" },
    magic: { chance: 20, amount: 1 }
  },
  8: {
    copper: { chance: 10, amount: "5d6" },
    silver: { chance: 50, amount: "5d6" },
    electrum: { chance: 25, amount: "2d8" },
    gold: { chance: 75, amount: "4d6" },
    platinum: { chance: 30, amount: "1d4" },
    gems: { chance: 40, amount: "1d8" },
    jewelry: { chance: 30, amount: "1d8" },
    magic: { chance: 20, amount: 1 }
  }
};