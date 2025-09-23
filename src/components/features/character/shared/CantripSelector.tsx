import { useState, useMemo, useCallback, memo, forwardRef } from "react";
import { useModal } from "@/hooks";
import { Card, Typography } from "@/components/ui/core/display";
import { Button } from "@/components/ui/core/primitives";
import { TextHeader } from "@/components/ui/composite";
import { MarkdownText } from "@/components/ui/composite";
import { SectionHeader } from "@/components/ui/composite";
import type { Character, Cantrip } from "@/types";
import {
  getAvailableCantrips,
  getSpellTypeInfo,
  getCantripOptions,
  canCastSpells,
} from "@/utils";
import CantripCard from "@/components/domain/spells/CantripCard";
import { CantripModal } from "@/components/modals/LazyModals";

// Discriminated union for better type safety
type CantripSelectorProps =
  | {
      mode: "creation";
      character: Character;
      onCantripChange: (cantrips: Cantrip[]) => void;
      title?: string;
      description?: string;
      className?: string;
    }
  | {
      mode: "edit";
      character: Character;
      onCantripChange: (cantrips: Cantrip[]) => void;
      title?: string;
      className?: string;
    };

// Main component
const CantripSelector = forwardRef<HTMLElement, CantripSelectorProps>(
  (props, ref) => {
    const { character, onCantripChange, className = "" } = props;

    // All hooks must be called before any conditional returns
    const {
      isOpen: showModal,
      open: openModal,
      close: closeModal,
    } = useModal();
    const [selectedCantripName, setSelectedCantripName] = useState("");

    const spellTypeInfo = useMemo(
      () => getSpellTypeInfo(character),
      [character]
    );

    const availableCantrips = useMemo(
      () => getAvailableCantrips(character),
      [character]
    );

    const knownCantrips = useMemo(
      () => character.cantrips || [],
      [character.cantrips]
    );

    const cantripOptions = useMemo(
      () => getCantripOptions(availableCantrips, knownCantrips),
      [availableCantrips, knownCantrips]
    );

    // Event handlers
    const handleAddCantrip = useCallback(() => {
      const cantripToAdd = availableCantrips.find(
        (c) => c.name === selectedCantripName
      );
      if (cantripToAdd) {
        onCantripChange([...knownCantrips, cantripToAdd]);
        setSelectedCantripName("");
        closeModal();
      }
    }, [
      availableCantrips,
      selectedCantripName,
      knownCantrips,
      onCantripChange,
      closeModal,
    ]);

    const handleRemoveCantrip = useCallback(
      (cantripName: string) => {
        onCantripChange(knownCantrips.filter((c) => c.name !== cantripName));
      },
      [knownCantrips, onCantripChange]
    );

    const handleCloseModal = useCallback(() => {
      closeModal();
      setSelectedCantripName("");
    }, [closeModal]);

    // Early return if character can't learn cantrips (after all hooks)
    if (!canCastSpells(character)) {
      return null;
    }

    // Get props specific to mode
    const getTitle = () => {
      if (props.title) return props.title;
      if (props.mode === "creation") {
        return `Starting ${spellTypeInfo.capitalized}`;
      }
      return spellTypeInfo.capitalized;
    };

    const getDescription = () => {
      if (props.mode === "creation" && "description" in props) {
        return props.description || "";
      }
      return "";
    };

    const getSectionClassName = () => {
      const base = props.mode === "creation" ? "mb-8" : "space-y-4";
      return `${base} ${className}`;
    };

    const title = getTitle();
    const description = getDescription();

    // Render empty state
    if (knownCantrips.length === 0) {
      const emptyMessage =
        props.mode === "creation"
          ? `No starting ${spellTypeInfo.type} (${spellTypeInfo.abilityScore} modifier may be negative).`
          : `No ${spellTypeInfo.type} known yet.`;

      return (
        <section className={getSectionClassName()} ref={ref}>
          {props.mode === "creation" && (
            <>
              <TextHeader variant="h4" size="md">
                {title}
              </TextHeader>

              {description && (
                <div className="mb-6">
                  <MarkdownText
                    content={description}
                    variant="caption"
                    className="text-sm text-zinc-400"
                  />
                </div>
              )}
            </>
          )}

          <div className="space-y-4">
            <SectionHeader
              title={
                <>
                  {props.mode === "creation"
                    ? `Your Starting ${spellTypeInfo.capitalized}`
                    : title}
                  {knownCantrips.length > 0 && (
                    <span
                      className="text-sm font-normal text-zinc-400 ml-2"
                      aria-label={`${knownCantrips.length} ${spellTypeInfo.type} known`}
                    >
                      ({knownCantrips.length})
                    </span>
                  )}
                </>
              }
              extra={
                cantripOptions.length > 0 && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={openModal}
                    aria-label={`Add or change ${spellTypeInfo.type}`}
                    icon="plus"
                    iconClasses="w-4 h-4"
                  >
                    {knownCantrips.length > 0
                      ? "Change Selection"
                      : `Add ${spellTypeInfo.capitalizedSingular}`}
                  </Button>
                )
              }
            />

            <Card variant="standard" className="p-4">
              <Typography variant="body" className="text-zinc-400 text-center">
                {emptyMessage}
              </Typography>
            </Card>

            <CantripModal
              isOpen={showModal}
              onClose={handleCloseModal}
              onAdd={handleAddCantrip}
              availableCantrips={availableCantrips}
              selectedCantripName={selectedCantripName}
              onSelectionChange={setSelectedCantripName}
              spellTypeInfo={spellTypeInfo}
              mode={props.mode}
              cantripOptions={cantripOptions}
            />
          </div>
        </section>
      );
    }

    // Render with cantrips
    return (
      <section className={getSectionClassName()} ref={ref}>
        {props.mode === "creation" && (
          <>
            <TextHeader variant="h4" size="md">
              {title}
            </TextHeader>

            {description && (
              <div className="mb-6">
                <MarkdownText
                  content={description}
                  variant="caption"
                  className="text-sm text-zinc-400"
                />
              </div>
            )}
          </>
        )}

        <div className="space-y-4">
          <SectionHeader
            title={
              <>
                {props.mode === "creation"
                  ? `Your Starting ${spellTypeInfo.capitalized}`
                  : title}
                {knownCantrips.length > 0 && (
                  <span
                    className="text-sm font-normal text-zinc-400 ml-2"
                    aria-label={`${knownCantrips.length} ${spellTypeInfo.type} known`}
                  >
                    ({knownCantrips.length})
                  </span>
                )}
              </>
            }
            extra={
              cantripOptions.length > 0 && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={openModal}
                  aria-label={`Add or change ${spellTypeInfo.type}`}
                  icon="plus"
                  iconClasses="w-4 h-4"
                >
                  {knownCantrips.length > 0
                    ? "Change Selection"
                    : `Add ${spellTypeInfo.capitalizedSingular}`}
                </Button>
              )
            }
          />

          <div
            className="space-y-3"
            role="list"
            aria-label={`Known ${spellTypeInfo.type}`}
          >
            {knownCantrips.map((cantrip, cantripIndex) => (
              <div key={`known-${cantrip.name}-${cantripIndex}`} role="listitem">
                <CantripCard
                  cantrip={cantrip}
                  spellTypeInfo={spellTypeInfo}
                  onRemove={handleRemoveCantrip}
                  showRemove={true}
                />
              </div>
            ))}
          </div>

          <CantripModal
            isOpen={showModal}
            onClose={handleCloseModal}
            onAdd={handleAddCantrip}
            availableCantrips={availableCantrips}
            selectedCantripName={selectedCantripName}
            onSelectionChange={setSelectedCantripName}
            spellTypeInfo={spellTypeInfo}
            mode={props.mode}
            cantripOptions={cantripOptions}
          />
        </div>
      </section>
    );
  }
);

CantripSelector.displayName = "CantripSelector";

export default memo(CantripSelector);
