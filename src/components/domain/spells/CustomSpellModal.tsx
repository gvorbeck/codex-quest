import { useCallback, useState } from "react";
import { Modal } from "@/components/modals";
import {
  Button,
  Select,
  TextInput,
  TextArea,
  FormField,
} from "@/components/ui/core/primitives";
import { Typography } from "@/components/ui/core/display";
import type { Spell } from "@/types";

interface CustomSpellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpellAdd: (spell: Spell) => void;
}

const SPELL_LEVELS = [
  { value: "1", label: "1st Level" },
  { value: "2", label: "2nd Level" },
  { value: "3", label: "3rd Level" },
  { value: "4", label: "4th Level" },
  { value: "5", label: "5th Level" },
  { value: "6", label: "6th Level" },
  { value: "7", label: "7th Level" },
  { value: "8", label: "8th Level" },
  { value: "9", label: "9th Level" },
];

const SPELL_CLASSES = [
  { value: "magic-user", label: "Magic-User" },
  { value: "cleric", label: "Cleric" },
  { value: "druid", label: "Druid" },
  { value: "illusionist", label: "Illusionist" },
  { value: "necromancer", label: "Necromancer" },
  { value: "spellcrafter", label: "Spellcrafter" },
  { value: "paladin", label: "Paladin" },
];

type SpellClass = "magic-user" | "cleric" | "druid" | "illusionist" | "necromancer" | "spellcrafter" | "paladin";

interface CustomSpellFormData {
  name: string;
  range: string;
  duration: string;
  description: string;
  availableForClasses: SpellClass[];
  spellLevel: number;
}

export default function CustomSpellModal({
  isOpen,
  onClose,
  onSpellAdd,
}: CustomSpellModalProps) {
  const [formData, setFormData] = useState<CustomSpellFormData>({
    name: "",
    range: "",
    duration: "",
    description: "",
    availableForClasses: [],
    spellLevel: 1,
  });
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const handleReset = useCallback(() => {
    setFormData({
      name: "",
      range: "",
      duration: "",
      description: "",
      availableForClasses: [],
      spellLevel: 1,
    });
    setAttemptedSubmit(false);
  }, []);

  const handleClassToggle = useCallback(
    (classId: SpellClass) => {
      setFormData((prev) => {
        const currentClasses = prev.availableForClasses;
        const newClasses = currentClasses.includes(classId)
          ? currentClasses.filter((c) => c !== classId)
          : [...currentClasses, classId];
        return { ...prev, availableForClasses: newClasses };
      });
    },
    []
  );

  const handleSubmit = useCallback(() => {
    setAttemptedSubmit(true);

    if (!formData.name || !formData.range || !formData.duration || !formData.description || !formData.availableForClasses.length) return;

    // Build spell object with the level structure
    const newSpell: Spell = {
      name: formData.name,
      range: formData.range,
      duration: formData.duration,
      description: formData.description,
      level: {
        "magic-user": formData.availableForClasses.includes("magic-user") ? formData.spellLevel : null,
        cleric: formData.availableForClasses.includes("cleric") ? formData.spellLevel : null,
        druid: formData.availableForClasses.includes("druid") ? formData.spellLevel : null,
        illusionist: formData.availableForClasses.includes("illusionist") ? formData.spellLevel : null,
        necromancer: formData.availableForClasses.includes("necromancer") ? formData.spellLevel : null,
        spellcrafter: formData.availableForClasses.includes("spellcrafter") ? formData.spellLevel : null,
        paladin: formData.availableForClasses.includes("paladin") ? formData.spellLevel : null,
      },
    };

    onSpellAdd(newSpell);
    handleReset();
    onClose();
  }, [formData, onSpellAdd, handleReset, onClose]);

  const handleCancel = useCallback(() => {
    handleReset();
    onClose();
  }, [handleReset, onClose]);

  const isValid = Boolean(
    formData.name &&
    formData.range &&
    formData.duration &&
    formData.description &&
    formData.availableForClasses.length > 0
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Create Custom Spell"
      size="lg"
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <Typography variant="body" weight="medium" className="text-zinc-200">
            Basic Information
          </Typography>

          {/* Name */}
          <FormField
            label="Spell Name"
            required
            {...(attemptedSubmit && !formData.name && { error: "Spell name is required" })}
          >
            <TextInput
              value={formData.name}
              onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
              placeholder="Enter spell name..."
              error={attemptedSubmit && !formData.name}
            />
          </FormField>

          {/* Range */}
          <FormField
            label="Range"
            required
            {...(attemptedSubmit && !formData.range && { error: "Range is required" })}
          >
            <TextInput
              value={formData.range}
              onChange={(value) => setFormData((prev) => ({ ...prev, range: value }))}
              placeholder="e.g., Touch, 30', 100'+10'/level, etc."
              error={attemptedSubmit && !formData.range}
            />
          </FormField>

          {/* Duration */}
          <FormField
            label="Duration"
            required
            {...(attemptedSubmit && !formData.duration && { error: "Duration is required" })}
          >
            <TextInput
              value={formData.duration}
              onChange={(value) => setFormData((prev) => ({ ...prev, duration: value }))}
              placeholder="e.g., Instant, 1 turn, 1 round/level, etc."
              error={attemptedSubmit && !formData.duration}
            />
          </FormField>

          {/* Description */}
          <FormField
            label="Description"
            required
            {...(attemptedSubmit && !formData.description && { error: "Description is required" })}
          >
            <TextArea
              value={formData.description}
              onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
              placeholder="Describe the spell's effects and how it works..."
              rows={5}
              error={attemptedSubmit && !formData.description}
            />
          </FormField>
        </div>

        {/* Spell Properties */}
        <div className="space-y-4 border-t border-zinc-600 pt-4">
          <Typography variant="body" weight="medium" className="text-zinc-200">
            Spell Properties
          </Typography>

          {/* Spell Level */}
          <Select
            label="Spell Level"
            options={SPELL_LEVELS}
            value={formData.spellLevel.toString()}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, spellLevel: parseInt(value) }))
            }
            required
          />

          {/* Available Classes */}
          <FormField
            label="Available for Classes"
            required
            {...(attemptedSubmit && formData.availableForClasses.length === 0 && { error: "Select at least one class" })}
          >
            <div className="space-y-2">
              {SPELL_CLASSES.map((spellClass) => (
                <label
                  key={spellClass.value}
                  className="flex items-center gap-3 p-3 rounded-lg border border-zinc-700 hover:border-zinc-600 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.availableForClasses.includes(spellClass.value as SpellClass)}
                    onChange={() => handleClassToggle(spellClass.value as SpellClass)}
                    className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-zinc-200">
                    {spellClass.label}
                  </span>
                </label>
              ))}
            </div>
          </FormField>
        </div>
      </div>

      {/* Modal Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-zinc-600 mt-6">
        <Button onClick={handleCancel} variant="secondary" size="md">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="primary"
          size="md"
          disabled={!isValid}
        >
          Create Spell
        </Button>
      </div>
    </Modal>
  );
}
