import { memo, useState, useCallback, useMemo } from "react";
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
import { TurnUndeadTab } from "./TurnUndeadTab";
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

    // Prepare data requests for all players
    const playerRequests =
      game?.players?.map((player) => ({
        userId: player.user,
        characterId: player.character,
      })) || [];

    // Use TanStack Query to resolve player data
    const { getResolvedData } = useDataResolver(playerRequests);

    // Extract players to match compiler's inferred dependencies
    const gamePlayers = game?.players;

    // Check if any players have skill classes using resolved data
    const hasSkillClasses = useMemo(() => {
      if (!gamePlayers?.length) return false;

      return gamePlayers.some((player) => {
        const resolved = getResolvedData(player.user, player.character);
        if (!resolved?.class) return false;

        // Check if the character's class has skills
        return resolved.class in CLASSES_WITH_SKILLS;
      });
    }, [gamePlayers, getResolvedData]);

    // Check if any players have Turn Undead ability using resolved data
    const hasTurnUndead = useMemo(() => {
      if (!gamePlayers?.length) return false;

      return gamePlayers.some((player) => {
        const resolved = getResolvedData(player.user, player.character);
        return resolved?.hasTurnUndead === true;
      });
    }, [gamePlayers, getResolvedData]);

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
              {hasTurnUndead && <Tab value="turnUndead">Turn Undead</Tab>}
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

              {hasTurnUndead && game && (
                <TabPanel value="turnUndead">
                  <TurnUndeadTab game={game} />
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
