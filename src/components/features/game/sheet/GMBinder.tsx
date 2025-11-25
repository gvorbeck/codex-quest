import { memo, useState, useCallback, useEffect } from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SectionWrapper,
} from "@/components/ui/core/layout";
import { SpellsTab } from "./SpellsTab";
import { BestiaryTab } from "./BestiaryTab";
import { SkillsTab } from "./SkillsTab";
import { useDataResolver } from "@/hooks";
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

    // Prepare data requests for all players
    const playerRequests =
      game?.players?.map((player) => ({
        userId: player.user,
        characterId: player.character,
      })) || [];

    // Use TanStack Query to resolve player data
    const { getResolvedData } = useDataResolver(playerRequests);

    // TanStack Query handles data resolution automatically

    // Check if any players have skill classes using resolved data
    useEffect(() => {
      if (!game?.players?.length) {
        setHasSkillClasses(false);
        return;
      }

      const hasSkills = game.players.some((player) => {
        const resolved = getResolvedData(player.user, player.character);
        if (!resolved?.class) return false;

        // Check if the character's class has skills
        return resolved.class in CLASSES_WITH_SKILLS;
      });

      setHasSkillClasses(hasSkills);
    }, [game?.players, getResolvedData]);

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
