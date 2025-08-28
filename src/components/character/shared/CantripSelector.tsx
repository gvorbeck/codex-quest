import { useState, useMemo, useCallback } from "react";
import { Card, Typography, Badge } from "@/components/ui/design-system";
import { Select, Button } from "@/components/ui/inputs";
import { Icon } from "@/components/ui";
import { Modal } from "@/components/ui/feedback";
import type { Character, Cantrip } from "@/types/character";
import { allClasses } from "@/data/classes";
import cantripData from "@/data/cantrips.json";

interface CantripSelectorProps {
  character: Character;
  onCantripChange: (cantrips: Cantrip[]) => void;
  mode?: "creation" | "edit";
  title?: string;
  description?: string;
  className?: string;
}

function canLearnCantrips(character: Character): boolean {
  return character.class.some((classId) => {
    const classData = allClasses.find((c) => c.id === classId);
    return classData?.spellcasting !== undefined;
  });
}

function getAvailableCantrips(character: Character): Cantrip[] {
  const characterClasses = character.class.map((classId) => {
    // Map class IDs to cantrip class names
    if (classId === "magic-user") return "magic-user";
    return classId;
  });

  return cantripData.filter((cantrip) =>
    cantrip.classes.some((cantripClass) =>
      characterClasses.includes(cantripClass)
    )
  );
}

export default function CantripSelector({
  character,
  onCantripChange,
  mode = "creation",
  title = "Cantrips",
  description = "Select cantrips your character knows.",
  className = "",
}: CantripSelectorProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCantripName, setSelectedCantripName] = useState("");

  const availableCantrips = useMemo(
    () => getAvailableCantrips(character),
    [character]
  );

  const knownCantrips = useMemo(
    () => character.cantrips || [],
    [character.cantrips]
  );

  const availableToAdd = useMemo(
    () =>
      availableCantrips.filter(
        (cantrip) => !knownCantrips.some((known) => known.name === cantrip.name)
      ),
    [availableCantrips, knownCantrips]
  );

  const cantripOptions = availableToAdd.map((cantrip) => ({
    value: cantrip.name,
    label: cantrip.name,
  }));

  const handleAddCantrip = useCallback(() => {
    const cantripToAdd = availableCantrips.find(
      (c) => c.name === selectedCantripName
    );
    if (cantripToAdd) {
      onCantripChange([...knownCantrips, cantripToAdd]);
      setSelectedCantripName("");
      setShowAddModal(false);
    }
  }, [availableCantrips, selectedCantripName, knownCantrips, onCantripChange]);

  const handleRemoveCantrip = useCallback(
    (cantripName: string) => {
      onCantripChange(knownCantrips.filter((c) => c.name !== cantripName));
    },
    [knownCantrips, onCantripChange]
  );

  // Don't render if character can't learn cantrips
  if (!canLearnCantrips(character)) {
    return null;
  }

  // Creation mode - simple single cantrip selection
  if (mode === "creation") {
    return (
      <section className={`mb-8 ${className}`}>
        <Typography variant="sectionHeading" as="h4" className="mb-3">
          {title}
        </Typography>
        <div
          className="text-sm text-zinc-400 mb-6"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        <Card variant="standard" className="mb-6">
          <Select
            label="Choose a starting cantrip (optional)"
            value={knownCantrips[0]?.name || ""}
            onValueChange={(cantripName) => {
              if (cantripName) {
                const cantrip = availableCantrips.find(
                  (c) => c.name === cantripName
                );
                if (cantrip) {
                  onCantripChange([cantrip]);
                }
              } else {
                onCantripChange([]);
              }
            }}
            options={cantripOptions}
            placeholder="Choose a cantrip"
          />
        </Card>

        {knownCantrips[0] && (
          <Card variant="info">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Icon
                  name="lightning"
                  size="lg"
                  className="text-blue-400"
                  aria-hidden={true}
                />
                <Typography variant="infoHeading">
                  {knownCantrips[0].name}
                </Typography>
                <Badge variant="status">Cantrip</Badge>
              </div>

              <Card variant="nested">
                <Typography variant="subHeadingSpaced">
                  <Icon name="info" size="sm" aria-hidden={true} />
                  Description
                </Typography>
                <Typography variant="description">
                  {knownCantrips[0].description}
                </Typography>
              </Card>
            </div>
          </Card>
        )}
      </section>
    );
  }

  // Edit mode - full cantrip management
  return (
    <section className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Typography variant="sectionHeading" as="h4">
          {title}
          {knownCantrips.length > 0 && (
            <span className="text-sm font-normal text-zinc-400 ml-2">
              ({knownCantrips.length})
            </span>
          )}
        </Typography>
        {availableToAdd.length > 0 && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowAddModal(true)}
          >
            <Icon name="plus" size="sm" />
            Add Cantrip
          </Button>
        )}
      </div>

      {knownCantrips.length === 0 ? (
        <Card variant="standard" className="p-4">
          <Typography variant="body" className="text-zinc-400 text-center">
            No cantrips known yet.
          </Typography>
        </Card>
      ) : (
        <div className="space-y-3">
          {knownCantrips.map((cantrip) => (
            <Card key={cantrip.name} variant="standard" className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Icon
                      name="lightning"
                      size="md"
                      className="text-blue-400"
                      aria-hidden={true}
                    />
                    <Typography variant="subHeading" className="text-zinc-100">
                      {cantrip.name}
                    </Typography>
                    <Badge variant="status">Cantrip</Badge>
                  </div>
                  <Typography
                    variant="caption"
                    className="text-zinc-400 text-sm"
                  >
                    {cantrip.description}
                  </Typography>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveCantrip(cantrip.name)}
                  className="text-zinc-400 hover:text-red-400"
                >
                  <Icon name="trash" size="sm" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Cantrip Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedCantripName("");
        }}
        title="Add Cantrip"
        size="md"
      >
        <div className="space-y-4">
          <Typography variant="body" className="text-zinc-300">
            Choose a cantrip to add to your character.
          </Typography>

          <Select
            label="Available Cantrips"
            value={selectedCantripName}
            onValueChange={setSelectedCantripName}
            options={cantripOptions}
            placeholder="Choose a cantrip"
          />

          {selectedCantripName && (
            <Card variant="info">
              {(() => {
                const cantrip = availableCantrips.find(
                  (c) => c.name === selectedCantripName
                );
                if (!cantrip) return null;

                return (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Icon
                        name="lightning"
                        size="lg"
                        className="text-blue-400"
                        aria-hidden={true}
                      />
                      <Typography variant="infoHeading">
                        {cantrip.name}
                      </Typography>
                      <Badge variant="status">Cantrip</Badge>
                    </div>

                    <Card variant="nested">
                      <Typography variant="subHeadingSpaced">
                        <Icon name="info" size="sm" aria-hidden={true} />
                        Description
                      </Typography>
                      <Typography variant="description">
                        {cantrip.description}
                      </Typography>
                    </Card>
                  </div>
                );
              })()}
            </Card>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setShowAddModal(false);
                setSelectedCantripName("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddCantrip}
              disabled={!selectedCantripName}
            >
              Add Cantrip
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
