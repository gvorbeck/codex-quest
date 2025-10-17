/**
 * Equipment-related constants for restriction mapping and validation
 *
 * These mappings handle cases where class/race restriction IDs don't exactly match
 * equipment names in the database (e.g., "walking-staff" -> "quarterstaff")
 */

/**
 * Mapping of class/race weapon restriction IDs to equipment names
 * Used to properly match weapon restrictions with actual equipment items
 */
export const WEAPON_ID_MAPPING: Record<string, string[]> = {
  dagger: ["dagger"],
  "walking-staff": ["quarterstaff"],
  warhammer: ["warhammer"],
  mace: ["mace"],
  maul: ["maul"],
  club: ["club"],
  quarterstaff: ["quarterstaff"],
  sling: ["sling"],
  shortbow: ["shortbow"],
  sickle: ["sickle"],
  spade: ["spade"],
  scimitar: ["scimitar"],
  scythe: ["scythe"],
  greatsword: ["greatsword"],
  polearm: [
    "glaive",
    "halberd",
    "bill-guisarme",
    "bardiche",
    "bec-de-corbin",
    "fauchard",
    "glaive-guisarme",
    "guisarme",
    "lucern-hammer",
    "military-fork",
    "partisan",
    "ranseur",
    "spetum",
    "voulge",
  ],
  longbow: ["longbow"],
};

/**
 * Mapping of class armor restriction IDs to equipment names
 * Used to properly match armor restrictions with actual equipment items
 */
export const ARMOR_ID_MAPPING: Record<string, string[]> = {
  none: [], // Special case: no armor allowed
  padded: ["padded/quilted-armor"],
  leather: ["leather-armor"],
  studded: ["studded-leather-armor"],
  "studded-leather": ["studded-leather-armor"],
  hide: ["hide-armor"],
  ring: ["ring-mail"],
  "ring-mail": ["ring-mail"],
  brigandine: ["brigandine-armor"],
  chain: ["chain-mail"],
  "chain-mail": ["chain-mail"],
  scale: ["scale-mail"],
  "scale-mail": ["scale-mail"],
  splint: ["splint-mail"],
  "splint-mail": ["splint-mail"],
  banded: ["banded-mail"],
  "banded-mail": ["banded-mail"],
  plate: ["plate-mail"],
  "plate-mail": ["plate-mail"],
  "field-plate": ["field-plate-mail"],
  "field-plate-mail": ["field-plate-mail"],
  "full-plate": ["full-plate-mail"],
  "full-plate-mail": ["full-plate-mail"],
};
