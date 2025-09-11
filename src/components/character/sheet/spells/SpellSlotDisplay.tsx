import { Typography, Card } from "@/components/ui/design-system";

interface SpellSlotDisplayProps {
  spellSlots: Record<number, number>;
}

export default function SpellSlotDisplay({ spellSlots }: SpellSlotDisplayProps) {
  const hasSpellSlots = Object.keys(spellSlots).length > 0;

  if (!hasSpellSlots) {
    return null;
  }

  return (
    <section aria-labelledby="spell-slots-heading">
      <Typography
        variant="sectionHeading"
        id="spell-slots-heading"
        className="text-zinc-100 flex items-center gap-2 mb-3"
        as="h3"
      >
        <span
          className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"
          aria-hidden="true"
        />
        Spell Slots per Day
      </Typography>
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
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600/30 border border-purple-500/50">
                    <Typography
                      variant="caption"
                      className="text-purple-200 text-xs font-bold leading-none"
                    >
                      {level}
                    </Typography>
                  </div>
                  <div className="flex items-center justify-center min-w-[28px] h-6 rounded-md shadow-sm bg-gradient-to-br from-amber-500 to-orange-500">
                    <Typography
                      variant="caption"
                      className="text-zinc-900 text-xs font-bold leading-none"
                    >
                      {slots}
                    </Typography>
                  </div>
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