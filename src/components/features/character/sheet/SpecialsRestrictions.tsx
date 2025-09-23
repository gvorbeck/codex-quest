import { useMemo, useState } from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@/components/ui/core/layout";
import {
  type DescriptionItem,
  SkillDescriptionItem,
} from "@/components/ui/composite";
import { SectionWrapper } from "@/components/ui/core/layout";
import { Card } from "@/components/ui/core/display";
import { Callout } from "@/components/ui/core/feedback";
import { Button } from "@/components/ui";
import { LanguageEditModal } from "@/components/modals";
import type { Character } from "@/types";
import { getRaceById, getClassById } from "@/utils";

interface SpecialsRestrictionsProps {
  character: Character;
  className?: string;
  size?: "sm" | "md" | "lg";
  isOwner?: boolean;
  onCharacterChange?: (character: Character) => void;
}

export default function SpecialsRestrictions({
  character,
  className = "",
  size = "md",
  isOwner = false,
  onCharacterChange,
}: SpecialsRestrictionsProps) {
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const race = useMemo(() => {
    return getRaceById(character.race?.toLowerCase() || "");
  }, [character.race]);

  const classes = useMemo(() => {
    return character.class
      .map((classId) => getClassById(classId?.toLowerCase() || ""))
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

        {/* Fixed height scrollable content area to prevent masonry reflow */}
        <div className="h-96 overflow-y-auto">
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
                    <Callout variant="neutral" title="No Restrictions">
                      No special abilities or restrictions for this race.
                    </Callout>
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
                    <Callout variant="neutral" title="No Restrictions">
                      {`No special abilities or restrictions for ${
                        classes.length === 1 ? "this class" : "these classes"
                      }.`}
                    </Callout>
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
                  <Callout variant="neutral" title="No Languages">
                    No languages have been specified for this character.
                  </Callout>
                )}

                {/* Edit Languages Button */}
                {isOwner && onCharacterChange && (
                  <div className="flex justify-center mt-6">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsLanguageModalOpen(true)}
                      className="flex items-center gap-2"
                      icon="edit"
                      iconSize="xs"
                    >
                      Edit Languages
                    </Button>
                  </div>
                )}
              </div>
            </TabPanel>
          </TabPanels>
        </div>
      </Tabs>

      {/* Language Editing Modal */}
      {onCharacterChange && (
        <LanguageEditModal
          isOpen={isLanguageModalOpen}
          onClose={() => setIsLanguageModalOpen(false)}
          character={character}
          onCharacterChange={onCharacterChange}
        />
      )}
    </SectionWrapper>
  );
}
