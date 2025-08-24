import React, { useState, useId, useMemo, useCallback } from "react";
import { TextInput } from "@/components/ui/inputs";

interface AccordionItem {
  name: string;
  [key: string]: unknown;
}

interface AccordionProps<T extends AccordionItem> {
  items: T[];
  sortBy: keyof T;
  labelProperty?: keyof T;
  searchPlaceholder?: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  sectionId: string;
  itemCount: number;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  children,
  isExpanded,
  onToggle,
  sectionId,
  itemCount,
}) => {
  const contentId = `${sectionId}-content`;

  return (
    <div className="accordion-section border border-zinc-700 rounded-lg overflow-hidden bg-zinc-950 shadow-[0_4px_0_0_#3f3f46] mb-4">
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={contentId}
        onClick={onToggle}
        className={`
          w-full px-6 py-4 text-left font-semibold text-base
          bg-zinc-950 text-zinc-400 border-none
          hover:bg-zinc-900 hover:text-amber-400
          focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-950
          transition-all duration-200
          flex items-center justify-between
          active:translate-y-0.5 active:shadow-[0_2px_0_0_#3f3f46]
        `}
      >
        <span className="flex items-center gap-2">
          <span className="text-amber-400">
            {title.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </span>
          <span className="text-zinc-400 text-sm font-normal">
            ({itemCount})
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`
            text-amber-400 transition-transform duration-200 font-bold text-lg
            ${isExpanded ? "rotate-90" : "rotate-0"}
          `}
        >
          ▶
        </span>
      </button>

      {isExpanded && (
        <div
          id={contentId}
          className="max-h-80 overflow-y-auto bg-zinc-900 border-t border-zinc-700 p-4"
          role="region"
          aria-labelledby={sectionId}
        >
          {children}
        </div>
      )}
    </div>
  );
};

function Accordion<T extends AccordionItem>({
  items,
  sortBy,
  labelProperty = "name" as keyof T,
  searchPlaceholder = "Search items...",
  renderItem,
  className = "",
}: AccordionProps<T>) {
  const accordionId = useId();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  // Filter and group items
  const { groupedItems, totalFilteredCount } = useMemo(() => {
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const grouped = filtered.reduce((acc, item) => {
      const category = String(item[sortBy]);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, T[]>);

    // Sort categories alphabetically and items within each category by name
    const sortedGrouped: Record<string, T[]> = {};
    Object.keys(grouped)
      .sort()
      .forEach((category) => {
        const categoryItems = grouped[category];
        if (categoryItems) {
          sortedGrouped[category] = categoryItems.sort((a, b) =>
            String(a[labelProperty]).localeCompare(String(b[labelProperty]))
          );
        }
      });

    return {
      groupedItems: sortedGrouped,
      totalFilteredCount: filtered.length,
    };
  }, [items, sortBy, labelProperty, searchTerm]);

  const handleSectionToggle = useCallback((category: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      // If we're filtering, expand all sections with results for better UX
      if (value.trim()) {
        setExpandedSections(new Set(Object.keys(groupedItems)));
      }
    },
    [groupedItems]
  );

  const handleSearchClear = useCallback(() => {
    setSearchTerm("");
    setExpandedSections(new Set()); // Collapse all sections when clearing
  }, []);

  return (
    <div className={`accordion space-y-4 ${className}`}>
      {/* Search/Filter Bar */}
      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 shadow-[0_4px_0_0_#3f3f46]">
        <TextInput
          value={searchTerm}
          onChange={handleSearchChange}
          onClear={handleSearchClear}
          placeholder={searchPlaceholder}
          aria-label="Filter accordion items"
          aria-describedby={`${accordionId}-description`}
        />
        <div
          id={`${accordionId}-description`}
          aria-live="polite"
          className="text-sm text-zinc-400 mt-2"
        >
          {searchTerm
            ? `Showing ${totalFilteredCount} items matching "${searchTerm}"`
            : `${items.length} total items`}
        </div>
      </div>

      {/* Accordion Sections */}
      <div role="region" aria-label="Accordion content">
        {Object.keys(groupedItems).length === 0 ? (
          <div className="bg-zinc-800 rounded-lg p-8 text-center border border-zinc-700 shadow-[0_4px_0_0_#3f3f46]">
            <p className="text-zinc-400 text-lg">
              {searchTerm
                ? "No items match your search."
                : "No items available."}
            </p>
          </div>
        ) : (
          Object.entries(groupedItems).map(([category, categoryItems]) => (
            <AccordionSection
              key={category}
              title={category}
              isExpanded={expandedSections.has(category)}
              onToggle={() => handleSectionToggle(category)}
              sectionId={`${accordionId}-section-${category}`}
              itemCount={categoryItems.length}
            >
              <div role="list" className="space-y-2">
                {categoryItems.map((item, index) => (
                  <div
                    key={`${category}-${index}`}
                    role="listitem"
                    className="p-3 rounded-md border border-zinc-700 bg-zinc-800 transition-all duration-200"
                  >
                    {renderItem(item, index)}
                  </div>
                ))}
              </div>
            </AccordionSection>
          ))
        )}
      </div>
    </div>
  );
}

export default Accordion;
