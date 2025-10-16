import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useFiles, useCreateFile, useUpdateFile, useDeleteFile } from '@/hooks/useData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { apps } from '@/lib/apps';
import { useOpenLink } from '@/lib/browserUtils';

export function FileManager() {
  const { currentPath, setCurrentPath, openWindow, setContextMenu } = useStore();
  const openLink = useOpenLink();
  const { data: files = [], isLoading } = useFiles();
  const createFile = useCreateFile();
  const deleteFile = useDeleteFile();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [newItemName, setNewItemName] = useState('');
  const [showNewDialog, setShowNewDialog] = useState<'file' | 'folder' | null>(null);

  const currentFolder = files.find((f) => f.id === currentPath);
  const currentFiles = files.filter((f) => f.parentId === currentPath);
  const breadcrumbs = getBreadcrumbs(currentPath, files);

  function getBreadcrumbs(path: string, allFiles: typeof files) {
    const crumbs = [];
    let current = allFiles.find((f) => f.id === path);
    while (current) {
      crumbs.unshift(current);
      current = current.parentId ? allFiles.find((f) => f.id === current!.parentId!) : undefined;
    }
    return crumbs;
  }

  const handleCreateItem = () => {
    if (!newItemName || !showNewDialog) return;

    createFile.mutate({
      name: newItemName,
      type: showNewDialog,
      parentId: currentPath,
      content: showNewDialog === 'file' ? '' : undefined,
    });

    setNewItemName('');
    setShowNewDialog(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    for (const file of Array.from(uploadedFiles)) {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'file';
        
        // Determine file type based on extension
        let fileType = fileExtension;
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension)) {
          fileType = fileExtension;
        } else if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'css', 'html'].includes(fileExtension)) {
          fileType = fileExtension;
        } else if (['txt', 'md'].includes(fileExtension)) {
          fileType = 'text';
        }

        createFile.mutate({
          name: file.name,
          type: fileType,
          parentId: currentPath,
          content: content,
          size: Math.round(file.size / 1024), // Size in KB
        });
      };

      // Read file as data URL for images, text for others
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }

    // Reset input
    e.target.value = '';
  };

  const getFileIcon = (file: typeof files[0]) => {
    if (file.type === 'folder') return Icons.Folder;
    const ext = file.extension?.toLowerCase();
    if (['jpg', 'png', 'gif', 'webp'].includes(ext || '')) return Icons.Image;
    if (['mp3', 'wav', 'ogg'].includes(ext || '')) return Icons.Music;
    if (['mp4', 'avi', 'mkv'].includes(ext || '')) return Icons.Video;
    if (['js', 'ts', 'jsx', 'tsx', 'py'].includes(ext || '')) return Icons.Code;
    return Icons.File;
  };

  const handleOpen = (file: File) => {
    if (file.type === 'folder') {
      setCurrentPath(file.id);
    } else if (file.type === 'text') {
      const textEditorApp = apps.find(app => app.id === 'text-editor');
      if (textEditorApp) {
        openWindow(textEditorApp, { file });
      }
    } else if (file.type === 'html') {
      // Open HTML files in browser
      if (file.content) {
        // If it's a URL, open it directly
        const urlPattern = /^https?:\/\//i;
        if (urlPattern.test(file.content.trim())) {
          openLink(file.content.trim());
        } else {
          // Otherwise open in code editor
          const codeEditorApp = apps.find(app => app.id === 'code-editor');
          if (codeEditorApp) {
            openWindow(codeEditorApp, { file });
          }
        }
      }
    } else if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'css'].includes(file.type)) {
      const codeEditorApp = apps.find(app => app.id === 'code-editor');
      if (codeEditorApp) {
        openWindow(codeEditorApp, { file });
      }
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(file.type)) {
      const galleryApp = apps.find(app => app.id === 'photo-gallery');
      if (galleryApp) {
        openWindow(galleryApp, { file });
      }
    } else if (file.type === 'url' || file.name.endsWith('.url')) {
      // Handle URL files
      if (file.content) {
        openLink(file.content);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-border/50">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => {
            if (currentFolder?.parentId) {
              setCurrentPath(currentFolder.parentId);
            }
          }}
          disabled={!currentFolder?.parentId}
          data-testid="button-back"
        >
          <Icons.ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex-1 flex items-center gap-1 bg-muted/30 rounded-md px-2 py-1">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.id} className="flex items-center">
              {index > 0 && <Icons.ChevronRight className="h-3 w-3 mx-1 text-muted-foreground" />}
              <button
                onClick={() => setCurrentPath(crumb.id)}
                className="text-sm hover:text-primary transition-colors"
                data-testid={`breadcrumb-${crumb.name}`}
              >
                {crumb.name}
              </button>
            </div>
          ))}
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => setShowNewDialog('folder')}
          data-testid="button-new-folder"
        >
          <Icons.FolderPlus className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => setShowNewDialog('file')}
          data-testid="button-new-file"
        >
          <Icons.FilePlus className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => document.getElementById('file-upload-input')?.click()}
          data-testid="button-upload-file"
        >
          <Icons.Upload className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          data-testid="button-view-mode"
        >
          {viewMode === 'grid' ? <Icons.List className="h-4 w-4" /> : <Icons.Grid3x3 className="h-4 w-4" />}
        </Button>
        <input
          id="file-upload-input"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* New Item Dialog */}
      {showNewDialog && (
        <div className="p-3 border-b border-border/50 bg-muted/20 flex items-center gap-2">
          <Input
            placeholder={`New ${showNewDialog} name`}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateItem()}
            className="flex-1"
            autoFocus
            data-testid="input-new-item-name"
          />
          <Button size="sm" onClick={handleCreateItem} data-testid="button-create-item">
            Create
          </Button>
          <Button size="sm" variant="ghost" onClick={() => {
            setShowNewDialog(null);
            setNewItemName('');
          }} data-testid="button-cancel-create">
            Cancel
          </Button>
        </div>
      )}

      {/* Files */}
      <div className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Icons.Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : currentFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Icons.FolderOpen className="h-16 w-16 mb-4 opacity-50" />
            <p>This folder is empty</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-4">
            {currentFiles.map((file) => {
              const IconComponent = getFileIcon(file);
              return (
                <div
                  key={file.id}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer group"
                  onDoubleClick={() => handleOpen(file)}
                  data-testid={`file-${file.name}`}
                >
                  <IconComponent className="h-12 w-12 text-primary" />
                  <span className="text-xs text-center line-clamp-2">{file.name}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile.mutate(file.id);
                    }}
                    data-testid={`button-delete-${file.name}`}
                  >
                    <Icons.Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-1">
            {currentFiles.map((file) => {
              const IconComponent = getFileIcon(file);
              return (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover-elevate active-elevate-2 cursor-pointer group"
                  onDoubleClick={() => handleOpen(file)}
                  data-testid={`file-list-${file.name}`}
                >
                  <IconComponent className="h-5 w-5 text-primary" />
                  <span className="flex-1 text-sm">{file.name}</span>
                  <span className="text-xs text-muted-foreground">{file.size ? `${file.size} KB` : ''}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile.mutate(file.id);
                    }}
                    data-testid={`button-delete-list-${file.name}`}
                  >
                    <Icons.Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}