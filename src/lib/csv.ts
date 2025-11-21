import { Projeto, Tarefa } from "../types";

/**
 * Gera um CSV simples das tarefas.
 * Colunas:
 * id;titulo;descricao;projetoId;prioridade;dataLimite;concluida
 */
export const tarefasToCsv = (tarefas: Tarefa[], projetos: Projeto[]) => {
  const header =
    "id;titulo;descricao;projetoId;prioridade;dataLimite;concluida\n";

  const linhas = tarefas.map((t) => {
    const safe = (v: string | undefined | null) =>
      v ? String(v).replace(/[\n\r;]/g, " ") : "";

    return [
      safe(t.id),
      safe(t.titulo),
      safe(t.descricao),
      safe(t.projetoId),
      safe(t.prioridade ?? ""),
      safe(t.dataLimite),
      t.concluida ? "1" : "0",
    ].join(";");
  });

  return header + linhas.join("\n");
};

/**
 * Converte CSV no mesmo formato acima em um array de "dados crus"
 * para depois você decidir como jogar isso na store.
 */
export type CsvTarefaBase = {
  id: string;
  titulo: string;
  descricao?: string;
  projetoId?: string;
  prioridade?: Tarefa["prioridade"];
  dataLimite?: string;
  concluida: boolean;
};

export const csvToTarefas = (csv: string): CsvTarefaBase[] => {
  const linhas = csv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (linhas.length <= 1) return [];

  // Remove header
  const [, ...dados] = linhas;

  return dados
    .map((linha) => linha.split(";"))
    .map((cols) => {
      const [
        id,
        titulo,
        descricao,
        projetoId,
        prioridade,
        dataLimite,
        concluida,
      ] = cols;

      return {
        id: id ?? "",
        titulo: titulo ?? "",
        descricao: descricao || undefined,
        projetoId: projetoId || undefined,
        prioridade: (prioridade as Tarefa["prioridade"]) || undefined,
        dataLimite: dataLimite || undefined,
        concluida: concluida === "1",
      } as CsvTarefaBase;
    })
    .filter((t) => t.titulo); // só entra se tiver título
};
