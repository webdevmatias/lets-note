import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { Projeto, Tarefa } from "../../types";
import Tag from "../ui/Tag";

type TarefaSectionProps = {
  tarefas: Tarefa[];
  projetos: Projeto[];
  onPressTarefa: (id: string) => void;
  onToggleConcluida: (id: string) => void;
};

// cores pastel iguais ao cadastro
type PrioridadeKey = "baixa" | "media" | "alta";

const prioridadeStyles: Record<
  PrioridadeKey,
  { bg: string; text: string }
> = {
  baixa: { bg: "#86EFAC", text: "#166534" }, // Verde pastel
  media: { bg: "#FDE68A", text: "#92400E" }, // Amarelo pastel
  alta: { bg: "#FCA5A5", text: "#991B1B" }, // Vermelho pastel
};

const getPrioridadeLabel = (p: PrioridadeKey) =>
  p === "baixa" ? "Baixa" : p === "media" ? "Média" : "Alta";

const TarefaSection: React.FC<TarefaSectionProps> = ({
  tarefas,
  projetos,
  onPressTarefa,
  onToggleConcluida,
}) => {
  return (
    <View className="mt-2 flex-1">
      {tarefas.length === 0 ? (
        <Text className="text-neutral-500">Nenhuma tarefa cadastrada.</Text>
      ) : (
        <FlatList
          data={tarefas}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{ paddingBottom: 120 }} // evita conflito com FAB
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const projeto = projetos.find((p) => p.id === item.projetoId);

            const prioridadeKey = item.prioridade as PrioridadeKey | undefined;
            const prioridadeStyle = prioridadeKey
              ? prioridadeStyles[prioridadeKey]
              : undefined;

            return (
              <Pressable
                onPress={() => onPressTarefa(item.id)}
                className="mb-2 p-3 rounded-2xl bg-neutral-900 flex-row justify-between items-center"
              >
                <View className="flex-1 mr-2 border-r border-white/5 pr-4">
                  <Text
                    className={`text-neutral-100 uppercase font-semibold ${
                      item.concluida ? "line-through text-neutral-500" : ""
                    }`}
                    numberOfLines={1}
                  >
                    {item.titulo}
                  </Text>

                  {item.descricao ? (
                    <Text
                      className="text-neutral-400 text-sm mb-1"
                      numberOfLines={1}
                    >
                      {item.descricao}
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
                  onPress={() => onToggleConcluida(item.id)}
                  className={`w-6 h-6 rounded-full mx-4 border-2 items-center justify-center ${
                    item.concluida
                      ? "border-green-400 bg-green-500"
                      : "border-neutral-500"
                  }`}
                >
                  {item.concluida && (
                    <Text className="text-xs text-neutral-950">✓</Text>
                  )}
                </Pressable>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
};

export default TarefaSection;
