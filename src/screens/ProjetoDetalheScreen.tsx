// src/screens/ProjetoDetalheScreen.tsx

import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/RootNavigator";
import { useMListStore } from "../store/useMListStore";
import AppHeader from "../components/layout/AppHeader";
import Button from "../components/ui/Button";
import Tag from "../components/ui/Tag";

type Props = NativeStackScreenProps<RootStackParamList, "ProjetoDetalhe">;

const ProjetoDetalheScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;

  const projetos = useMListStore((s) => s.projetos);
  const tarefas = useMListStore((s) => s.tarefas);

  const projeto = projetos.find((p) => p.id === id);

  const tarefasDoProjeto = useMemo(
    () => tarefas.filter((t) => t.projetoId === id),
    [tarefas, id]
  );

  const concluidas = tarefasDoProjeto.filter((t) => t.concluida).length;
  const total = tarefasDoProjeto.length;
  const concluido = total > 0 && concluidas === total;
  const progresso = total > 0 ? concluidas / total : 0;

  const handleEditar = () => {
    navigation.navigate("Edit", { mode: "project", id });
  };

  if (!projeto) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-950">
        <AppHeader title="Projeto não encontrado" showBack />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="mb-4 text-center text-neutral-300">
            Não encontramos este projeto. Ele pode ter sido removido.
          </Text>
          <Button label="Voltar" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const usoCorCustom = !!projeto.cor;
  const tituloClass = usoCorCustom
    ? "text-neutral-900 text-xl font-bold mb-1"
    : "text-white text-xl font-bold mb-1";

  const bodyClass = usoCorCustom
    ? "text-neutral-800 text-sm"
    : "text-neutral-200 text-sm";

  const subtleClass = usoCorCustom
    ? "text-neutral-700 text-xs"
    : "text-neutral-400 text-xs";

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <AppHeader title="Detalhes do projeto" showBack />

      {/* Scroll geral da página */}
      <ScrollView className="flex-1 px-4 pb-4 pt-8">
        {/* CARD PRINCIPAL */}
        <View
          className="mb-5 rounded-2xl border border-neutral-800 p-4 shadow-sm"
          style={{
            backgroundColor: projeto.cor || "#0b1120",
          }}
        >
          {/* Cabeçalho do card */}
          <View className="mb-2 flex-row items-center justify-between">
            <View className="flex-1 pr-2">
              <Text className={tituloClass} numberOfLines={2}>
                {projeto.nome}
              </Text>
            </View>

            <View
              className={`rounded-full px-3 py-1 ${
                concluido ? "bg-emerald-500/90" : "bg-amber-400/90"
              }`}
            >
              <Text className="text-[11px] font-semibold uppercase text-neutral-950">
                {concluido ? "Concluído" : "Em andamento"}
              </Text>
            </View>
          </View>

          {/* Descrição */}
          {projeto.descricao ? (
            <Text className={`${bodyClass} mb-3`}>{projeto.descricao}</Text>
          ) : (
            <Text className={`${subtleClass} mb-3 italic`}>
              Sem descrição cadastrada.
            </Text>
          )}

          {/* Infos rápidas */}
          <View className="mb-3 flex-row flex-wrap gap-3">
            <View>
              <Text className={`${subtleClass} mb-0.5`}>Criado em</Text>
              <Text
                className={`${
                  usoCorCustom ? "text-neutral-900" : "text-white"
                } text-xs font-semibold`}
              >
                {new Date(projeto.criadoEm).toLocaleDateString("pt-BR")}
              </Text>
            </View>

            <View>
              <Text className={`${subtleClass} mb-0.5`}>Tarefas</Text>
              <Text
                className={`${
                  usoCorCustom ? "text-neutral-900" : "text-white"
                } text-xs font-semibold`}
              >
                {total === 0
                  ? "Nenhuma tarefa"
                  : `${concluidas}/${total} concluídas`}
              </Text>
            </View>
          </View>

          {/* Barra de progresso */}
          <View>
            <View className="mb-1 flex-row justify-between">
              <Text className={subtleClass}>Progresso</Text>
              {total > 0 && (
                <Text className={subtleClass}>
                  {Math.round(progresso * 100)}%
                </Text>
              )}
            </View>

            <View className="h-2 w-full overflow-hidden rounded-full bg-black/15">
              <View
                className="h-full rounded-full bg-emerald-700"
                style={{
                  width: `${progresso * 100}%`,
                }}
              />
            </View>
          </View>
        </View>

        {/* LISTA DE TAREFAS DO PROJETO COM SCROLL PRÓPRIO */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-semibold text-white">
            Tarefas deste projeto:
          </Text>
          <Text className="mb-2 text-xs font-semibold text-white/40">
            Puxe para baixo para descer a lista.
          </Text>
          {tarefasDoProjeto.length === 0 ? (
            <Text className="text-sm text-neutral-500">
              Nenhuma tarefa vinculada ainda.
            </Text>
          ) : (
            <ScrollView
              className="max-h-80"
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {tarefasDoProjeto.map((t) => (
                <View
                  key={t.id}
                  className="mb-2 flex-row items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900 p-3"
                >
                  <View className="mr-2 flex-1 border-r border-white/5 pr-4">
                    <Text
                      className={`font-semibold uppercase text-neutral-100 ${
                        t.concluida ? "text-neutral-500 line-through" : ""
                      }`}
                      numberOfLines={1}
                    >
                      {t.titulo}
                    </Text>

                    {t.descricao ? (
                      <Text
                        className="text-xs text-neutral-400"
                        numberOfLines={1}
                      >
                        {t.descricao}
                      </Text>
                    ) : null}

                    <View className="mt-1 flex-row items-center gap-2">
                      {t.prioridade && (
                        <Tag label={`Prioridade: ${t.prioridade}`} />
                      )}
                    </View>
                  </View>

                  <Text
                    className={`mx-4 text-[11px] font-medium ${
                      t.concluida ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {t.concluida ? "Concluída" : "Pendente"}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Botão Editar */}
        <Button label="Editar projeto" onPress={handleEditar} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProjetoDetalheScreen;
