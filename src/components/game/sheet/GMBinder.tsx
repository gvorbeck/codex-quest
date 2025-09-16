import { memo, useState, useCallback, useEffect } from "react";
import { logger } from "@/utils";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SectionWrapper,
} from "@/components/ui/layout";
import { SpellsTab } from "./SpellsTab";
import { BestiaryTab } from "./BestiaryTab";
import { SkillsTab } from "./SkillsTab";
import { getCharacterById } from "@/services/characters";
import { CLASSES_WITH_SKILLS } from "@/constants";
import type { Game, GameCombatant } from "@/types";

interface GMBinderProps {
  className?: string;
  game?: Game;
  onAddToCombat?: ((combatant: GameCombatant) => void) | undefined;
}

export const GMBinder = memo(
  ({ className, game, onAddToCombat }: GMBinderProps) => {
    const [selectedTab, setSelectedTab] = useState("spells");
    const [hasSkillClasses, setHasSkillClasses] = useState(false);

    // Check if any players have skill classes
    useEffect(() => {
      const checkForSkillClasses = async () => {
        if (!game?.players?.length) {
          setHasSkillClasses(false);
          return;
        }

        try {
          const characterPromises = game.players.map((player) =>
            getCharacterById(player.user, player.character)
          );

          const characterResults = await Promise.all(characterPromises);
          const hasSkills = characterResults.some((result) => {
            if (!result?.class) return false;
            const classes = Array.isArray(result.class)
              ? result.class
              : [result.class].filter(Boolean);
            return classes.some(
              (className: string) => className in CLASSES_WITH_SKILLS
            );
          });

          setHasSkillClasses(hasSkills);
        } catch (error) {
          logger.error("Error checking for skill classes:", error);
          setHasSkillClasses(false);
        }
      };

      checkForSkillClasses();
    }, [game?.players]);

    const handleTabChange = useCallback((value: string) => {
      setSelectedTab(value);
    }, []);

    return (
      <SectionWrapper
        title="GM Binder"
        {...(className && { className })}
        collapsible={true}
        collapsibleKey="gm-binder"
      >
        <div className="p-4">
          <Tabs
            value={selectedTab}
            onValueChange={handleTabChange}
            variant="underline"
            size="md"
          >
            <TabList aria-label="GM resources">
              <Tab value="spells">Spells</Tab>
              <Tab value="bestiary">Bestiary</Tab>
              {hasSkillClasses && <Tab value="skills">Skills</Tab>}
            </TabList>

            <TabPanels>
              <TabPanel value="spells">
                <SpellsTab />
              </TabPanel>

              <TabPanel value="bestiary">
                <BestiaryTab onAddToCombat={onAddToCombat} />
              </TabPanel>

              {hasSkillClasses && game && (
                <TabPanel value="skills">
                  <SkillsTab game={game} />
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </div>
      </SectionWrapper>
    );
  }
);

GMBinder.displayName = "GMBinder";
