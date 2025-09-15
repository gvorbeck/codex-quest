import { useMemo } from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@/components/ui/layout";
import {
  type DescriptionItem,
  SkillDescriptionItem,
} from "@/components/ui/display";
import { SectionWrapper } from "@/components/ui/layout";
import { Typography, Card } from "@/components/ui/design-system";
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
  size = "md",
}: SpecialsRestrictionsProps) {
  const race = useMemo(() => {
    return allRaces.find((r) => r.id === character.race?.toLowerCase());
  }, [character.race]);

  const classes = useMemo(() => {
    return character.class
      .map((classId) => allClasses.find((c) => c.id === classId?.toLowerCase()))
      .filter(Boolean);
  }, [character.class]);

  const raceItems = useMemo((): DescriptionItem[] => {
    const items: DescriptionItem[] = [];

    if (race?.specialAbilities?.length) {
      race.specialAbilities.forEach((ability) => {
        items.push({
          label: ability.name,
          children: ability.description,
        });
      });
    }

    if (race?.prohibitedWeapons?.length) {
      items.push({
        label: "Weapon Restrictions",
        children: `May not employ ${race.prohibitedWeapons.join(
          ", "
        )} more than four feet in length`,
      });
    }

    return items;
  }, [race]);

  const classItems = useMemo((): DescriptionItem[] => {
    const items: DescriptionItem[] = [];

    classes.forEach((charClass) => {
      if (charClass?.specialAbilities?.length) {
        charClass.specialAbilities.forEach((ability) => {
          items.push({
            label: ability.name,
            children: ability.description,
          });
        });
      }
    });

    return items;
  }, [classes]);

  const languageItems = useMemo((): DescriptionItem[] => {
    const items: DescriptionItem[] = [];

    // Get all unique languages from race and character
    const allLanguages = new Set<string>();

    // Add race languages
    if (race?.languages?.length) {
      race.languages.forEach((lang) => allLanguages.add(lang));
    }

    // Add character languages
    if (character.languages?.length) {
      character.languages.forEach((lang) => allLanguages.add(lang));
    }

    // Convert to sorted array and create items
    const sortedLanguages = Array.from(allLanguages).sort();

    if (sortedLanguages.length > 0) {
      items.push({
        label: "Known Languages",
        children: sortedLanguages.join(", "),
      });
    }

    return items;
  }, [race, character.languages]);

  const availableTabs = useMemo(() => {
    const tabs = [];
    if (race) tabs.push("race");
    if (classes.length > 0) tabs.push("class");
    tabs.push("languages");
    return tabs;
  }, [race, classes.length]);

  return (
    <SectionWrapper
      title="Restrictions & Special Abilities"
      size={size}
      className={className}
    >
      {/* Tabs inside the component */}
      <Tabs defaultValue={availableTabs[0]!} variant="underline">
        <div className="px-6 pt-4 border-b border-zinc-700/50">
          <TabList aria-label="Restrictions & Special Abilities">
            {race && <Tab value="race">{race.name}</Tab>}
            {classes.length > 0 && (
              <Tab value="class">
                {classes.length === 1 ? classes[0]?.name : "Classes"}
              </Tab>
            )}
            <Tab value="languages">Languages</Tab>
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
                      <Card
                        key={index}
                        variant="standard"
                        hover
                        className="group/card"
                      >
                        <SkillDescriptionItem
                          title={String(item.label)}
                          description={item.children}
                          variant="decorated"
                        />
                      </Card>
                    ))
                  ) : (
                    <Card variant="standard">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-zinc-500 rounded-full"></div>
                        <Typography
                          variant="bodySmall"
                          color="secondary"
                          weight="semibold"
                        >
                          No Restrictions
                        </Typography>
                      </div>
                      <div className="text-zinc-300 text-sm">
                        No special abilities or restrictions for this race.
                      </div>
                    </Card>
                  )}
                </div>
              </TabPanel>
            )}

            {classes.length > 0 && (
              <TabPanel value="class">
                <div className="p-6 space-y-4">
                  {classItems.length > 0 ? (
                    classItems.map((item, index) => (
                      <Card
                        key={index}
                        variant="standard"
                        hover
                        className="group/card"
                      >
                        <SkillDescriptionItem
                          title={String(item.label)}
                          description={item.children}
                          variant="decorated"
                        />
                      </Card>
                    ))
                  ) : (
                    <Card variant="standard">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-zinc-500 rounded-full"></div>
                        <Typography
                          variant="bodySmall"
                          color="secondary"
                          weight="semibold"
                        >
                          No Restrictions
                        </Typography>
                      </div>
                      <div className="text-zinc-300 text-sm">
                        No special abilities or restrictions for{" "}
                        {classes.length === 1 ? "this class" : "these classes"}.
                      </div>
                    </Card>
                  )}
                </div>
              </TabPanel>
            )}

            <TabPanel value="languages">
              <div className="p-6 space-y-4">
                {languageItems.length > 0 ? (
                  languageItems.map((item, index) => (
                    <Card
                      key={index}
                      variant="standard"
                      hover
                      className="group/card"
                    >
                      <SkillDescriptionItem
                        title={String(item.label)}
                        description={item.children}
                        variant="decorated"
                        color="lime"
                      />
                    </Card>
                  ))
                ) : (
                  <Card variant="standard">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-zinc-500 rounded-full"></div>
                      <Typography
                        variant="bodySmall"
                        color="secondary"
                        weight="semibold"
                      >
                        No Languages
                      </Typography>
                    </div>
                    <div className="text-zinc-300 text-sm">
                      No languages have been specified for this character.
                    </div>
                  </Card>
                )}
              </div>
            </TabPanel>
          </TabPanels>
        </div>
      </Tabs>
    </SectionWrapper>
  );
}
