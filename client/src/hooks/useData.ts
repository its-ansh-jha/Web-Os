import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { 
  FileNode, 
  Settings, 
  CalendarEvent, 
  Note, 
  HighScore, 
  Bookmark 
} from '@shared/schema';

// Files
export function useFiles() {
  return useQuery<FileNode[]>({
    queryKey: ['/api/files'],
  });
}

export function useCreateFile() {
  return useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/files', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/files'] }),
  });
}

export function useUpdateFile() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest('PATCH', `/api/files/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/files'] }),
  });
}

export function useDeleteFile() {
  return useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/files/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/files'] }),
  });
}

// Settings
export function useSettings() {
  return useQuery<Settings>({
    queryKey: ['/api/settings'],
  });
}

export function useUpdateSettings() {
  return useMutation({
    mutationFn: (data: Partial<Settings>) => 
      apiRequest('PATCH', '/api/settings', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/settings'] }),
  });
}

// Calendar Events
export function useCalendarEvents() {
  return useQuery<CalendarEvent[]>({
    queryKey: ['/api/calendar-events'],
  });
}

export function useCreateCalendarEvent() {
  return useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/calendar-events', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/calendar-events'] }),
  });
}

export function useDeleteCalendarEvent() {
  return useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/calendar-events/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/calendar-events'] }),
  });
}

// Notes
export function useNotes() {
  return useQuery<Note[]>({
    queryKey: ['/api/notes'],
  });
}

export function useCreateNote() {
  return useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/notes', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/notes'] }),
  });
}

export function useUpdateNote() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest('PATCH', `/api/notes/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/notes'] }),
  });
}

export function useDeleteNote() {
  return useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/notes/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/notes'] }),
  });
}

// High Scores
export function useHighScores(game?: string) {
  return useQuery<HighScore[]>({
    queryKey: ['/api/high-scores', game],
    queryFn: async () => {
      const url = game ? `/api/high-scores?game=${game}` : '/api/high-scores';
      const response = await fetch(url);
      return response.json();
    },
  });
}

export function useCreateHighScore() {
  return useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/high-scores', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/high-scores'] }),
  });
}

// Bookmarks
export function useBookmarks() {
  return useQuery<Bookmark[]>({
    queryKey: ['/api/bookmarks'],
  });
}

export function useCreateBookmark() {
  return useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/bookmarks', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] }),
  });
}

export function useDeleteBookmark() {
  return useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/bookmarks/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] }),
  });
}
