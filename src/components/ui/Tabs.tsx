import {
  createContext,
  useContext,
  useState,
  useCallback,
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect,
} from "react";
import type { 
  ReactNode, 
  HTMLAttributes, 
  ButtonHTMLAttributes,
  KeyboardEvent,
  MouseEvent,
} from "react";
import { DESIGN_TOKENS, SIZE_STYLES } from "@/constants/designTokens";

// ============================================================================
// Types and Interfaces
// ============================================================================

type TabsOrientation = "horizontal" | "vertical";
type TabsVariant = "default" | "pills" | "underline";
type TabsSize = "sm" | "md" | "lg";

interface TabsContextValue {
  selectedTab: string;
  onTabSelect: (tabId: string) => void;
  orientation: TabsOrientation;
  variant: TabsVariant;
  size: TabsSize;
  disabled: boolean;
  tabIds: Set<string>;
  panelIds: Set<string>;
  registerTab: (tabId: string) => void;
  unregisterTab: (tabId: string) => void;
  registerPanel: (panelId: string) => void;
  unregisterPanel: (panelId: string) => void;
}

interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  children: ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: TabsOrientation;
  variant?: TabsVariant;
  size?: TabsSize;
  disabled?: boolean;
  activationMode?: "automatic" | "manual";
  className?: string;
}

interface TabsRef {
  selectTab: (tabId: string) => void;
  getSelectedTab: () => string;
  focusTab: (tabId: string) => void;
}

interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  "aria-label"?: string;
  className?: string;
}

interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  children: ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
}

interface TabPanelsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  value: string;
  forceMount?: boolean;
  className?: string;
}

// ============================================================================
// Context
// ============================================================================

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
};

// ============================================================================
// Main Tabs Component
// ============================================================================

