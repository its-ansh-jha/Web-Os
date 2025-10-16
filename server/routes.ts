import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertFileNodeSchema, 
  insertSettingsSchema, 
  insertCalendarEventSchema, 
  insertNoteSchema, 
  insertHighScoreSchema, 
  insertBookmarkSchema,
  insertPaintCanvasSchema,
  insertChessGameSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // File System Routes
  app.get("/api/files", async (req, res) => {
    const files = await storage.getFiles();
    res.json(files);
  });

  app.get("/api/files/:id", async (req, res) => {
    const file = await storage.getFile(req.params.id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    res.json(file);
  });

  app.post("/api/files", async (req, res) => {
    try {
      const data = insertFileNodeSchema.parse(req.body);
      const file = await storage.createFile(data);
      res.json(file);
    } catch (error) {
      res.status(400).json({ error: "Invalid file data" });
    }
  });

  app.patch("/api/files/:id", async (req, res) => {
    const file = await storage.updateFile(req.params.id, req.body);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    res.json(file);
  });

  app.delete("/api/files/:id", async (req, res) => {
    const success = await storage.deleteFile(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "File not found" });
    }
    res.json({ success: true });
  });

  // Settings Routes
  app.get("/api/settings", async (req, res) => {
    const settings = await storage.getSettings();
    res.json(settings);
  });

  app.patch("/api/settings", async (req, res) => {
    try {
      const data = insertSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateSettings(data);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ error: "Invalid settings data" });
    }
  });

  // Calendar Events Routes
  app.get("/api/calendar-events", async (req, res) => {
    const events = await storage.getCalendarEvents();
    res.json(events);
  });

  app.post("/api/calendar-events", async (req, res) => {
    try {
      const data = insertCalendarEventSchema.parse(req.body);
      const event = await storage.createCalendarEvent(data);
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  app.delete("/api/calendar-events/:id", async (req, res) => {
    const success = await storage.deleteCalendarEvent(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ success: true });
  });

  // Notes Routes
  app.get("/api/notes", async (req, res) => {
    const notes = await storage.getNotes();
    res.json(notes);
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const data = insertNoteSchema.parse(req.body);
      const note = await storage.createNote(data);
      res.json(note);
    } catch (error) {
      res.status(400).json({ error: "Invalid note data" });
    }
  });

  app.patch("/api/notes/:id", async (req, res) => {
    const note = await storage.updateNote(req.params.id, req.body);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
  });

  app.delete("/api/notes/:id", async (req, res) => {
    const success = await storage.deleteNote(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json({ success: true });
  });

  // High Scores Routes
  app.get("/api/high-scores", async (req, res) => {
    const game = req.query.game as string | undefined;
    const scores = await storage.getHighScores(game);
    res.json(scores);
  });

  app.post("/api/high-scores", async (req, res) => {
    try {
      const data = insertHighScoreSchema.parse(req.body);
      const score = await storage.createHighScore(data);
      res.json(score);
    } catch (error) {
      res.status(400).json({ error: "Invalid score data" });
    }
  });

  // Bookmarks Routes
  app.get("/api/bookmarks", async (req, res) => {
    const bookmarks = await storage.getBookmarks();
    res.json(bookmarks);
  });

  app.post("/api/bookmarks", async (req, res) => {
    try {
      const data = insertBookmarkSchema.parse(req.body);
      const bookmark = await storage.createBookmark(data);
      res.json(bookmark);
    } catch (error) {
      res.status(400).json({ error: "Invalid bookmark data" });
    }
  });

  app.delete("/api/bookmarks/:id", async (req, res) => {
    const success = await storage.deleteBookmark(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Bookmark not found" });
    }
    res.json({ success: true });
  });

  // Paint Canvases Routes
  app.get("/api/paint-canvases", async (req, res) => {
    const canvases = await storage.getPaintCanvases();
    res.json(canvases);
  });

  app.post("/api/paint-canvases", async (req, res) => {
    try {
      const data = insertPaintCanvasSchema.parse(req.body);
      const canvas = await storage.createPaintCanvas(data);
      res.json(canvas);
    } catch (error) {
      res.status(400).json({ error: "Invalid canvas data" });
    }
  });

  // Chess Games Routes
  app.get("/api/chess-games", async (req, res) => {
    const games = await storage.getChessGames();
    res.json(games);
  });

  app.post("/api/chess-games", async (req, res) => {
    try {
      const data = insertChessGameSchema.parse(req.body);
      const game = await storage.saveChessGame(data);
      res.json(game);
    } catch (error) {
      res.status(400).json({ error: "Invalid game data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
