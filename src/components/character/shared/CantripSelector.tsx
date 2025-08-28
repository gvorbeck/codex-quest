import { useState, useMemo, useCallback, memo, forwardRef } from "react";
import { Card, Typography } from "@/components/ui/design-system";
import { Button } from "@/components/ui/inputs";
import { Icon } from "@/components/ui";
import SafeHTML from "@/components/ui/SafeHTML";
import type { Character, Cantrip } from "@/types/character";
import { 
  canLearnCantrips, 
  getAvailableCantrips, 
  getSpellTypeInfo, 
  getCantripOptions,
  type SpellTypeInfo 
} from "@/utils/cantrips";
import CantripCard from "./CantripCard";
import CantripModal from "./CantripModal";

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

interface SectionHeaderProps {
  spellTypeInfo: SpellTypeInfo;
  title: string;
  knownCantripsCount: number;
  availableToAddCount: number;
  isOwner: boolean;
  onEditClick: () => void;
}

// Extracted component for section header
const SectionHeader = memo(({ 
  spellTypeInfo, 
  title, 
  knownCantripsCount, 
  availableToAddCount,
  isOwner,
  onEditClick 
}: SectionHeaderProps) => (
  <div className="flex items-center justify-between">
    <Typography variant="sectionHeading" as="h4">
      {title}
      {knownCantripsCount > 0 && (
        <span 
          className="text-sm font-normal text-zinc-400 ml-2"
          aria-label={`${knownCantripsCount} ${spellTypeInfo.type} known`}
        >
          ({knownCantripsCount})
        </span>
      )}
    </Typography>
    
    {isOwner && availableToAddCount > 0 && (
      <Button
        size="sm"
        variant="secondary"
        onClick={onEditClick}
        aria-label={`Add or change ${spellTypeInfo.type}`}
      >
        <Icon name="plus" size="sm" aria-hidden={true} />
        {knownCantripsCount > 0 ? "Change Selection" : `Add ${spellTypeInfo.capitalizedSingular}`}
      </Button>
    )}
  </div>
));

SectionHeader.displayName = "SectionHeader";

// Main component
const CantripSelector = forwardRef<HTMLElement, CantripSelectorProps>((props, ref) => {
  const { character, onCantripChange, className = "" } = props;
  
  // All hooks must be called before any conditional returns
  const [showModal, setShowModal] = useState(false);
  const [selectedCantripName, setSelectedCantripName] = useState("");

  const spellTypeInfo = useMemo(() => getSpellTypeInfo(character), [character]);
  
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
    const cantripToAdd = availableCantrips.find((c) => c.name === selectedCantripName);
    if (cantripToAdd) {
      onCantripChange([...knownCantrips, cantripToAdd]);
      setSelectedCantripName("");
      setShowModal(false);
    }
  }, [availableCantrips, selectedCantripName, knownCantrips, onCantripChange]);

  const handleRemoveCantrip = useCallback(
    (cantripName: string) => {
      onCantripChange(knownCantrips.filter((c) => c.name !== cantripName));
    },
    [knownCantrips, onCantripChange]
  );

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedCantripName("");
  }, []);

  // Early return if character can't learn cantrips (after all hooks)
  if (!canLearnCantrips(character)) {
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
    const emptyMessage = props.mode === "creation" 
      ? `No starting ${spellTypeInfo.type} (${spellTypeInfo.abilityScore} modifier may be negative).`
      : `No ${spellTypeInfo.type} known yet.`;

    return (
      <section className={getSectionClassName()} ref={ref}>
        <Typography variant="sectionHeading" as="h4" className="mb-3">
          {title}
        </Typography>
        
        {description && (
          <div className="mb-6">
            <SafeHTML content={description} variant="caption" className="text-sm text-zinc-400" />
          </div>
        )}

        <Card variant="standard" className="p-4">
          <Typography variant="body" className="text-zinc-400 text-center">
            {emptyMessage}
          </Typography>
        </Card>
      </section>
    );
  }

  // Render with cantrips
  return (
    <section className={getSectionClassName()} ref={ref}>
      <Typography variant="sectionHeading" as="h4" className="mb-3">
        {title}
      </Typography>
      
      {description && (
        <div className="mb-6">
          <SafeHTML content={description} variant="caption" className="text-sm text-zinc-400" />
        </div>
      )}

      <div className="space-y-4">
        <SectionHeader
          spellTypeInfo={spellTypeInfo}
          title={props.mode === "creation" ? `Your Starting ${spellTypeInfo.capitalized}` : title}
          knownCantripsCount={knownCantrips.length}
          availableToAddCount={cantripOptions.length}
          isOwner={true} // Always true in this context
          onEditClick={() => setShowModal(true)}
        />

        <div className="space-y-3" role="list" aria-label={`Known ${spellTypeInfo.type}`}>
          {knownCantrips.map((cantrip) => (
            <div key={cantrip.name} role="listitem">
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
});

CantripSelector.displayName = "CantripSelector";

export default memo(CantripSelector);