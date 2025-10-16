import type { 
  FileNode, 
  Settings, 
  CalendarEvent, 
  Note, 
  HighScore, 
  Bookmark, 
  PaintCanvas, 
  ChessGame,
  InsertFileNode,
  InsertSettings,
  InsertCalendarEvent,
  InsertNote,
  InsertHighScore,
  InsertBookmark,
  InsertPaintCanvas,
  InsertChessGame
} from '@shared/schema';
import { randomUUID } from 'crypto';

export interface IStorage {
  // File System
  getFiles(): Promise<FileNode[]>;
  getFile(id: string): Promise<FileNode | undefined>;
  createFile(file: InsertFileNode): Promise<FileNode>;
  updateFile(id: string, updates: Partial<FileNode>): Promise<FileNode | undefined>;
  deleteFile(id: string): Promise<boolean>;

  // Settings
  getSettings(): Promise<Settings>;
  updateSettings(settings: Partial<InsertSettings>): Promise<Settings>;

  // Calendar Events
  getCalendarEvents(): Promise<CalendarEvent[]>;
  createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent>;
  deleteCalendarEvent(id: string): Promise<boolean>;

  // Notes
  getNotes(): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, updates: Partial<Note>): Promise<Note | undefined>;
  deleteNote(id: string): Promise<boolean>;

  // High Scores
  getHighScores(game?: string): Promise<HighScore[]>;
  createHighScore(score: InsertHighScore): Promise<HighScore>;

  // Bookmarks
  getBookmarks(): Promise<Bookmark[]>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(id: string): Promise<boolean>;

  // Paint Canvases
  getPaintCanvases(): Promise<PaintCanvas[]>;
  createPaintCanvas(canvas: InsertPaintCanvas): Promise<PaintCanvas>;

  // Chess Games
  getChessGames(): Promise<ChessGame[]>;
  saveChessGame(game: InsertChessGame): Promise<ChessGame>;
}

export class MemStorage implements IStorage {
  private files: Map<string, FileNode> = new Map();
  private settings: Settings;
  private calendarEvents: Map<string, CalendarEvent> = new Map();
  private notes: Map<string, Note> = new Map();
  private highScores: Map<string, HighScore> = new Map();
  private bookmarks: Map<string, Bookmark> = new Map();
  private paintCanvases: Map<string, PaintCanvas> = new Map();
  private chessGames: Map<string, ChessGame> = new Map();

  constructor() {
    // Initialize with default settings
    this.settings = {
      id: randomUUID(),
      wallpaper: 'gradient-1',
      theme: 'dark',
      accentColor: '#3b82f6',
      fontSize: 14,
    };

    // Initialize with default file system
    const defaultFiles: FileNode[] = [
      {
        id: 'root',
        name: 'Desktop',
        type: 'folder',
        parentId: null,
        createdAt: new Date(),
        modifiedAt: new Date(),
      },
      {
        id: 'documents',
        name: 'Documents',
        type: 'folder',
        parentId: 'root',
        createdAt: new Date(),
        modifiedAt: new Date(),
      },
      {
        id: 'pictures',
        name: 'Pictures',
        type: 'folder',
        parentId: 'root',
        createdAt: new Date(),
        modifiedAt: new Date(),
      },
      {
        id: 'downloads',
        name: 'Downloads',
        type: 'folder',
        parentId: 'root',
        createdAt: new Date(),
        modifiedAt: new Date(),
      },
    ];

    defaultFiles.forEach((file) => this.files.set(file.id, file));
  }

  // File System
  async getFiles(): Promise<FileNode[]> {
    return Array.from(this.files.values());
  }

  async getFile(id: string): Promise<FileNode | undefined> {
    return this.files.get(id);
  }

  async createFile(insertFile: InsertFileNode): Promise<FileNode> {
    const id = randomUUID();
    const file: FileNode = {
      ...insertFile,
      id,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    this.files.set(id, file);
    return file;
  }

  async updateFile(id: string, updates: Partial<FileNode>): Promise<FileNode | undefined> {
    const file = this.files.get(id);
    if (!file) return undefined;
    const updated = { ...file, ...updates, modifiedAt: new Date() };
    this.files.set(id, updated);
    return updated;
  }

  async deleteFile(id: string): Promise<boolean> {
    return this.files.delete(id);
  }

  // Settings
  async getSettings(): Promise<Settings> {
    return this.settings;
  }

  async updateSettings(updates: Partial<InsertSettings>): Promise<Settings> {
    this.settings = { ...this.settings, ...updates };
    return this.settings;
  }

  // Calendar Events
  async getCalendarEvents(): Promise<CalendarEvent[]> {
    return Array.from(this.calendarEvents.values());
  }

  async createCalendarEvent(insertEvent: InsertCalendarEvent): Promise<CalendarEvent> {
    const id = randomUUID();
    const event: CalendarEvent = {
      ...insertEvent,
      id,
      date: new Date(insertEvent.date),
    };
    this.calendarEvents.set(id, event);
    return event;
  }

  async deleteCalendarEvent(id: string): Promise<boolean> {
    return this.calendarEvents.delete(id);
  }

  // Notes
  async getNotes(): Promise<Note[]> {
    return Array.from(this.notes.values());
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = randomUUID();
    const note: Note = {
      ...insertNote,
      id,
      sticky: insertNote.sticky || false,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;
    const updated = { ...note, ...updates, modifiedAt: new Date() };
    this.notes.set(id, updated);
    return updated;
  }

  async deleteNote(id: string): Promise<boolean> {
    return this.notes.delete(id);
  }

  // High Scores
  async getHighScores(game?: string): Promise<HighScore[]> {
    const scores = Array.from(this.highScores.values());
    if (game) {
      return scores.filter((s) => s.game === game);
    }
    return scores;
  }

  async createHighScore(insertScore: InsertHighScore): Promise<HighScore> {
    const id = randomUUID();
    const score: HighScore = {
      ...insertScore,
      id,
      date: new Date(),
    };
    this.highScores.set(id, score);
    return score;
  }

  // Bookmarks
  async getBookmarks(): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values());
  }

  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const id = randomUUID();
    const bookmark: Bookmark = {
      ...insertBookmark,
      id,
      createdAt: new Date(),
    };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  async deleteBookmark(id: string): Promise<boolean> {
    return this.bookmarks.delete(id);
  }

  // Paint Canvases
  async getPaintCanvases(): Promise<PaintCanvas[]> {
    return Array.from(this.paintCanvases.values());
  }

  async createPaintCanvas(insertCanvas: InsertPaintCanvas): Promise<PaintCanvas> {
    const id = randomUUID();
    const canvas: PaintCanvas = {
      ...insertCanvas,
      id,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    this.paintCanvases.set(id, canvas);
    return canvas;
  }

  // Chess Games
  async getChessGames(): Promise<ChessGame[]> {
    return Array.from(this.chessGames.values());
  }

  async saveChessGame(insertGame: InsertChessGame): Promise<ChessGame> {
    const id = randomUUID();
    const game: ChessGame = {
      ...insertGame,
      id,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    this.chessGames.set(id, game);
    return game;
  }
}

export const storage = new MemStorage();
