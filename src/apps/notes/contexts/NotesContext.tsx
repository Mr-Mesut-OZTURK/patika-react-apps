import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Note } from "../types";

const LS_KEY = "notes_v1";

const genId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const nowISO = (): string => new Date().toISOString();

interface NotesContextType {
  notes: Note[];
  createNote: () => Note;
  updateNote: (
    id: string,
    patch: Partial<Omit<Note, "id" | "createdAt">>,
  ) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
}

const NotesContext = createContext<NotesContextType | null>(null);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as Note[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(notes));
  }, [notes]);

  const createNote = useCallback((): Note => {
    const note: Note = {
      id: genId(),
      title: "",
      content: "",
      emoji: "📝",
      color: "default",
      createdAt: nowISO(),
      updatedAt: nowISO(),
      pinned: false,
    };
    setNotes((prev) => [note, ...prev]);
    return note;
  }, []);

  const updateNote = useCallback(
    (id: string, patch: Partial<Omit<Note, "id" | "createdAt">>) => {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, ...patch, updatedAt: nowISO() } : n,
        ),
      );
    },
    [],
  );

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const togglePin = useCallback((id: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, pinned: !n.pinned, updatedAt: nowISO() } : n,
      ),
    );
  }, []);

  return (
    <NotesContext.Provider
      value={{ notes, createNote, updateNote, deleteNote, togglePin }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = (): NotesContextType => {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within NotesProvider");
  return ctx;
};
