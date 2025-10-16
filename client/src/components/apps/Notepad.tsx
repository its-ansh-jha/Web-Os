import { useState } from 'react';
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote } from '@/hooks/useData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

export function Notepad() {
  const { data: notes = [], isLoading } = useNotes();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const [selectedNote, setSelectedNote] = useState<string | null>(notes[0]?.id || null);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');

  const currentNote = notes.find((n) => n.id === selectedNote);

  const handleCreateNote = () => {
    if (!newNoteTitle) return;
    createNote.mutate(
      {
        title: newNoteTitle,
        content: '',
        sticky: false,
      },
      {
        onSuccess: (data: any) => {
          setSelectedNote(data.id);
        },
      }
    );
    setNewNoteTitle('');
    setShowNewDialog(false);
  };

  const handleContentChange = (content: string) => {
    if (currentNote) {
      updateNote.mutate({ id: currentNote.id, data: { content } });
    }
  };

  return (
    <div className="flex h-full">
      {/* Notes List */}
      <div className="w-64 border-r border-border/50 p-3 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Notes</h3>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => setShowNewDialog(true)}
            data-testid="button-new-note"
          >
            <Icons.Plus className="h-3 w-3" />
          </Button>
        </div>

        {showNewDialog && (
          <div className="mb-3 space-y-2 p-2 border border-border rounded-md">
            <Input
              placeholder="Note title"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateNote()}
              autoFocus
              data-testid="input-note-title"
            />
            <div className="flex gap-1">
              <Button size="sm" onClick={handleCreateNote} data-testid="button-create-note">
                Create
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowNewDialog(false);
                  setNewNoteTitle('');
                }}
                data-testid="button-cancel-note"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto space-y-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Icons.Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : notes.map((note) => (
            <button
              key={note.id}
              onClick={() => setSelectedNote(note.id)}
              className={cn(
                "w-full text-left p-2 rounded-md hover-elevate active-elevate-2 transition-colors",
                selectedNote === note.id && "bg-primary/20"
              )}
              data-testid={`note-${note.id}`}
            >
              <div className="font-medium text-sm truncate">{note.title}</div>
              <div className="text-xs text-muted-foreground truncate">{note.content || 'Empty note'}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Note Editor */}
      <div className="flex-1 flex flex-col">
        {currentNote ? (
          <>
            <div className="flex items-center justify-between p-3 border-b border-border/50">
              <h2 className="text-lg font-semibold">{currentNote.title}</h2>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => {
                  deleteNote.mutate(currentNote.id);
                  setSelectedNote(notes[0]?.id || null);
                }}
                data-testid="button-delete-note"
              >
                <Icons.Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              value={currentNote.content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="flex-1 resize-none border-0 rounded-none focus-visible:ring-0"
              placeholder="Start typing..."
              data-testid="textarea-note-content"
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Icons.StickyNote className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Select a note or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
