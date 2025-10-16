import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import * as Icons from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Tab {
  id: string;
  title: string;
  content: string;
}

export function TextEditor() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'Untitled 1', content: '' },
  ]);
  const [activeTab, setActiveTab] = useState('1');
  const [findText, setFindText] = useState('');
  const [showFind, setShowFind] = useState(false);

  const currentTab = tabs.find((t) => t.id === activeTab);

  const handleNewTab = () => {
    const newTab = {
      id: Date.now().toString(),
      title: `Untitled ${tabs.length + 1}`,
      content: '',
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const handleCloseTab = (id: string) => {
    if (tabs.length === 1) return;
    const index = tabs.findIndex((t) => t.id === id);
    const newTabs = tabs.filter((t) => t.id !== id);
    setTabs(newTabs);
    if (activeTab === id) {
      setActiveTab(newTabs[Math.max(0, index - 1)].id);
    }
  };

  const handleContentChange = (content: string) => {
    setTabs(tabs.map((t) => (t.id === activeTab ? { ...t, content } : t)));
  };

  const handleDownload = () => {
    if (!currentTab) return;
    const blob = new Blob([currentTab.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTab.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-border/50">
        <Button size="sm" variant="ghost" onClick={handleNewTab} data-testid="button-new-tab">
          <Icons.FilePlus className="h-4 w-4 mr-2" />
          New
        </Button>
        <Button size="sm" variant="ghost" onClick={handleDownload} data-testid="button-save">
          <Icons.Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setShowFind(!showFind)} data-testid="button-find">
          <Icons.Search className="h-4 w-4 mr-2" />
          Find
        </Button>
        <div className="flex-1" />
        <span className="text-xs text-muted-foreground">
          {currentTab?.content.length || 0} characters
        </span>
      </div>

      {/* Find Bar */}
      {showFind && (
        <div className="flex items-center gap-2 p-2 border-b border-border/50 bg-muted/20">
          <Input
            placeholder="Find..."
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            className="flex-1"
            data-testid="input-find"
          />
          <Button size="sm" variant="ghost" onClick={() => setShowFind(false)}>
            <Icons.X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b border-border/50 bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              data-testid={`tab-${tab.id}`}
            >
              {tab.title}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseTab(tab.id);
                  }}
                  className="ml-2 hover:bg-muted/50 rounded p-0.5"
                  data-testid={`button-close-tab-${tab.id}`}
                >
                  <Icons.X className="h-3 w-3" />
                </button>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="flex-1 m-0 p-0">
            <Textarea
              value={tab.content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="h-full resize-none border-0 rounded-none font-mono text-sm focus-visible:ring-0"
              placeholder="Start typing..."
              data-testid="textarea-content"
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
