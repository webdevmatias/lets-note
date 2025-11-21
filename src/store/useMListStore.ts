import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Projeto, Tarefa } from "../types";

// Gerador de ID simples (compatível com React Native)
const gerarId = () => {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 8)
  );
};

type MListState = {
  projetos: Projeto[];
  tarefas: Tarefa[];

  // ações de projeto
  adicionarProjeto: (projeto: Omit<Projeto, "id" | "criadoEm">) => void;
  editarProjeto: (id: string, data: Partial<Projeto>) => void;
  removerProjeto: (id: string) => void;

  // ações de tarefa
  adicionarTarefa: (tarefa: Omit<Tarefa, "id" | "criadoEm" | "concluida">) => void;
  editarTarefa: (id: string, data: Partial<Tarefa>) => void;
  removerTarefa: (id: string) => void;
  alternarConcluida: (id: string) => void;
};

export const useMListStore = create<MListState>()(
  persist(
    (set, get) => ({
      projetos: [],
      tarefas: [],

      adicionarProjeto: (projeto) =>
        set((state) => ({
          projetos: [
            ...state.projetos,
            {
              id: gerarId(),
              criadoEm: new Date().toISOString(),
              ...projeto,
            },
          ],
        })),

      editarProjeto: (id, data) =>
        set((state) => ({
          projetos: state.projetos.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),

      removerProjeto: (id) =>
        set((state) => ({
          projetos: state.projetos.filter((p) => p.id !== id),
          tarefas: state.tarefas.filter((t) => t.projetoId !== id),
        })),

      adicionarTarefa: (tarefa) =>
        set((state) => ({
          tarefas: [
            ...state.tarefas,
            {
              id: gerarId(),
              criadoEm: new Date().toISOString(),
              concluida: false,
              ...tarefa,
            },
          ],
        })),

      editarTarefa: (id, data) =>
        set((state) => ({
          tarefas: state.tarefas.map((t) =>
            t.id === id ? { ...t, ...data } : t
          ),
        })),

      removerTarefa: (id) =>
        set((state) => ({
          tarefas: state.tarefas.filter((t) => t.id !== id),
        })),

      alternarConcluida: (id) =>
        set((state) => ({
          tarefas: state.tarefas.map((t) =>
            t.id === id ? { ...t, concluida: !t.concluida } : t
          ),
        })),
    }),
    {
      name: "mlist-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
