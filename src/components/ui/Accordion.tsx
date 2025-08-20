import React, { useState, useId, useMemo } from "react";
import TextInput from "./TextInput";

interface AccordionItem {
  name: string;
  [key: string]: any;
}

interface AccordionProps<T extends AccordionItem> {
  items: T[];
  sortBy: keyof T;
  labelProperty?: keyof T;
  searchPlaceholder?: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  onItemSelect?: (item: T) => void;
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
    <div className="accordion-section">
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={contentId}
        onClick={onToggle}
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          backgroundColor: "#f8f9fa",
          border: "1px solid #dee2e6",
          borderBottom: isExpanded ? "none" : "1px solid #dee2e6",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "1rem",
          fontWeight: "500",
          textAlign: "left",
          transition: "background-color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#e9ecef";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#f8f9fa";
        }}
      >
        <span>
          {title.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} (
          {itemCount})
        </span>
        <span
          style={{
            transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            fontSize: "0.75rem",
          }}
          aria-hidden="true"
        >
          ▶
        </span>
      </button>

      {isExpanded && (
        <div
          id={contentId}
          style={{
            border: "1px solid #dee2e6",
            borderTop: "none",
            backgroundColor: "#ffffff",
            maxHeight: "300px",
            overflowY: "auto",
          }}
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
  onItemSelect,
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

  const handleSectionToggle = (category: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // If we're filtering, expand all sections with results for better UX
    if (value.trim()) {
      setExpandedSections(new Set(Object.keys(groupedItems)));
    }
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    setExpandedSections(new Set()); // Collapse all sections when clearing
  };

  const handleItemClick = (item: T) => {
    onItemSelect?.(item);
  };

  const handleKeyDown = (event: React.KeyboardEvent, item: T) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleItemClick(item);
    }
  };

  return (
    <div className={`accordion ${className}`} style={{ width: "100%" }}>
      {/* Search/Filter Bar */}
      <div style={{ marginBottom: "1rem" }}>
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
          style={{
            fontSize: "0.875rem",
            color: "#6c757d",
            marginTop: "0.25rem",
          }}
          aria-live="polite"
        >
          {searchTerm
            ? `Showing ${totalFilteredCount} items matching "${searchTerm}"`
            : `${items.length} total items`}
        </div>
      </div>

      {/* Accordion Sections */}
      <div role="region" aria-label="Accordion content">
        {Object.keys(groupedItems).length === 0 ? (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              color: "#6c757d",
              border: "1px solid #dee2e6",
              borderRadius: "0.25rem",
              backgroundColor: "#f8f9fa",
            }}
          >
            {searchTerm ? "No items match your search." : "No items available."}
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
              <div role="list">
                {categoryItems.map((item, index) => (
                  <div
                    key={`${category}-${index}`}
                    role="listitem"
                    tabIndex={onItemSelect ? 0 : undefined}
                    onClick={() => onItemSelect && handleItemClick(item)}
                    onKeyDown={(e) => onItemSelect && handleKeyDown(e, item)}
                    style={{
                      padding: "0.5rem 1rem",
                      borderBottom:
                        index < categoryItems.length - 1
                          ? "1px solid #f1f3f4"
                          : "none",
                      cursor: onItemSelect ? "pointer" : "default",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (onItemSelect) {
                        e.currentTarget.style.backgroundColor = "#f8f9fa";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    onFocus={(e) => {
                      if (onItemSelect) {
                        e.currentTarget.style.backgroundColor = "#f8f9fa";
                        e.currentTarget.style.outline = "2px solid #007bff";
                        e.currentTarget.style.outlineOffset = "-2px";
                      }
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.outline = "none";
                    }}
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
