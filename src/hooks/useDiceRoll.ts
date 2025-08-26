import { useCallback } from "react";
import { roller } from "@/utils/dice";
import { useNotificationContext } from "@/hooks/useNotificationContext";

interface AttackRollOptions {
  type: "attack";
  bonusType: string;
  bonus: number;
}

interface SavingThrowRollOptions {
  type: "savingThrow";
  saveName: string;
  targetNumber: number;
}

interface AbilityRollOptions {
  type: "ability";
  abilityName: string;
  modifier: number;
}

type RollOptions = AttackRollOptions | SavingThrowRollOptions | AbilityRollOptions;

export function useDiceRoll() {
  const notifications = useNotificationContext();

  const rollDice = useCallback(
    (options: RollOptions) => {
      try {
        const roll = roller("1d20");

        if (options.type === "attack") {
          const { bonusType, bonus } = options;
          const total = roll.total + bonus;
          const formula = `1d20${bonus >= 0 ? "+" : ""}${bonus}`;

          notifications.showSuccess(
            `${bonusType} Attack: ${formula} = ${roll.total}${
              bonus >= 0 ? "+" : ""
            }${bonus} = ${total}`,
            {
              title: "Attack Roll",
            }
          );
        } else if (options.type === "savingThrow") {
          const { saveName, targetNumber } = options;
          const isSuccess = roll.total >= targetNumber || roll.total === 20;
          const isCriticalFailure = roll.total === 1;

          let resultMessage = `${saveName}: 1d20 = ${roll.total} vs target ${targetNumber}`;
          
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
          const formula = `1d20${modifier >= 0 ? "+" : ""}${modifier}`;

          notifications.showSuccess(
            `${abilityName} Check: ${formula} = ${roll.total}${
              modifier >= 0 ? "+" : ""
            }${modifier} = ${total}`,
            {
              title: "Ability Check",
            }
          );
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
    (saveName: string, targetNumber: number) => {
      rollDice({ type: "savingThrow", saveName, targetNumber });
    },
    [rollDice]
  );

  const rollAbility = useCallback(
    (abilityName: string, modifier: number) => {
      rollDice({ type: "ability", abilityName, modifier });
    },
    [rollDice]
  );

  return {
    rollAttack,
    rollSavingThrow,
    rollAbility,
  };
}