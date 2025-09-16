import { useCallback } from "react";
import { useNotificationContext } from "@/hooks";
import { roller } from "@/utils";

// Constants for dice rolling
const CRITICAL_SUCCESS = 20;
const CRITICAL_FAILURE = 1;

/**
 * Formats a dice formula with bonus modifier
 * @param bonus - The modifier to add to the dice roll
 * @returns Formatted dice formula string (e.g., "1d20+3" or "1d20-2")
 */
const formatDiceFormula = (bonus: number): string => {
  return `1d20${bonus >= 0 ? "+" : ""}${bonus}`;
};

interface AttackRollOptions {
  type: "attack";
  bonusType: string;
  bonus: number;
}

interface SavingThrowRollOptions {
  type: "savingThrow";
  saveName: string;
  targetNumber: number;
  modifier?: number;
}

interface AbilityRollOptions {
  type: "ability";
  abilityName: string;
  modifier: number;
}

interface PercentileRollOptions {
  type: "percentile";
  skillName: string;
  targetPercentage: number;
}

type RollOptions =
  | AttackRollOptions
  | SavingThrowRollOptions
  | AbilityRollOptions
  | PercentileRollOptions;

export function useDiceRoll() {
  const notifications = useNotificationContext();

  const rollDice = useCallback(
    (options: RollOptions) => {
      try {
        const roll = roller("1d20");

        if (options.type === "attack") {
          const { bonusType, bonus } = options;
          const total = roll.total + bonus;
          const formula = formatDiceFormula(bonus);

          notifications.showSuccess(
            `${bonusType} Attack: ${formula} = ${roll.total}${
              bonus >= 0 ? "+" : ""
            }${bonus} = ${total}`,
            {
              title: "Attack Roll",
            }
          );
        } else if (options.type === "savingThrow") {
          const { saveName, targetNumber, modifier } = options;
          const actualModifier = modifier ?? 0;
          const total = roll.total + actualModifier;
          const isSuccess =
            total >= targetNumber || roll.total === CRITICAL_SUCCESS;
          const isCriticalFailure = roll.total === CRITICAL_FAILURE;

          let resultMessage;
          if (actualModifier !== 0) {
            const formula = formatDiceFormula(actualModifier);
            resultMessage = `${saveName}: ${formula} = ${roll.total}${
              actualModifier >= 0 ? "+" : ""
            }${actualModifier} = ${total} vs target ${targetNumber}`;
          } else {
            resultMessage = `${saveName}: 1d20 = ${roll.total} vs target ${targetNumber}`;
          }

          if (isCriticalFailure) {
            resultMessage += " - Critical Failure!";
            notifications.showError(resultMessage, {
              title: "Saving Throw Failed",
            });
          } else if (isSuccess) {
            resultMessage += " - Success!";
            notifications.showSuccess(resultMessage, {
              title: "Saving Throw",
            });
          } else {
            resultMessage += " - Failed";
            notifications.showError(resultMessage, {
              title: "Saving Throw Failed",
            });
          }
        } else if (options.type === "ability") {
          const { abilityName, modifier } = options;
          const total = roll.total + modifier;
          const formula = formatDiceFormula(modifier);

          notifications.showSuccess(
            `${abilityName} Check: ${formula} = ${roll.total}${
              modifier >= 0 ? "+" : ""
            }${modifier} = ${total}`,
            {
              title: "Ability Check",
            }
          );
        } else if (options.type === "percentile") {
          const { skillName, targetPercentage } = options;
          const percentileRoll = roller("1d100");
          const result = percentileRoll.total;

          // Special cases: 01-05 always succeed, 96-100 always fail
          const isAutoSuccess = result <= 5;
          const isAutoFailure = result >= 96;
          const isSuccess =
            isAutoSuccess || (!isAutoFailure && result <= targetPercentage);

          let resultMessage = `${skillName}: 1d100 = ${result} vs ${targetPercentage}%`;

          if (isAutoSuccess && result <= targetPercentage) {
            resultMessage += " - Success!";
            notifications.showSuccess(resultMessage, {
              title: "Skill Check",
            });
          } else if (isAutoSuccess) {
            resultMessage += " - Critical Success!";
            notifications.showSuccess(resultMessage, {
              title: "Skill Check",
            });
          } else if (isAutoFailure && result > targetPercentage) {
            resultMessage += " - Failure";
            notifications.showError(resultMessage, {
              title: "Skill Check Failed",
            });
          } else if (isAutoFailure) {
            resultMessage += " - Critical Failure!";
            notifications.showError(resultMessage, {
              title: "Skill Check Failed",
            });
          } else if (isSuccess) {
            resultMessage += " - Success!";
            notifications.showSuccess(resultMessage, {
              title: "Skill Check",
            });
          } else {
            resultMessage += " - Failure";
            notifications.showError(resultMessage, {
              title: "Skill Check Failed",
            });
          }
        }
      } catch {
        notifications.showError("Failed to roll dice", {
          title: "Roll Error",
        });
      }
    },
    [notifications]
  );

  const rollAttack = useCallback(
    (bonusType: string, bonus: number) => {
      rollDice({ type: "attack", bonusType, bonus });
    },
    [rollDice]
  );

  const rollSavingThrow = useCallback(
    (saveName: string, targetNumber: number, modifier?: number) => {
      const rollOptions: SavingThrowRollOptions = {
        type: "savingThrow",
        saveName,
        targetNumber,
      };

      if (modifier !== undefined) {
        rollOptions.modifier = modifier;
      }

      rollDice(rollOptions);
    },
    [rollDice]
  );

  const rollAbility = useCallback(
    (abilityName: string, modifier: number) => {
      rollDice({ type: "ability", abilityName, modifier });
    },
    [rollDice]
  );

  const rollPercentile = useCallback(
    (skillName: string, targetPercentage: number) => {
      rollDice({ type: "percentile", skillName, targetPercentage });
    },
    [rollDice]
  );

  return {
    rollAttack,
    rollSavingThrow,
    rollAbility,
    rollPercentile,
  };
}