const Tabs = forwardRef<TabsRef, TabsProps>(
  (
    {
      children,
      defaultValue,
      value,
      onValueChange,
      orientation = "horizontal",
      variant = "default",
      size = "md",
      disabled = false,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      activationMode = "automatic", // Reserved for future use
      className = "",
      ...props
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const [selectedTab, setSelectedTab] = useState(defaultValue || "");
    const currentSelectedTab = isControlled ? value : selectedTab;

    const tabIds = useRef(new Set<string>());
    const panelIds = useRef(new Set<string>());

    const handleTabSelect = useCallback(
      (tabId: string) => {
        if (disabled) return;

        if (!isControlled) {
          setSelectedTab(tabId);
        }

        onValueChange?.(tabId);
      },
      [disabled, isControlled, onValueChange]
    );

    const registerTab = useCallback((tabId: string) => {
      tabIds.current.add(tabId);
    }, []);

    const unregisterTab = useCallback((tabId: string) => {
      tabIds.current.delete(tabId);
    }, []);

    const registerPanel = useCallback((panelId: string) => {
      panelIds.current.add(panelId);
    }, []);

    const unregisterPanel = useCallback((panelId: string) => {
      panelIds.current.delete(panelId);
    }, []);

    const focusTab = useCallback((tabId: string) => {
      const tabElement = document.querySelector(`[data-tab-id="${tabId}"]`) as HTMLElement;
      tabElement?.focus();
    }, []);

    useImperativeHandle(ref, () => ({
      selectTab: handleTabSelect,
      getSelectedTab: () => currentSelectedTab,
      focusTab,
    }));

    const contextValue: TabsContextValue = {
      selectedTab: currentSelectedTab,
      onTabSelect: handleTabSelect,
      orientation,
      variant,
      size,
      disabled,
      tabIds: tabIds.current,
      panelIds: panelIds.current,
      registerTab,
      unregisterTab,
      registerPanel,
      unregisterPanel,
    };

    const containerClasses = [
      "tabs",
      orientation === "vertical" ? "flex gap-4" : "space-y-2",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <TabsContext.Provider value={contextValue}>
        <div className={containerClasses} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = "Tabs";

// ============================================================================
// TabList Component
// ============================================================================

const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ children, "aria-label": ariaLabel, className = "", ...props }, ref) => {
    const { orientation, variant } = useTabsContext();

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      const { key } = event;
      const isHorizontal = orientation === "horizontal";
      
      const nextKeys = isHorizontal ? ["ArrowRight"] : ["ArrowDown"];
      const prevKeys = isHorizontal ? ["ArrowLeft"] : ["ArrowUp"];
      const homeKey = "Home";
      const endKey = "End";

      if ([...nextKeys, ...prevKeys, homeKey, endKey].includes(key)) {
        event.preventDefault();
        
        const tabElements = Array.from(
          event.currentTarget.querySelectorAll('[role="tab"]:not([disabled])')
        ) as HTMLElement[];

        if (tabElements.length === 0) return;

        const currentIndex = tabElements.findIndex(tab => tab === document.activeElement);
        let nextIndex = currentIndex;

        if (nextKeys.includes(key)) {
          nextIndex = currentIndex + 1 >= tabElements.length ? 0 : currentIndex + 1;
        } else if (prevKeys.includes(key)) {
          nextIndex = currentIndex - 1 < 0 ? tabElements.length - 1 : currentIndex - 1;
        } else if (key === homeKey) {
          nextIndex = 0;
        } else if (key === endKey) {
          nextIndex = tabElements.length - 1;
        }

        const nextTab = tabElements[nextIndex];
        if (nextTab) {
          nextTab.focus();
          // Automatic activation mode triggers selection on focus
          const tabId = nextTab.getAttribute("data-tab-id");
          if (tabId) {
            nextTab.click();
          }
        }
      }
    };

    const getListClasses = () => {
      const baseClasses = [
        "tabs-list",
        "focus-within:outline-none",
      ];

      const orientationClasses = orientation === "horizontal" 
        ? ["flex", "space-x-1"] 
        : ["flex", "flex-col", "space-y-1"];

      const variantClasses = {
        default: [
          DESIGN_TOKENS.colors.bg.primary,
          DESIGN_TOKENS.colors.border.primary,
          DESIGN_TOKENS.effects.rounded,
          "border",
          "p-1",
        ],
        pills: [
          "bg-transparent",
          "space-x-2",
        ],
        underline: [
          "bg-transparent",
          "border-b",
          DESIGN_TOKENS.colors.border.primary,
        ],
      };

      return [
        ...baseClasses,
        ...orientationClasses,
        ...variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ");
    };

    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation={orientation}
        aria-label={ariaLabel}
        className={getListClasses()}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabList.displayName = "TabList";

// ============================================================================
// Tab Component
// ============================================================================

const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ children, value, disabled: tabDisabled = false, className = "", ...props }, ref) => {
    const { 
      selectedTab, 
      onTabSelect, 
      variant, 
      size, 
      disabled: tabsDisabled,
      registerTab,
      unregisterTab,
    } = useTabsContext();

    const panelId = `panel-${value}`;
    const isSelected = selectedTab === value;
    const isDisabled = tabsDisabled || tabDisabled;

    useEffect(() => {
      registerTab(value);
      return () => unregisterTab(value);
    }, [value, registerTab, unregisterTab]);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) return;
      onTabSelect(value);
      props.onClick?.(event);
    };

    const getTabClasses = () => {
      const baseClasses = [
        "tabs-tab",
        "relative",
        "font-medium",
        "transition-all",
        "duration-200",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-amber-400",
        "focus:ring-offset-2",
        "focus:ring-offset-zinc-900",
        "disabled:opacity-50",
        "disabled:cursor-not-allowed",
      ];

      const sizeClasses = {
        sm: ["px-3", "py-1.5", "text-xs"],
        md: ["px-4", "py-2", "text-sm"],
        lg: ["px-5", "py-2.5", "text-base"],
      };

      const variantClasses = {
        default: isSelected
          ? [
              DESIGN_TOKENS.colors.bg.ability,
              DESIGN_TOKENS.colors.text.primary,
              DESIGN_TOKENS.effects.roundedSm,
              DESIGN_TOKENS.effects.shadowSm,
            ]
          : [
              "bg-transparent",
              DESIGN_TOKENS.colors.text.secondary,
              "hover:bg-zinc-700/50",
              "hover:text-zinc-100",
              DESIGN_TOKENS.effects.roundedSm,
            ],
        pills: isSelected
          ? [
              DESIGN_TOKENS.colors.bg.ability,
              DESIGN_TOKENS.colors.text.primary,
              DESIGN_TOKENS.effects.rounded,
              DESIGN_TOKENS.effects.shadow,
            ]
          : [
              "bg-transparent",
              DESIGN_TOKENS.colors.text.secondary,
              "hover:bg-zinc-700/50",
              "hover:text-zinc-100",
              DESIGN_TOKENS.effects.rounded,
            ],
        underline: isSelected
          ? [
              "bg-transparent",
              DESIGN_TOKENS.colors.text.primary,
              "border-b-2",
              "border-amber-400",
              "-mb-px",
            ]
          : [
              "bg-transparent",
              DESIGN_TOKENS.colors.text.secondary,
              "hover:text-zinc-100",
              "border-b-2",
              "border-transparent",
              "hover:border-zinc-600",
              "-mb-px",
            ],
      };

      return [
        ...baseClasses,
        ...sizeClasses[size],
        ...variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ");
    };

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        tabIndex={isSelected ? 0 : -1}
        aria-selected={isSelected}
        aria-controls={panelId}
        disabled={isDisabled}
        data-tab-id={value}
        className={getTabClasses()}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Tab.displayName = "Tab";

// ============================================================================
// TabPanels Component
// ============================================================================

const TabPanels = forwardRef<HTMLDivElement, TabPanelsProps>(
  ({ children, className = "", ...props }, ref) => {
    const { size } = useTabsContext();
    const currentSize = SIZE_STYLES[size];

    const panelsClasses = [
      "tabs-panels",
      currentSize.container,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={panelsClasses} {...props}>
        {children}
      </div>
    );
  }
);

TabPanels.displayName = "TabPanels";

// ============================================================================
// TabPanel Component
// ============================================================================

const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ children, value, forceMount = false, className = "", ...props }, ref) => {
    const { selectedTab, registerPanel, unregisterPanel } = useTabsContext();
    const tabId = `tab-${value}`;
    const panelId = `panel-${value}`;
    const isSelected = selectedTab === value;

    useEffect(() => {
      registerPanel(value);
      return () => unregisterPanel(value);
    }, [value, registerPanel, unregisterPanel]);

    const shouldRender = forceMount || isSelected;

    if (!shouldRender) {
      return null;
    }

    const panelClasses = [
      "tabs-panel",
      "focus:outline-none",
      !isSelected && !forceMount && "hidden",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId}
        tabIndex={0}
        hidden={!isSelected && !forceMount}
        className={panelClasses}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabPanel.displayName = "TabPanel";

// ============================================================================
// Exports
// ============================================================================

export {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
};

export type {
  TabsProps,
  TabsRef,
  TabListProps,
  TabProps,
  TabPanelsProps,
  TabPanelProps,
  TabsOrientation,
  TabsVariant,
  TabsSize,
};