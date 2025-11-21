import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/RootNavigator";
import { useMListStore } from "../store/useMListStore";
import AppHeader from "../components/layout/AppHeader";
import Button from "../components/ui/Button";
import Tag from "../components/ui/Tag";

type Props = NativeStackScreenProps<RootStackParamList, "TarefaDetalhe">;

const TarefaDetalheScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;

  const tarefas = useMListStore((s) => s.tarefas);
  const projetos = useMListStore((s) => s.projetos);
  const alternarConcluida = useMListStore((s) => s.alternarConcluida);

  const tarefa = tarefas.find((t) => t.id === id);
  const projeto = tarefa
    ? projetos.find((p) => p.id === tarefa.projetoId)
    : undefined;

  const handleEditar = () => {
    navigation.navigate("Edit", { mode: "task", id });
  };

  const handleToggleConcluida = () => {
    if (tarefa) alternarConcluida(tarefa.id);
  };

  if (!tarefa) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-950">
        <AppHeader title="Tarefa não encontrada" showBack />
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-neutral-300 text-center mb-4">
            Não encontramos esta tarefa. Ela pode ter sido removida.
          </Text>
          <Button label="Voltar" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const prioridadeLabel =
    tarefa.prioridade === "alta"
      ? "Alta"
      : tarefa.prioridade === "media"
      ? "Média"
      : tarefa.prioridade === "baixa"
      ? "Baixa"
      : "Não definida";

  const prioridadeColorClass =
    tarefa.prioridade === "alta"
      ? "bg-rose-500/20 border-rose-500/40"
      : tarefa.prioridade === "media"
      ? "bg-amber-500/20 border-amber-500/40"
      : tarefa.prioridade === "baixa"
      ? "bg-emerald-500/20 border-emerald-500/40"
      : "bg-neutral-700/40 border-neutral-600";

  const statusColorClass = tarefa.concluida
    ? "bg-emerald-500/20 border-emerald-500/40"
    : "bg-sky-500/20 border-sky-500/40";

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <AppHeader title="Detalhes da tarefa" showBack />

      <ScrollView className="flex-1 px-4 pt-8 pb-4">

        {/* Card principal */}
        <View className="rounded-2xl p-4 mb-5 bg-neutral-900 border border-neutral-800 shadow-sm">

          {/* Título + status */}
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 pr-2">
              <Text className="text-white text-xl font-bold mb-1 uppercase">
                {tarefa.titulo}
              </Text>

              {projeto && (
                <Text className="text-neutral-200 text-xs">
                  Projeto: <Text className="font-medium text-white">{projeto.nome}</Text>
                </Text>
              )}
            </View>

            <View className={`px-3 py-1 rounded-full border ${statusColorClass}`}>
              <Text className="text-[11px] font-semibold uppercase text-white">
                {tarefa.concluida ? "Concluída" : "Pendente"}
              </Text>
            </View>
          </View>

          {/* Descrição */}
          {tarefa.descricao ? (
            <Text className="text-white text-sm mb-3">
              {tarefa.descricao}
            </Text>
          ) : (
            <Text className="text-neutral-400 text-xs italic mb-3">
              Sem descrição detalhada.
            </Text>
          )}

          {/* Tags e metadados */}
          <View className="flex-row flex-wrap gap-2 mb-3 items-center">

            {/* {projeto && <Tag label={projeto.nome} />} */}

            <View className={`px-3 py-1 rounded-full border ${prioridadeColorClass}`}>
              <Text className="text-[11px] font-semibold uppercase text-white">
                Prioridade: {prioridadeLabel}
              </Text>
            </View>

            {tarefa.dataLimite && (
              <Tag label={`Até: ${tarefa.dataLimite}`} />
            )}
          </View>

          {/* Datas */}
          <View className="mt-1">
            <Text className="text-neutral-300 text-xs">
              Criada em:{" "}
              <Text className="font-semibold text-white">
                {new Date(tarefa.criadoEm).toLocaleDateString("pt-BR")}
              </Text>
            </Text>
          </View>

        </View>

        {/* Ações */}
        <View className="flex-col gap-3">
          <Button label="Editar tarefa" onPress={handleEditar} />

          <Button
            label={tarefa.concluida ? "Marcar como pendente" : "Marcar como concluída"}
            variant="secondary"
            onPress={handleToggleConcluida}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TarefaDetalheScreen;
