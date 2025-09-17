import { useCallback, useMemo, memo } from "react";
import { TextInput } from "@/components/ui/core/primitives";
import { StepWrapper } from "@/components/ui/core/layout";
import { HorizontalRule } from "@/components/ui/composite";
import { Icon } from "@/components/ui/core/display";
import { Card, Typography, Badge } from "@/components/ui/core/display";
import { StatGrid } from "@/components/ui/composite";
import { LanguageSelector } from "@/components/features/character/creation";
import { AvatarSelector } from "@/components/features/character/management";
import { useValidation } from "@/validation";
import {
  sanitizeCharacterName,
  getClassById,
  isCustomClass,
  isCustomRace,
  getRaceById,
  characterNameSchema,
} from "@/utils";
import type { BaseStepProps } from "@/types";

type ReviewStepProps = BaseStepProps;

function ReviewStepComponent({
  character,
  onCharacterChange,
}: ReviewStepProps) {
  // Validate character name
  const nameValidation = useValidation(character.name, characterNameSchema);

  // Look up display names for race and classes
  const raceDisplayName = useMemo(() => {
    if (!character.race) return "None selected";

    // Handle custom races using new helper
    if (isCustomRace(character.race)) {
      return character.race;
    }

    const race = getRaceById(character.race);
    return race?.name || character.race;
  }, [character.race]);

  const classDisplayNames = useMemo(() => {
    if (character.class.length === 0) return "None selected";
    return character.class
      .map((classId) => {
        // Handle custom classes
        if (isCustomClass(classId)) {
          return classId || "Custom Class";
        }

        const classData = getClassById(classId);
        return classData?.name || classId;
      })
      .join("/");
  }, [character.class]);

  const handleNameChange = useCallback(
    (name: string) => {
      // Sanitize the input to prevent potential XSS and ensure valid characters
      const sanitizedName = sanitizeCharacterName(name);
      onCharacterChange({
        ...character,
        name: sanitizedName,
      });
    },
    [character, onCharacterChange]
  );

  const getStatusMessage = () => {
    if (!character.name || character.name.trim() === "") {
      return "Character name required";
    }
    if (!nameValidation.isValid) {
      return "Please fix character name errors";
    }
    return `${character.name} - ${raceDisplayName} ${classDisplayNames}`;
  };

  return (
    <StepWrapper
      title="Review & Finalize"
      description="Name your character and review all details before completing character creation."
      statusMessage={getStatusMessage()}
    >
      {/* Character Name Section */}
      <section className="mb-8">
        <Typography variant="sectionHeading">Character Name</Typography>

        <Card variant="standard">
          <TextInput
            value={character.name}
            onChange={handleNameChange}
            placeholder="Enter your character's name"
            maxLength={50}
            required
            aria-label="Character name"
            {...(nameValidation.errors.length > 0 && {
              "aria-describedby": "name-error",
            })}
            aria-invalid={!nameValidation.isValid}
          />
          {nameValidation.errors.length > 0 && (
            <div
              id="name-error"
              role="alert"
              aria-live="assertive"
              className="text-red-400 text-sm mt-2"
            >
              {nameValidation.errors[0]}
            </div>
          )}
        </Card>
      </section>

      {/* Character Summary */}
      <section className="mb-8">
        <Typography variant="sectionHeading">Character Summary</Typography>

        <Card variant="success" className="p-0">
          {/* Header with Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            {/* Avatar */}
            {character.avatar && (
              <div className="flex-shrink-0 self-center sm:self-start">
                <img
                  src={character.avatar}
                  alt={`${character.name || "Character"} avatar`}
                  className="w-24 h-24 rounded-full border-3 border-lime-400 object-cover shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Character Overview */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="user" size="lg" className="text-lime-400" />
                <Typography variant="infoHeading" color="zinc">
                  {character.name || "Unnamed Character"}
                </Typography>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card variant="success" size="compact">
                  <Typography variant="subHeadingLime" color="lime">
                    <Icon name="eye" size="sm" />
                    Race
                  </Typography>
                  <Typography variant="body" weight="medium" color="lime">
                    {raceDisplayName}
                  </Typography>
                </Card>

                <Card variant="success" size="compact">
                  <Typography variant="subHeadingLime" color="lime">
                    <Icon name="briefcase" size="sm" />
                    Class
                  </Typography>
                  <Typography variant="body" weight="medium" color="lime">
                    {classDisplayNames}
                  </Typography>
                </Card>

                <Card variant="success" size="compact">
                  <Typography variant="subHeadingLime" color="lime">
                    <Icon name="heart" size="sm" />
                    Hit Points
                  </Typography>
                  <Typography
                    variant="body"
                    weight="bold"
                    color="lime"
                    className="text-lg"
                  >
                    {character.hp?.current || 0} / {character.hp?.max || 0} HP
                  </Typography>
                </Card>

                {character.currency.gold > 0 && (
                  <Card variant="success" size="compact">
                    <Typography variant="subHeadingLime" color="lime">
                      <Icon name="coin" size="sm" />
                      Gold
                    </Typography>
                    <Typography variant="body" weight="medium" color="lime">
                      {character.currency.gold} gp
                    </Typography>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Ability Scores */}
          <div className="mb-6">
            <Typography variant="subHeading" color="lime">
              <Icon name="lightning" size="sm" />
              Ability Scores
            </Typography>
            <StatGrid
              stats={Object.entries(character.abilities).map(
                ([ability, score]) => ({
                  label: ability,
                  value: score.value,
                  modifier: score.modifier,
                })
              )}
              variant="ability"
              columns={{ base: 2, sm: 3, md: 6 }}
            />
          </div>

          {/* Equipment Summary */}
          {character.equipment.length > 0 && (
            <div className="mb-6">
              <Typography variant="subHeading" color="lime">
                <Icon name="clipboard" size="sm" />
                Equipment (
                {character.equipment.reduce(
                  (total, item) => total + item.amount,
                  0
                )}{" "}
                items)
              </Typography>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Card variant="success" size="compact">
                  <div className="text-sm text-lime-300 mb-1">Total Weight</div>
                  <div className="text-lime-50 font-medium">
                    {character.equipment
                      .reduce(
                        (total, item) => total + item.weight * item.amount,
                        0
                      )
                      .toFixed(1)}{" "}
                    lbs
                  </div>
                </Card>
                <Card variant="success" size="compact">
                  <div className="text-sm text-lime-300 mb-1">
                    Equipment Value
                  </div>
                  <div className="text-lime-50 font-medium">
                    {character.equipment
                      .reduce((total, item) => {
                        let itemValueInGold = item.costValue * item.amount;
                        if (item.costCurrency === "sp") itemValueInGold /= 10;
                        else if (item.costCurrency === "cp")
                          itemValueInGold /= 100;
                        return total + itemValueInGold;
                      }, 0)
                      .toFixed(2)}{" "}
                    gp
                  </div>
                </Card>
              </div>

              <div className="max-h-32 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {character.equipment.map((item, index) => (
                    <div
                      key={index}
                      className="text-sm text-lime-200 flex justify-between"
                    >
                      <span>{item.name}</span>
                      {item.amount > 1 && (
                        <span className="text-lime-300">× {item.amount}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Spells */}
          {character.spells && character.spells.length > 0 && (
            <div>
              <Typography variant="subHeading" color="lime">
                <Icon name="star" size="sm" />
                Spells
              </Typography>

              <Card variant="success" size="compact">
                <div className="space-y-2">
                  {character.class.includes("magic-user") && (
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-600 text-zinc-900 text-xs font-medium px-2 py-1 rounded">
                        Auto
                      </span>
                      <span className="text-lime-200 font-medium">
                        Read Magic
                      </span>
                      <span className="text-lime-300 text-sm">
                        (automatically known)
                      </span>
                    </div>
                  )}
                  {character.spells.map((spell, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="status">L1</Badge>
                      <span className="text-lime-200 font-medium">
                        {spell.name}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </Card>
      </section>

      <HorizontalRule />

      {/* Languages */}
      <section className="mb-8">
        <LanguageSelector
          character={character}
          onCharacterChange={onCharacterChange}
        />
      </section>

      <HorizontalRule />

      {/* Avatar */}
      <section className="mb-8">
        <AvatarSelector
          character={character}
          onCharacterChange={onCharacterChange}
        />
      </section>
    </StepWrapper>
  );
}

export const ReviewStep = memo(ReviewStepComponent);
