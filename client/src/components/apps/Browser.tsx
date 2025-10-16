import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as Icons from 'lucide-react';
import { useBookmarks, useCreateBookmark, useDeleteBookmark } from '@/hooks/useData';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  url: string;
  title: string;
}

export function Browser() {
  const { data: bookmarks = [], isLoading } = useBookmarks();
  const createBookmark = useCreateBookmark();
  const deleteBookmark = useDeleteBookmark();
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', url: 'https://www.replit.com', title: 'Replit' },
  ]);
  const [activeTab, setActiveTab] = useState('1');
  const [urlInput, setUrlInput] = useState('https://www.replit.com');

  const currentTab = tabs.find((t) => t.id === activeTab);

  const handleNewTab = () => {
    const newTab = { id: Date.now().toString(), url: 'about:blank', title: 'New Tab' };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
    setUrlInput('');
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

  const handleNavigate = () => {
    if (!currentTab) return;
    let url = urlInput;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    setTabs(tabs.map((t) => (t.id === activeTab ? { ...t, url } : t)));
  };

  const handleBookmark = () => {
    if (!currentTab) return;
    createBookmark.mutate({
      title: currentTab.title,
      url: currentTab.url,
    });
  };

  const isBookmarked = bookmarks.some((b) => b.url === currentTab?.url);

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 border-b border-border/50 bg-muted/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setUrlInput(tab.url);
            }}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm max-w-48 hover-elevate",
              activeTab === tab.id && "bg-primary/20"
            )}
            data-testid={`browser-tab-${tab.id}`}
          >
            <Icons.Globe className="h-3 w-3 flex-shrink-0" />
            <span className="truncate flex-1">{tab.title}</span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseTab(tab.id);
                }}
                className="hover:bg-muted/50 rounded p-0.5"
                data-testid={`button-close-tab-${tab.id}`}
              >
                <Icons.X className="h-3 w-3" />
              </button>
            )}
          </button>
        ))}
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={handleNewTab}
          data-testid="button-new-tab"
        >
          <Icons.Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Address Bar */}
      <div className="flex items-center gap-2 p-2 border-b border-border/50">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          data-testid="button-back"
        >
          <Icons.ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          data-testid="button-forward"
        >
          <Icons.ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          data-testid="button-refresh"
        >
          <Icons.RefreshCw className="h-4 w-4" />
        </Button>
        <div className="flex-1 flex items-center gap-2 bg-muted/30 rounded-md px-3 py-1.5">
          <Icons.Lock className="h-3 w-3 text-muted-foreground" />
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
            className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
            placeholder="Enter URL or search..."
            data-testid="input-url"
          />
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={handleBookmark}
          data-testid="button-bookmark"
        >
          <Icons.Star className={cn("h-4 w-4", isBookmarked && "fill-primary text-primary")} />
        </Button>
      </div>

      {/* Bookmarks Bar */}
      <div className="flex items-center gap-1 p-2 border-b border-border/50 overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground px-2 py-1">
            <Icons.Loader2 className="h-3 w-3 animate-spin" />
            <span>Loading bookmarks...</span>
          </div>
        ) : bookmarks.map((bookmark) => (
          <button
            key={bookmark.id}
            onClick={() => {
              setUrlInput(bookmark.url);
              if (currentTab) {
                setTabs(tabs.map((t) => (t.id === activeTab ? { ...t, url: bookmark.url, title: bookmark.title } : t)));
              }
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs hover-elevate active-elevate-2 whitespace-nowrap group"
            data-testid={`bookmark-${bookmark.id}`}
          >
            <Icons.Star className="h-3 w-3 fill-primary text-primary" />
            {bookmark.title}
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteBookmark.mutate(bookmark.id);
              }}
              className="opacity-0 group-hover:opacity-100 ml-1"
              data-testid={`button-delete-bookmark-${bookmark.id}`}
            >
              <Icons.X className="h-3 w-3" />
            </button>
          </button>
        ))}
      </div>

      {/* Browser Content */}
      <div className="flex-1 bg-muted/20 flex items-center justify-center">
        {currentTab?.url === 'about:blank' ? (
          <div className="text-center text-muted-foreground">
            <Icons.Globe className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Enter a URL to browse</p>
          </div>
        ) : (
          <div className="w-full h-full">
            <iframe
              src={currentTab?.url}
              className="w-full h-full border-0"
              title="Browser Content"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        )}
      </div>
    </div>
  );
}
