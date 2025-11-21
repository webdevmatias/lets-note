import React from "react";
import { Pressable, Text, View } from "react-native";
import { Projeto, Tarefa } from "../../types";

type ProjetoCardProps = {
  projeto: Projeto;
  tarefas: Tarefa[];
  onPress: (id: string) => void;
};

const limitar = (txt: string, max: number) =>
  txt.length > max ? txt.slice(0, max) + "..." : txt;

const ProjetoCard: React.FC<ProjetoCardProps> = ({
  projeto,
  tarefas,
  onPress,
}) => {
  const tarefasDoProjeto = tarefas.filter((t) => t.projetoId === projeto.id);
  const concluidas = tarefasDoProjeto.filter((t) => t.concluida).length;
  const total = tarefasDoProjeto.length;
  const hasColor = !!projeto.cor;

  const concluido = total > 0 && concluidas === total;
  const progresso = total > 0 ? concluidas / total : 0;

  // cores para texto em cima do fundo colorido
  const titleClass = hasColor
    ? "text-neutral-900 font-semibold"
    : "text-neutral-100 font-semibold";

  const bodyClass = hasColor
    ? "text-neutral-800 text-xs"
    : "text-neutral-400 text-xs";

  const subtleClass = hasColor
    ? "text-neutral-700 text-[11px]"
    : "text-neutral-500 text-[11px]";

  return (
    <Pressable
      onPress={() => onPress(projeto.id)}
      className="mr-3 w-56 h-32 rounded-2xl border border-neutral-800 overflow-hidden"
      style={{
        backgroundColor: hasColor ? projeto.cor : "#171717",
      }}
    >
      {/* overlay interno para dar contraste */}
      <View className="flex-1 p-3 bg-black/10">
        
        {/* TOPO: título + status */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className={`${titleClass} text-sm`} numberOfLines={1}>
            {limitar(projeto.nome, 10)}
          </Text>

          <View
            className={`px-2 py-0.5 rounded-full ${
              concluido ? "bg-emerald-500/90" : "bg-amber-400/90"
            }`}
          >
            <Text className="text-[10px] font-semibold text-neutral-950 uppercase">
              {concluido ? "Concluído" : "Em andamento"}
            </Text>
          </View>
        </View>

        {/* DESCRIÇÃO */}
        {projeto.descricao ? (
          <Text className={`${bodyClass} mb-3`} numberOfLines={2}>
            {projeto.descricao}
          </Text>
        ) : (
          <Text className={`${subtleClass} italic mb-3`}>Sem descrição.</Text>
        )}

        {/* PROGRESSO */}
        <View className="mt-auto">
          <View className="w-full h-2 rounded-full bg-black/20 overflow-hidden mb-1">
            <View
              className="h-full rounded-full bg-emerald-700"
              style={{
                width: `${progresso * 100}%`,
              }}
            />
          </View>

          <View className="flex-row justify-between items-center">
            <Text className={subtleClass}>
              {total === 0
                ? "Nenhuma tarefa ainda"
                : `${concluidas}/${total} concluídas`}
            </Text>

            {total > 0 && (
              <Text className={subtleClass}>{Math.round(progresso * 100)}%</Text>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default ProjetoCard;
