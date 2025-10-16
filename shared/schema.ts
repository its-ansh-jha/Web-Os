import { z } from "zod";

// File System
export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  content?: string;
  size?: number;
  createdAt: Date;
  modifiedAt: Date;
  extension?: string;
}

export const insertFileNodeSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['file', 'folder']),
  parentId: z.string().nullable(),
  content: z.string().optional(),
  extension: z.string().optional(),
});

export type InsertFileNode = z.infer<typeof insertFileNodeSchema>;

// Settings
export interface Settings {
  id: string;
  wallpaper: string;
  theme: 'light' | 'dark';
  accentColor: string;
  fontSize: number;
}

export const insertSettingsSchema = z.object({
  wallpaper: z.string(),
  theme: z.enum(['light', 'dark']),
  accentColor: z.string(),
  fontSize: z.number().min(12).max(20),
});

export type InsertSettings = z.infer<typeof insertSettingsSchema>;

// Calendar Events
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  category: string;
  color: string;
}

export const insertCalendarEventSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  date: z.string(),
  time: z.string(),
  category: z.string(),
  color: z.string(),
});

export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;

// High Scores (for games)
export interface HighScore {
  id: string;
  game: string;
  score: number;
  playerName: string;
  date: Date;
}

export const insertHighScoreSchema = z.object({
  game: z.string(),
  score: z.number(),
  playerName: z.string(),
});

export type InsertHighScore = z.infer<typeof insertHighScoreSchema>;

// Notes
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
  sticky: boolean;
  position?: { x: number; y: number };
}

export const insertNoteSchema = z.object({
  title: z.string(),
  content: z.string(),
  sticky: z.boolean().optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
});

export type InsertNote = z.infer<typeof insertNoteSchema>;

// Chess Game State
export interface ChessGame {
  id: string;
  fen: string;
  moves: string[];
  createdAt: Date;
  modifiedAt: Date;
}

export const insertChessGameSchema = z.object({
  fen: z.string(),
  moves: z.array(z.string()),
});

export type InsertChessGame = z.infer<typeof insertChessGameSchema>;

// Browser Bookmarks
export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  createdAt: Date;
}

export const insertBookmarkSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  favicon: z.string().optional(),
});

export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;

// Paint Canvas State
export interface PaintCanvas {
  id: string;
  name: string;
  dataUrl: string;
  createdAt: Date;
  modifiedAt: Date;
}

export const insertPaintCanvasSchema = z.object({
  name: z.string().min(1),
  dataUrl: z.string(),
});

export type InsertPaintCanvas = z.infer<typeof insertPaintCanvasSchema>;
