import { useModal, useNotificationContext } from "@/hooks";
import type { Character, Spell, Cantrip } from "@/types";
import { SectionWrapper, Accordion } from "@/components/ui/core/layout";
import { Card, Typography } from "@/components/ui/core/display";
import { Button } from "@/components/ui/core/primitives";
import { SectionHeader } from "@/components/ui";
import { SkeletonList } from "@/components/ui/core/feedback";
import { Modal } from "@/components/modals";
import CantripSelector from "@/components/features/character/shared/CantripSelector";
import SpellDetails from "@/components/domain/spells/SpellDetails";
import { TurnUndeadSection } from "@/components/features/character/shared";
import MUAddSpellModal from "@/components/features/character/modals/MUAddSpellModal";
import { CustomSpellModal } from "@/components/modals/LazyModals";
import PreparedSpellsSection from "./spells/PreparedSpellsSection";
import SpellSlotDisplay from "./spells/SpellSlotDisplay";
import { useSpellData } from "./spells/hooks/useSpellData";
import { useClericSpells } from "./spells/hooks/useClericSpells";
import { useSpellPreparation } from "./spells/hooks/useSpellPreparation";
import { hasTurnUndeadAbility } from "@/utils";

interface SpellsProps {
  character?: Character;
  onCharacterChange?: (character: Character) => void;
  isOwner?: boolean;
  loading?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

interface SpellWithLevel extends Spell {
  spellLevel: number;
  uniqueKey: string;
  [key: string]: unknown;
}

interface CantripWithLevel extends Cantrip {
  spellLevel: 0;
  uniqueKey: string;
  [key: string]: unknown;
}

type DisplayableSpell = SpellWithLevel | CantripWithLevel;

interface SpellSectionProps {
  title: string;
  items: DisplayableSpell[];
  dotColor?: string;
  usageDescription?: string;
  emptyStateMessage: string;
  editButtonText?: string | undefined;
  onEditClick?: (() => void) | undefined;
  canEdit: boolean;
  showSearch?: boolean;
  renderItem: (spell: DisplayableSpell) => React.ReactNode;
}

// Moved outside component to avoid re-creation during render
const SpellSection = ({
  title,
  items,
  dotColor,
  usageDescription,
  emptyStateMessage,
  editButtonText,
  onEditClick,
  canEdit,
  showSearch = false,
  renderItem,
}: SpellSectionProps) => (
  <section
    aria-labelledby={`${title.toLowerCase().replace(/\s+/g, "-")}-heading`}
  >
    <SectionHeader
      title={
        <span
          className="flex items-center gap-2"
          id={`${title.toLowerCase().replace(/\s+/g, "-")}-heading`}
        >
          {title}
          {items.length > 0 && (
            <span
              className="text-sm font-normal text-zinc-400"
              aria-label={`${items.length} ${title.toLowerCase()}`}
            >
              ({items.length})
            </span>
          )}
        </span>
      }
      {...(dotColor && { dotColor })}
      extra={
        canEdit && editButtonText && onEditClick ? (
          <Button
            size="sm"
            variant="secondary"
            onClick={onEditClick}
            icon={editButtonText.includes("Add") ? "plus" : "edit"}
          >
            {editButtonText}
          </Button>
        ) : undefined
      }
      className="mb-4"
    />

    {usageDescription && (
      <Typography
        variant="caption"
        className="text-zinc-500 text-xs block mb-4"
      >
        {usageDescription}
      </Typography>
    )}

    {items.length > 0 ? (
      <Accordion
        items={items}
        sortBy="name"
        labelProperty="name"
        showSearch={showSearch}
        renderItem={renderItem}
        showCounts={false}
        {...(editButtonText?.includes("Add") && { className: "mb-6" })}
      />
    ) : (
      <Card
        variant="standard"
        className={`p-4 ${editButtonText?.includes("Add") ? "mb-6" : ""}`}
      >
        <Typography variant="body" className="text-zinc-400 text-center">
          {emptyStateMessage}
        </Typography>
      </Card>
    )}
  </section>
);

export default function Spells({
  character,
  onCharacterChange,
  isOwner = false,
  loading = false,
  className = "",
  size = "md",
}: SpellsProps) {
  const cantripModal = useModal();
  const addSpellModal = useModal();
  const customSpellModal = useModal();
  const { showSuccess } = useNotificationContext();

  // Use extracted hooks for spell data processing
  const {
    knownSpells,
    cantrips,
    spellSlots,
    spellSystemInfo,
    canCast,
    spellSystemType,
  } = useSpellData(character);

  // Load available spells for cleric-type characters
  const { availableSpells, loadingSpells } = useClericSpells(
    character,
    spellSystemType,
    spellSlots
  );

  // Handle spell preparation for clerics
  const {
    preparedSpells,
    handleSpellPreparation,
    clearSpellPreparation,
    getPreparedSpellForSlot,
  } = useSpellPreparation({ character, onCharacterChange, availableSpells });

  // Show skeleton while loading
  if (loading || !character) {
    return (
      <SectionWrapper title="Spells" size={size} className={className}>
        <SkeletonList items={4} showAvatar={false} label="Loading spells..." />
      </SectionWrapper>
    );
  }

  // Don't render if character can't cast spells and doesn't have Turn Undead
  if (!canCast && !hasTurnUndeadAbility(character)) {
    return null;
  }

  // Computed values
  const showCantrips = character.settings?.showCantrips !== false; // Default to true if not set
  const hasSpellSlots = Object.keys(spellSlots).length > 0;
  const hasTurnUndead = hasTurnUndeadAbility(character);
  const hasAnySpells =
    knownSpells.length > 0 ||
    (showCantrips && cantrips.length > 0) ||
    preparedSpells.length > 0 ||
    hasSpellSlots ||
    hasTurnUndead;
  const isMagicUser =
    spellSystemType === "magic-user" || spellSystemType === "custom";
  const isClericType = spellSystemType === "cleric";
  const canEdit = Boolean(isOwner && onCharacterChange);

  const renderSpell = (spell: DisplayableSpell) => (
    <SpellDetails spell={spell} />
  );

  return (
    <SectionWrapper
      title={
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between w-full">
          <span>Spells & Cantrips</span>
          {canEdit && (
            <Button
              onClick={customSpellModal.open}
              variant="primary"
              size="sm"
              aria-label="Create custom spell"
            >
              Create Custom
            </Button>
          )}
        </div>
      }
      size={size}
      className={className}
    >
      <div className="p-6">
        {hasAnySpells ? (
          <div className="space-y-6">
            {/* Spell Slots */}
            <SpellSlotDisplay spellSlots={spellSlots} />

            {/* Known Spells (Magic-User types) */}
            {isMagicUser && (
              <SpellSection
                title="Known Spells"
                items={knownSpells}
                usageDescription="Daily Usage: Limited by spell slots shown above"
                emptyStateMessage={`No spells known yet.${
                  canEdit ? " Click 'Add Spell' to learn your first spell." : ""
                }`}
                editButtonText={canEdit ? "Add Spell" : undefined}
                onEditClick={canEdit ? addSpellModal.open : undefined}
                canEdit={!!canEdit}
                showSearch={false}
                renderItem={renderSpell}
              />
            )}

            {/* Prepared Spells (Cleric types) */}
            {isClericType && character && (
              <PreparedSpellsSection
                character={character}
                spellSlots={spellSlots}
                availableSpells={availableSpells}
                loadingSpells={loadingSpells}
                canEdit={canEdit}
                preparedSpells={preparedSpells}
                onSpellPreparation={handleSpellPreparation}
                onClearPreparation={clearSpellPreparation}
                getPreparedSpellForSlot={getPreparedSpellForSlot}
              />
            )}

            {/* Cantrips/Orisons */}
            {showCantrips && spellSystemInfo && (
              <SpellSection
                title={spellSystemInfo.spellType}
                items={cantrips}
                dotColor="bg-blue-400"
                usageDescription={`Daily Uses: Level + ${spellSystemInfo.abilityBonus} • No preparation required`}
                emptyStateMessage={`No ${
                  spellSystemInfo.spellTypeLower
                } known yet.${
                  canEdit
                    ? ` Click 'Edit ${spellSystemInfo.spellType}' to add some.`
                    : ""
                }`}
                editButtonText={
                  canEdit ? `Edit ${spellSystemInfo.spellType}` : undefined
                }
                onEditClick={canEdit ? cantripModal.open : undefined}
                canEdit={canEdit}
                showSearch={false}
                renderItem={renderSpell}
              />
            )}

            {/* Turn Undead */}
            {hasTurnUndead && <TurnUndeadSection />}
          </div>
        ) : (
          <div
            className="status-message text-zinc-400 space-y-2"
            role="status"
            aria-live="polite"
          >
            <Typography variant="body" className="text-lg">
              No spells known
            </Typography>
            <Typography variant="caption" className="text-sm">
              This character doesn't know any spells yet.
            </Typography>
          </div>
        )}
      </div>

      {/* Cantrip Edit Modal */}
      {canEdit && (
        <Modal
          isOpen={cantripModal.isOpen}
          onClose={cantripModal.close}
          title={`Edit ${spellSystemInfo?.spellType || "Cantrips"}`}
          size="lg"
        >
          <CantripSelector
            character={character}
            onCantripChange={(cantrips) => {
              onCharacterChange!({
                ...character,
                cantrips,
              });
            }}
            mode="edit"
            title="Known Cantrips"
          />

          <div className="flex justify-end pt-4 mt-6 border-t border-zinc-700">
            <Button variant="primary" onClick={cantripModal.close}>
              Done
            </Button>
          </div>
        </Modal>
      )}

      {/* Magic-User Add Spell Modal */}
      {canEdit && isMagicUser && (
        <MUAddSpellModal
          isOpen={addSpellModal.isOpen}
          onClose={addSpellModal.close}
          character={character}
          onSpellAdd={(newSpell) => {
            const updatedSpells = [...(character.spells || []), newSpell];
            onCharacterChange!({
              ...character,
              spells: updatedSpells,
            });
          }}
        />
      )}

      {/* Custom Spell Modal */}
      {canEdit && (
        <CustomSpellModal
          isOpen={customSpellModal.isOpen}
          onClose={customSpellModal.close}
          onSpellAdd={(newSpell) => {
            const updatedSpells = [...(character.spells || []), newSpell];
            onCharacterChange!({
              ...character,
              spells: updatedSpells,
            });
            showSuccess(`Custom spell "${newSpell.name}" has been added to your spellbook!`);
          }}
        />
      )}
    </SectionWrapper>
  );
}
