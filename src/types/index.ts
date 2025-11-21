// src/types/index.ts

export type Projeto = {
  id: string;
  nome: string;
  descricao?: string;
  cor?: string;
  criadoEm: string;
};

export type Tarefa = {
  id: string;
  titulo: string;
  descricao?: string;
  projetoId?: string; // relacionamento com Projeto
  prioridade?: "baixa" | "media" | "alta";
  concluida: boolean;
  criadoEm: string;
  dataLimite?: string;
};
