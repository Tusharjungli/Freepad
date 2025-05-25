// lib/store/notebookStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Notebook = {
  id: string;
  name: string;
  content: string;
};

type State = {
  notebooks: Notebook[];
  currentId: string | null;
  createNotebook: (name?: string) => void;
  updateNotebook: (id: string, content: string) => void;
  setCurrentNotebook: (id: string) => void;
  renameNotebook: (id: string, name: string) => void;
  deleteNotebook: (id: string) => void;
};

const initialNotebook = {
  id: crypto.randomUUID(),
  name: "My First Notebook",
  content: "",
};

export const useNotebookStore = create<State>()(
  persist(
    (set,) => ({
      notebooks: [initialNotebook],
      currentId: initialNotebook.id,
      createNotebook: (name = "Untitled Notebook") => {
        const id = crypto.randomUUID();
        set((state) => ({
          notebooks: [
            ...state.notebooks,
            { id, name, content: "" },
          ],
          currentId: id,
        }));
      },
      updateNotebook: (id, content) => {
        set((state) => ({
          notebooks: state.notebooks.map((nb) =>
            nb.id === id ? { ...nb, content } : nb
          ),
        }));
      },
      setCurrentNotebook: (id) => set({ currentId: id }),
      renameNotebook: (id, name) => {
        set((state) => ({
          notebooks: state.notebooks.map((nb) =>
            nb.id === id ? { ...nb, name } : nb
          ),
        }));
      },
      deleteNotebook: (id) => {
        set((state) => {
          let notebooks = state.notebooks.filter((nb) => nb.id !== id);
          let currentId =
            state.currentId === id && notebooks.length
              ? notebooks[0].id
              : state.currentId === id
              ? null
              : state.currentId;
          // If deleted last, create a new one
          if (notebooks.length === 0) {
            const newNb = {
              id: crypto.randomUUID(),
              name: "My First Notebook",
              content: "",
            };
            notebooks = [newNb];
            currentId = newNb.id;
          }
          return { notebooks, currentId };
        });
      },
    }),
    { name: "freepad-notebooks" }
  )
);
