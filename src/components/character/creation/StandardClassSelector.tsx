import { Select, TextInput, OptionToggle } from "@/components/ui/inputs";
import FormField from "@/components/ui/inputs/FormField";
import { Card, Typography } from "@/components/ui/design-system";
import { InfoCardHeader, DetailSection } from "@/components/ui/display";
import { Icon } from "@/components/ui";
import type { Character, Class } from "@/types/character";
import { memo } from "react";

interface StandardClassSelectorProps {
  character: Character;
  availableClasses: Class[];
  onClassChange: (classId: string) => void;
  onCharacterChange: (character: Character) => void;
}

function StandardClassSelectorComponent({
  character,
  availableClasses,
  onClassChange,
  onCharacterChange,
}: StandardClassSelectorProps) {
  const classOptions = availableClasses.map((cls) => ({
    value: cls.id,
    label: cls.name,
  }));

  // Add custom option
  classOptions.push({
    value: "custom",
    label: "Custom Class",
  });

  const currentClassId = character.class.length > 0 ? character.class[0] : "";
  const isCustomClass = currentClassId && currentClassId.startsWith("custom-");

  const handleClassChange = (classId: string) => {
    if (classId === "custom") {
      const customId = `custom-${Date.now()}`;
      const updatedCharacter = {
        ...character,
        class: [customId],
        customClasses: {
          ...character.customClasses,
          [customId]: {
            name: "",
            usesSpells: false,
            hitDie: "1d6",
          },
        },
      };
      onCharacterChange(updatedCharacter);
    } else {
      // Clear custom classes when selecting a standard class
      const updatedCharacter = { ...character };
      if (updatedCharacter.customClasses) {
        delete updatedCharacter.customClasses;
      }
      onClassChange(classId);
    }
  };

  const handleCustomClassNameChange = (name: string) => {
    if (
      isCustomClass &&
      currentClassId &&
      character.customClasses &&
      character.customClasses[currentClassId]
    ) {
      const customClassId = currentClassId;
      const existingClass = character.customClasses[customClassId];
      onCharacterChange({
        ...character,
        customClasses: {
          ...character.customClasses,
          [customClassId]: {
            name,
            usesSpells: existingClass?.usesSpells || false,
            hitDie: existingClass?.hitDie || "1d6",
          },
        },
      });
    }
  };

  const handleCustomClassSpellToggle = (usesSpells: boolean) => {
    if (
      isCustomClass &&
      currentClassId &&
      character.customClasses &&
      character.customClasses[currentClassId]
    ) {
      const customClassId = currentClassId;
      const existingClass = character.customClasses[customClassId];
      onCharacterChange({
        ...character,
        customClasses: {
          ...character.customClasses,
          [customClassId]: {
            name: existingClass?.name || "",
            hitDie: existingClass?.hitDie || "1d6",
            usesSpells,
          },
        },
      });
    }
  };

  const handleCustomClassHitDieChange = (hitDie: string) => {
    if (
      isCustomClass &&
      currentClassId &&
      character.customClasses &&
      character.customClasses[currentClassId]
    ) {
      const customClassId = currentClassId;
      const existingClass = character.customClasses[customClassId];
      onCharacterChange({
        ...character,
        customClasses: {
          ...character.customClasses,
          [customClassId]: {
            name: existingClass?.name || "",
            usesSpells: existingClass?.usesSpells || false,
            hitDie,
          },
        },
      });
    }
  };

  const customClassData =
    isCustomClass && currentClassId && character.customClasses
      ? character.customClasses[currentClassId]
      : null;
  const selectedClass = !isCustomClass
    ? availableClasses.find((cls) => cls.id === currentClassId)
    : null;

  return (
    <section aria-labelledby="standard-classes-heading" className="mb-8">
      <Typography variant="sectionHeading" id="standard-classes-heading">
        {isCustomClass ? "Custom Class" : "Standard Classes"}
      </Typography>

      <Card variant="standard" className="mb-6">
        <div className="space-y-4">
          <Select
            label="Select Class"
            value={isCustomClass ? "custom" : currentClassId}
            onValueChange={handleClassChange}
            options={classOptions}
            placeholder="Choose a class"
            required
            aria-describedby={
              character.class.length > 0 ? "class-details" : undefined
            }
          />

          {/* Custom Class Configuration */}
          {isCustomClass && customClassData && (
            <div className="space-y-4 border-t border-zinc-600 pt-4">
              <FormField label="Custom Class Name" required>
                <TextInput
                  value={customClassData.name}
                  onChange={handleCustomClassNameChange}
                  placeholder="Enter your custom class name..."
                  required
                />
              </FormField>

              <OptionToggle
                title="Spellcasting"
                description="Does this class have spellcasting abilities?"
                switchLabel="Uses Magic"
                checked={customClassData.usesSpells || false}
                onCheckedChange={handleCustomClassSpellToggle}
              />

              {/* Hit Die Selection - this will be handled in HitPointsStep */}
              <div>
                <Typography variant="body" weight="medium" className="mb-2">
                  Hit Die
                </Typography>
                <Select
                  label="Hit Die"
                  value={customClassData.hitDie || "1d6"}
                  onValueChange={handleCustomClassHitDieChange}
                  options={[
                    { value: "1d4", label: "d4" },
                    { value: "1d6", label: "d6" },
                    { value: "1d8", label: "d8" },
                    { value: "1d10", label: "d10" },
                    { value: "1d12", label: "d12" },
                  ]}
                  placeholder="Select hit die"
                  required
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Class Details */}
      {character.class.length > 0 && (
        <Card variant="info" id="class-details">
          {isCustomClass && customClassData ? (
            <div aria-labelledby="custom-class-info-heading">
              <InfoCardHeader
                icon={<Icon name="edit" />}
                title={customClassData.name || "Custom Class"}
                iconSize="lg"
                badge={{ text: "Custom" }}
                className="mb-6"
              />

              <div className="mb-6">
                <Typography variant="description">
                  This is a custom class created by you. Define your own
                  abilities, spellcasting rules, and character progression.
                </Typography>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DetailSection
                  icon={
                    <Icon name="check-circle" size="md" aria-hidden={true} />
                  }
                  title="Hit Die"
                >
                  <Typography variant="description">
                    {customClassData.hitDie}
                  </Typography>
                </DetailSection>
                <DetailSection icon={<Icon name="star" />} title="Spellcasting">
                  <Typography variant="description">
                    {customClassData.usesSpells ? "Yes" : "No"}
                  </Typography>
                </DetailSection>
              </div>
            </div>
          ) : selectedClass ? (
            <div aria-labelledby="class-info-heading">
              <InfoCardHeader
                icon={<Icon name="briefcase" />}
                title={selectedClass.name}
                iconSize="lg"
                {...(selectedClass.supplementalContent && {
                  badge: { text: "Supplemental" },
                })}
                className="mb-6"
              />

              <div className="mb-6">
                <Typography variant="description">
                  {selectedClass.description}
                </Typography>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DetailSection
                  icon={
                    <Icon name="check-circle" size="md" aria-hidden={true} />
                  }
                  title="Hit Die"
                >
                  <Typography variant="description">
                    {selectedClass.hitDie}
                  </Typography>
                </DetailSection>
                <DetailSection
                  icon={<Icon name="lightning" />}
                  title="Primary Attribute"
                >
                  <Typography variant="description" className="capitalize">
                    {selectedClass.primaryAttribute}
                  </Typography>
                </DetailSection>
              </div>
            </div>
          ) : null}
        </Card>
      )}
    </section>
  );
}

export const StandardClassSelector = memo(StandardClassSelectorComponent);
