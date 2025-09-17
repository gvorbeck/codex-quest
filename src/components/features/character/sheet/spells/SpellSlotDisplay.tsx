import { Card, Badge } from "@/components/ui/core/display";
import { SectionHeader } from "@/components/ui/composite";

interface SpellSlotDisplayProps {
  spellSlots: Record<number, number>;
}

export default function SpellSlotDisplay({
  spellSlots,
}: SpellSlotDisplayProps) {
  const hasSpellSlots = Object.keys(spellSlots).length > 0;

  if (!hasSpellSlots) {
    return null;
  }

  return (
    <section aria-labelledby="spell-slots-heading">
      <SectionHeader
        title="Spell Slots per Day"
        dotColor="bg-purple-400"
        className="mb-3"
      />
      <Card
        variant="nested"
        className="p-4 mb-6 bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border-purple-800/30"
      >
        <div className="flex flex-wrap gap-2">
          {Object.entries(spellSlots)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([level, slots]) => (
              <div
                key={level}
                className="group relative flex items-center gap-2 rounded-lg px-3 py-2 bg-gradient-to-br from-purple-800/20 to-purple-900/40 border border-purple-700/50 shadow-sm transition-all duration-200 hover:shadow-purple-500/10 hover:border-purple-600/60"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">
                    Level {level}
                  </Badge>
                  <Badge variant="warning" size="sm">
                    {slots}
                  </Badge>
                </div>
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 rounded-lg bg-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            ))}
        </div>
      </Card>
    </section>
  );
}
