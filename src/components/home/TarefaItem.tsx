// src/components/home/TarefaItem.tsx

import React from "react";
import { Pressable, Text, View } from "react-native";
import { Projeto, Tarefa } from "../../types";
import Tag from "../ui/Tag";

type TarefaItemProps = {
  tarefa: Tarefa;
  projeto?: Projeto;
  onPress: () => void;
  onToggleConcluida: () => void;
};

type PrioridadeKey = "baixa" | "media" | "alta";

const prioridadeStyles: Record<
  PrioridadeKey,
  { bg: string; text: string }
> = {
  baixa: { bg: "#86EFAC", text: "#166534" },
  media: { bg: "#FDE68A", text: "#92400E" },
  alta: { bg: "#FCA5A5", text: "#991B1B" },
};

const getPrioridadeLabel = (p: PrioridadeKey) =>
  p === "baixa" ? "Baixa" : p === "media" ? "Média" : "Alta";

const TarefaItem: React.FC<TarefaItemProps> = ({
  tarefa,
  projeto,
  onPress,
  onToggleConcluida,
}) => {
  const prioridadeKey = tarefa.prioridade as PrioridadeKey | undefined;
  const prioridadeStyle = prioridadeKey
    ? prioridadeStyles[prioridadeKey]
    : undefined;

  return (
    <Pressable
      onPress={onPress}
      className="mb-2 p-3 mx-4 mt-2 rounded bg-neutral-900 flex-row justify-between items-center"
    >
      <View className="flex-1 mr-2 border-r border-white/5 pr-4">
        <Text
          className={`text-neutral-100 uppercase font-semibold ${
            tarefa.concluida ? "line-through text-neutral-500" : ""
          }`}
        >
          {tarefa.titulo}
        </Text>

        {tarefa.descricao ? (
          <Text
            className="text-neutral-400 text-sm mb-1"
            numberOfLines={1}
          >
            {tarefa.descricao}
          </Text>
        ) : null}

        <View className="flex-row gap-2 mt-1 items-center">
          {projeto && <Tag label={projeto.nome} />}

          {prioridadeKey && prioridadeStyle && (
            <View
              className="px-2 py-1 rounded-full"
              style={{ backgroundColor: prioridadeStyle.bg }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: prioridadeStyle.text }}
              >
                {getPrioridadeLabel(prioridadeKey)}
              </Text>
            </View>
          )}
        </View>
      </View>

      <Pressable
        onPress={onToggleConcluida}
        className={`w-6 h-6 rounded-full mx-4 border-2 items-center justify-center ${
          tarefa.concluida
            ? "border-green-400 bg-green-500"
            : "border-neutral-500"
        }`}
      >
        {tarefa.concluida && (
          <Text className="text-xs text-neutral-950">✓</Text>
        )}
      </Pressable>
    </Pressable>
  );
};

export default TarefaItem;
