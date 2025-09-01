import { memo, useState, useCallback } from "react";
import { Tabs, TabList, Tab, TabPanels, TabPanel, SectionWrapper } from "@/components/ui/layout";
import { SpellsTab } from "./SpellsTab";
import { BestiaryTab } from "./BestiaryTab";

interface GMBinderProps {
  className?: string;
}

export const GMBinder = memo(({ className }: GMBinderProps) => {
  const [selectedTab, setSelectedTab] = useState("spells");

  const handleTabChange = useCallback((value: string) => {
    setSelectedTab(value);
  }, []);

  return (
    <SectionWrapper 
      title="GM Binder" 
      {...(className && { className })}
      collapsible={true}
      collapsibleKey="gm-binder"
    >
      <div className="p-4">
        <Tabs
          value={selectedTab}
          onValueChange={handleTabChange}
          variant="underline"
          size="md"
        >
          <TabList aria-label="GM resources">
            <Tab value="spells">Spells</Tab>
            <Tab value="bestiary">Bestiary</Tab>
          </TabList>

          <TabPanels>
            <TabPanel value="spells">
              <SpellsTab />
            </TabPanel>

            <TabPanel value="bestiary">
              <BestiaryTab />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </SectionWrapper>
  );
});

GMBinder.displayName = "GMBinder";