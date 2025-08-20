import { Select } from "@/components/ui";
import type { Character, Class } from "@/types/character";
import { memo } from "react";

interface StandardClassSelectorProps {
  character: Character;
  availableClasses: Class[];
  onClassChange: (classId: string) => void;
}

function StandardClassSelectorComponent({
  character,
  availableClasses,
  onClassChange,
}: StandardClassSelectorProps) {
  const classOptions = availableClasses.map((cls) => ({
    value: cls.id,
    label: cls.name,
  }));

  return (
    <section aria-labelledby="standard-classes-heading" className="mb-8">
      <h4 id="standard-classes-heading" className="text-lg font-semibold text-zinc-100 mb-6">
        Standard Classes
      </h4>

      <div className="bg-zinc-800 border-2 border-zinc-600 rounded-lg p-6 shadow-[0_3px_0_0_#3f3f46] mb-6">
        <Select
          label="Select Class"
          value={character.class.length > 0 ? character.class[0] : ""}
          onValueChange={onClassChange}
          options={classOptions}
          placeholder="Choose a class"
          required
          aria-describedby={
            character.class.length > 0 ? "class-details" : undefined
          }
        />
      </div>

      {character.class.length > 0 && (
        <div className="bg-amber-950/20 border-2 border-amber-600 rounded-lg p-6 shadow-[0_3px_0_0_#b45309]" id="class-details">
          {(() => {
            const selectedClass = availableClasses.find(
              (cls) => cls.id === character.class[0]
            );
            return selectedClass ? (
              <div aria-labelledby="class-info-heading">
                <div className="flex items-center gap-3 mb-6">
                  <svg
                    className="w-6 h-6 flex-shrink-0 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                  <h5 id="class-info-heading" className="text-xl font-semibold text-amber-100 m-0">
                    {selectedClass.name}
                  </h5>
                  {selectedClass.supplementalContent && (
                    <span className="bg-lime-600 text-zinc-900 text-xs font-medium px-2 py-1 rounded">
                      Supplemental
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <p className="text-amber-50 leading-relaxed m-0">
                    {selectedClass.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-zinc-800/50 border border-amber-700/30 rounded-lg p-4">
                    <h6 className="font-semibold mb-2 text-amber-400 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Hit Die
                    </h6>
                    <p className="text-amber-50 text-sm m-0">{selectedClass.hitDie}</p>
                  </div>
                  <div className="bg-zinc-800/50 border border-amber-700/30 rounded-lg p-4">
                    <h6 className="font-semibold mb-2 text-amber-400 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      Primary Attribute
                    </h6>
                    <p className="text-amber-50 text-sm m-0 capitalize">{selectedClass.primaryAttribute}</p>
                  </div>
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </section>
  );
}

export const StandardClassSelector = memo(StandardClassSelectorComponent);
