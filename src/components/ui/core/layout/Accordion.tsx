import React, { useState, useId, useMemo, useCallback, useEffect } from "react";
import { TextInput } from "@/components/ui/core/primitives";
import { Card, Typography } from "@/components/ui/core/display";
import { useDebounce } from "@/hooks";

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
  showCounts?: boolean; // Optional prop to show/hide item counts
  showSearch?: boolean; // Optional prop to show/hide search bar
}

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  sectionId: string;
  itemCount: number;
  showCount?: boolean; // Optional prop to show/hide item count
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  children,
  isExpanded,
  onToggle,
  sectionId,
  itemCount,
  showCount = true,
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
          {showCount && (
            <span className="text-zinc-400 text-sm font-normal">
              ({itemCount})
            </span>
          )}
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
          className="bg-zinc-900 border-t border-zinc-700 p-4"
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
  showCounts = true,
  showSearch = true,
}: AccordionProps<T>) {
  const accordionId = useId();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  // Pre-compute sorted items to avoid re-sorting on every search
  const sortedItems = useMemo(() => {
    return items.sort((a, b) =>
      String(a[labelProperty]).localeCompare(String(b[labelProperty]))
    );
  }, [items, labelProperty]);

  // Filter and group items using debounced search term
  const { groupedItems, totalFilteredCount } = useMemo(() => {
    const searchLower = debouncedSearchTerm.toLowerCase();
    const filtered = searchLower
      ? sortedItems.filter((item) =>
          item.name.toLowerCase().includes(searchLower)
        )
      : sortedItems;

    const grouped = filtered.reduce((acc, item) => {
      const category = String(item[sortBy]);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, T[]>);

    // Categories are already sorted due to pre-sorted items
    const sortedGrouped: Record<string, T[]> = {};
    Object.keys(grouped)
      .sort()
      .forEach((category) => {
        const categoryItems = grouped[category];
        if (categoryItems) {
          sortedGrouped[category] = categoryItems;
        }
      });

    return {
      groupedItems: sortedGrouped,
      totalFilteredCount: filtered.length,
    };
  }, [sortedItems, sortBy, debouncedSearchTerm]);

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

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // Auto-expand sections when search is applied (using debounced search term)
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      setExpandedSections(new Set(Object.keys(groupedItems)));
    }
  }, [debouncedSearchTerm, groupedItems]);

  const handleSearchClear = useCallback(() => {
    setSearchTerm("");
    setExpandedSections(new Set()); // Collapse all sections when clearing
  }, []);

  return (
    <div className={`accordion space-y-4 ${className}`}>
      {/* Search/Filter Bar */}
      {showSearch && (
        <Card variant="standard">
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
            {debouncedSearchTerm
              ? `Showing ${totalFilteredCount} items matching "${debouncedSearchTerm}"`
              : `${items.length} total items`}
          </div>
        </Card>
      )}

      {/* Accordion Sections */}
      <div role="region" aria-label="Accordion content">
        {Object.keys(groupedItems).length === 0 ? (
          <div className="bg-zinc-800 rounded-lg p-8 text-center border border-zinc-700 shadow-[0_4px_0_0_#3f3f46]">
            <Typography variant="body" color="muted" className="text-lg">
              {debouncedSearchTerm
                ? "No items match your search."
                : "No items available."}
            </Typography>
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
              showCount={showCounts}
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
