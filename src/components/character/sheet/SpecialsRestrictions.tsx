import { useMemo } from "react";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@/components/ui/layout";
import { type DescriptionItem } from "@/components/ui/display";
import { CharacterSheetSectionWrapper } from "@/components/ui/layout";
import type { Character } from "@/types/character";
import { allRaces } from "@/data/races";
import { allClasses } from "@/data/classes";
// Removed unused imports

interface SpecialsRestrictionsProps {
  character: Character;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function SpecialsRestrictions({ 
  character, 
  className = "",
  size = "md"
}: SpecialsRestrictionsProps) {
  const race = useMemo(() => {
    return allRaces.find(r => r.id === character.race?.toLowerCase());
  }, [character.race]);

  const classes = useMemo(() => {
    return character.class.map(classId => 
      allClasses.find(c => c.id === classId?.toLowerCase())
    ).filter(Boolean);
  }, [character.class]);

  const raceItems = useMemo((): DescriptionItem[] => {
    const items: DescriptionItem[] = [];

    if (race?.specialAbilities?.length) {
      race.specialAbilities.forEach(ability => {
        items.push({
          label: ability.name,
          children: ability.description
        });
      });
    }

    if (race?.prohibitedWeapons?.length) {
      items.push({
        label: "Weapon Restrictions",
        children: `May not employ ${race.prohibitedWeapons.join(", ")} more than four feet in length`
      });
    }

    return items;
  }, [race]);

  const classItems = useMemo((): DescriptionItem[] => {
    const items: DescriptionItem[] = [];

    classes.forEach(charClass => {
      if (charClass?.specialAbilities?.length) {
        charClass.specialAbilities.forEach(ability => {
          items.push({
            label: ability.name,
            children: ability.description
          });
        });
      }
    });

    return items;
  }, [classes]);

  return (
    <CharacterSheetSectionWrapper 
      title="Restrictions & Special Abilities" 
      size={size}
      className={className}
    >
      {/* Tabs inside the component */}
      <Tabs defaultValue="race" variant="underline">
        <div className="px-6 pt-4 border-b border-zinc-700/50">
          <TabList aria-label="Restrictions & Special Abilities">
            {race && <Tab value="race">{race.name}</Tab>}
            {classes.length > 0 && (
              <Tab value="class">
                {classes.length === 1 ? classes[0]?.name : "Classes"}
              </Tab>
            )}
          </TabList>
        </div>

        {/* Scrollable content area */}
        <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-600 hover:scrollbar-thumb-zinc-500">
          <TabPanels>
            {race && (
              <TabPanel value="race">
                <div className="p-6 space-y-4">
                  {raceItems.length > 0 ? (
                    raceItems.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-lg p-4 bg-zinc-750/30 border border-zinc-600/50 transition-all duration-200 hover:bg-zinc-700/40 hover:border-amber-400/30 group/card"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-amber-400 rounded-full group-hover/card:bg-amber-300 transition-colors duration-200"></div>
                          <h4 className="text-amber-400 text-sm font-semibold group-hover/card:text-amber-300 transition-colors duration-200">
                            {item.label}
                          </h4>
                        </div>
                        <div className="text-zinc-100 text-sm leading-relaxed">
                          {item.children}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg p-4 bg-zinc-750/30 border border-zinc-600/50">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-zinc-500 rounded-full"></div>
                        <h4 className="text-zinc-400 text-sm font-semibold">No Restrictions</h4>
                      </div>
                      <div className="text-zinc-300 text-sm">
                        No special abilities or restrictions for this race.
                      </div>
                    </div>
                  )}
                </div>
              </TabPanel>
            )}

            {classes.length > 0 && (
              <TabPanel value="class">
                <div className="p-6 space-y-4">
                  {classItems.length > 0 ? (
                    classItems.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-lg p-4 bg-zinc-750/30 border border-zinc-600/50 transition-all duration-200 hover:bg-zinc-700/40 hover:border-amber-400/30 group/card"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-amber-400 rounded-full group-hover/card:bg-amber-300 transition-colors duration-200"></div>
                          <h4 className="text-amber-400 text-sm font-semibold group-hover/card:text-amber-300 transition-colors duration-200">
                            {item.label}
                          </h4>
                        </div>
                        <div className="text-zinc-100 text-sm leading-relaxed">
                          {item.children}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg p-4 bg-zinc-750/30 border border-zinc-600/50">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-zinc-500 rounded-full"></div>
                        <h4 className="text-zinc-400 text-sm font-semibold">No Restrictions</h4>
                      </div>
                      <div className="text-zinc-300 text-sm">
                        No special abilities or restrictions for {classes.length === 1 ? 'this class' : 'these classes'}.
                      </div>
                    </div>
                  )}
                </div>
              </TabPanel>
            )}
          </TabPanels>
        </div>
      </Tabs>
    </CharacterSheetSectionWrapper>
  );
}