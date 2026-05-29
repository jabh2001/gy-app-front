import { useState, type ReactNode } from 'react';

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
};

type FlowbiteTabsProps = {
  tabs: TabItem[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
};

type TabButtonProps = {
  tab: TabItem;
  isActive: boolean;
  onClick: (tabId: string) => void;
};

type TabPanelProps = {
  tab: TabItem;
  isActive: boolean;
};

export function TabButton({ tab, isActive, onClick }: TabButtonProps) {
  const baseClass =
    'inline-block p-4 border-b rounded-t-base transition-colors';

  const activeClass = isActive
    ? 'text-primary border-primary bg-primary/20 active '
    : 'border-transparent hover:text-primary hover:border-primary';

  const disabledClass =
    'text-disabled cursor-not-allowed pointer-events-none dark:text-body';

  return (
    <button
      type="button"
      role="tab"
      id={`tab-${tab.id}`}
      aria-selected={isActive}
      aria-controls={`panel-${tab.id}`}
      disabled={tab.disabled}
      onClick={() => onClick(tab.id)}
      className={`${baseClass} ${
        tab.disabled ? disabledClass : activeClass
      }`}
    >
      {tab.label}
    </button>
  );
}

export function TabPanel({ tab, isActive }: TabPanelProps) {
  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`panel-${tab.id}`}
      aria-labelledby={`tab-${tab.id}`}
      className=""
    >
      {tab.content}
    </div>
  );
}

export default function FlowbiteTabs({
  tabs,
  defaultTabId,
  onChange,
}: FlowbiteTabsProps) {
  const firstEnabledTab = tabs.find((tab) => !tab.disabled);
  const initialTabId = defaultTabId || firstEnabledTab?.id || '';

  const [activeTabId, setActiveTabId] = useState(initialTabId);

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const handleTabClick = (tabId: string) => {
    const selectedTab = tabs.find((tab) => tab.id === tabId);

    if (!selectedTab || selectedTab.disabled) return;

    setActiveTabId(tabId);
    onChange?.(tabId);
  };

  if (!tabs.length) return null;

  return (
    <div>
      <div className="text-sm font-medium text-center text-body border-b border-default">
        <ul
          role="tablist"
          className="flex flex-wrap -mb-px"
        >
          {tabs.map((tab) => (
            <li key={tab.id} className="me-2" role="presentation">
              <TabButton
                tab={tab}
                isActive={tab.id === activeTabId}
                onClick={handleTabClick}
              />
            </li>
          ))}
        </ul>
      </div>

      {activeTab && (
        <TabPanel
          tab={activeTab}
          isActive={activeTab.id === activeTabId}
        />
      )}
    </div>
  );
}