import { Select, TextInput, OptionToggle } from "@/components/ui/core/primitives";
import FormField from "@/components/ui/core/primitives/FormField";
import { Card, Typography } from "@/components/ui/core/display";
import { InfoCardHeader, DetailSection } from "@/components/ui/composite";
import { Icon } from "@/components/ui";
import type { Character, Class } from "@/types";
import { getClassFromAvailable, hasCustomClasses } from "@/utils";
import { memo } from "react";

interface StandardClassSelectorProps {
  character: Character;
  availableClasses: Class[];
  onClassChange: (classId: string) => void;
  onCharacterChange: (character: Character) => void;
  customClassMagicToggle: boolean;
  onCustomClassMagicToggle: (value: boolean) => void;
}

function StandardClassSelectorComponent({
  character,
  availableClasses,
  onClassChange,
  onCharacterChange,
  customClassMagicToggle,
  onCustomClassMagicToggle,
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

  const currentClassId = character.class || "";
  const isCustomClass = hasCustomClasses(character);

  // Determine what should be selected in the dropdown
  const selectValue = isCustomClass ? "custom" : currentClassId;

  const updateCharacterClass = (className: string) => {
    onClassChange(className);
  };

  const handleClassChange = (classId: string) => {
    // If custom is selected, clear the class array (user will type name)
    // Otherwise set to the selected standard class
    updateCharacterClass(classId === "custom" ? "" : classId);
  };

  const handleCustomClassNameChange = (name: string) => {
    updateCharacterClass(name);
  };

  const handleCustomClassSpellToggle = () => {
    onCustomClassMagicToggle(!customClassMagicToggle);
  };

  const handleCustomClassHitDieChange = (hitDie: string) => {
    onCharacterChange({
      ...character,
      hp: {
        ...character.hp,
        die: hitDie,
      },
    });
  };

  const showCustomClassUI = selectValue === "custom";
  const selectedClass =
    !isCustomClass && currentClassId
      ? getClassFromAvailable(currentClassId, availableClasses)
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
            value={selectValue}
            onValueChange={handleClassChange}
            options={classOptions}
            placeholder="Choose a class"
            required
            aria-describedby={
              character.class ? "class-details" : undefined
            }
          />

          {/* Custom Class Configuration */}
          {showCustomClassUI && (
            <div className="space-y-4 border-t border-zinc-600 pt-4">
              <FormField label="Custom Class Name" required>
                <TextInput
                  value={character.class || ""}
                  onChange={handleCustomClassNameChange}
                  placeholder="Enter your custom class name..."
                  required
                />
              </FormField>

              {/* Hit Die Selection */}
              <div>
                <Typography variant="body" weight="medium" className="mb-2">
                  Hit Die
                </Typography>
                <Select
                  label="Hit Die"
                  value={character.hp.die || "1d6"}
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

              <OptionToggle
                title="Spellcasting"
                description="Does this class have spellcasting abilities?"
                switchLabel="Uses Magic"
                checked={customClassMagicToggle}
                onCheckedChange={handleCustomClassSpellToggle}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Class Details */}
      {character.class && (
        <Card variant="info" id="class-details">
          {showCustomClassUI ? (
            <div aria-labelledby="custom-class-info-heading">
              <InfoCardHeader
                icon={<Icon name="edit" />}
                title={character.class || "Custom Class"}
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
                    {character.hp.die}
                  </Typography>
                </DetailSection>
                <DetailSection icon={<Icon name="star" />} title="Spellcasting">
                  <Typography variant="description">
                    {customClassMagicToggle ? "Yes" : "No"}
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
