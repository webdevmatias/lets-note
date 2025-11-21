import { useMemo, useState } from "react";
import { useMListStore } from "../store/useMListStore";
import { Projeto, Tarefa } from "../types";

export type FiltroTarefas = "ativas" | "concluidas";
export type FiltroProjetos = "ativos" | "concluidos";

type UseHomeScreenDataReturn = {
  // dados brutos
  projetos: Projeto[];
  tarefas: Tarefa[];

  // ações
  alternarConcluida: (id: string) => void;
  adicionarTarefa: (
    tarefa: Omit<Tarefa, "id" | "criadoEm" | "concluida">
  ) => void;

  // filtros e setters
  dataFiltro?: string;
  setDataFiltro: (d?: string) => void;
  filtroTarefas: FiltroTarefas;
  setFiltroTarefas: (f: FiltroTarefas) => void;
  filtroProjetos: FiltroProjetos;
  setFiltroProjetos: (f: FiltroProjetos) => void;

  // dados derivados
  tarefasVisiveis: Tarefa[];
  projetosVisiveis: Projeto[];
};

export const useHomeScreenData = (): UseHomeScreenDataReturn => {
  // estado global (store)
  const projetos = useMListStore((s) => s.projetos);
  const tarefas = useMListStore((s) => s.tarefas);
  const alternarConcluida = useMListStore((s) => s.alternarConcluida);
  const adicionarTarefa = useMListStore((s) => s.adicionarTarefa);

  // estado local da Home
  const [dataFiltro, setDataFiltro] = useState<string | undefined>(undefined);
  const [filtroTarefas, setFiltroTarefas] =
    useState<FiltroTarefas>("ativas");
  const [filtroProjetos, setFiltroProjetos] =
    useState<FiltroProjetos>("ativos");

  // ====== TAREFAS ======
  const tarefasOrdenadas = useMemo(
    () =>
      [...tarefas].sort((a, b) => {
        if (a.concluida === b.concluida) return 0;
        return a.concluida ? 1 : -1;
      }),
    [tarefas]
  );

  const tarefasFiltradasPorData = useMemo(() => {
    if (!dataFiltro) return tarefasOrdenadas;
    return tarefasOrdenadas.filter(
      (t) =>
        t.dataLimite &&
        t.dataLimite.slice(0, 10) === dataFiltro.slice(0, 10)
    );
  }, [tarefasOrdenadas, dataFiltro]);

  const tarefasAtivas = useMemo(
    () => tarefasFiltradasPorData.filter((t) => !t.concluida),
    [tarefasFiltradasPorData]
  );

  const tarefasConcluidas = useMemo(
    () => tarefasFiltradasPorData.filter((t) => t.concluida),
    [tarefasFiltradasPorData]
  );

  const tarefasVisiveis: Tarefa[] =
    filtroTarefas === "ativas" ? tarefasAtivas : tarefasConcluidas;

  // ====== PROJETOS (ATIVOS x CONCLUÍDOS) ======
  const projetosComStatus = useMemo(
    () =>
      projetos.map((p) => {
        const tarefasDoProjeto = tarefas.filter(
          (t) => t.projetoId === p.id
        );
        const temTarefas = tarefasDoProjeto.length > 0;
        const todasConcluidas =
          temTarefas && tarefasDoProjeto.every((t) => t.concluida);

        return {
          projeto: p,
          concluido: todasConcluidas,
        };
      }),
    [projetos, tarefas]
  );

  const projetosAtivos: Projeto[] = useMemo(
    () =>
      projetosComStatus
        .filter((p) => !p.concluido)
        .map((p) => p.projeto),
    [projetosComStatus]
  );

  const projetosConcluidos: Projeto[] = useMemo(
    () =>
      projetosComStatus
        .filter((p) => p.concluido)
        .map((p) => p.projeto),
    [projetosComStatus]
  );

  const projetosVisiveis: Projeto[] =
    filtroProjetos === "ativos" ? projetosAtivos : projetosConcluidos;

  return {
    projetos,
    tarefas,
    alternarConcluida,
    adicionarTarefa,
    dataFiltro,
    setDataFiltro,
    filtroTarefas,
    setFiltroTarefas,
    filtroProjetos,
    setFiltroProjetos,
    tarefasVisiveis,
    projetosVisiveis,
  };
};
