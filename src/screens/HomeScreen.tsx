import React from "react";
import {
  View,
  Pressable,
  Text,
  Alert,
  FlatList,
  ListRenderItem,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

import { RootStackParamList } from "../navigation/RootNavigator";
import { tarefasToCsv, csvToTarefas } from "../lib/csv";

import ProjetoSection from "../components/home/ProjetoSection";
import FabMenu from "../components/home/FabMenu";
import AppHeader from "../components/layout/AppHeader";
import CalendarioTarefas from "../components/calendar/CalendarioTarefas";
import TarefaItem from "../components/home/TarefaItem";

import { Tarefa } from "../types";
import {
  useHomeScreenData,
  FiltroProjetos,
  FiltroTarefas,
} from "../hooks/useHomeScreenData";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const {
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
  } = useHomeScreenData();

  // ====== AÇÕES DE CSV ======
  const handleExportar = async () => {
    try {
      const csv = tarefasToCsv(tarefas, projetos);

      const baseDir =
        (FileSystem as any).documentDirectory ??
        (FileSystem as any).cacheDirectory ??
        "";

      const fileUri = baseDir + "letsnote-tarefas.csv";

      await FileSystem.writeAsStringAsync(fileUri, csv);

      const canShare = await Sharing.isAvailableAsync();

      if (!canShare) {
        Alert.alert(
          "Exportação CSV",
          `Arquivo salvo em:\n${fileUri}\n\nSeu dispositivo não suporta o painel de compartilhamento.`
        );
        return;
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: "text/csv",
        dialogTitle: "Exportar tarefas como CSV",
      });
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Erro",
        "Não foi possível exportar o CSV. Tente novamente mais tarde."
      );
    }
  };

  const handleImportar = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "text/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      const uri = file.uri;

      const csv = await FileSystem.readAsStringAsync(uri);

      const tarefasBase = csvToTarefas(csv);

      if (tarefasBase.length === 0) {
        Alert.alert(
          "Importação CSV",
          "Nenhuma tarefa encontrada no arquivo."
        );
        return;
      }

      tarefasBase.forEach((t) => {
        adicionarTarefa({
          titulo: t.titulo,
          descricao: t.descricao,
          projetoId: t.projetoId,
          prioridade: t.prioridade ?? "media",
          dataLimite: t.dataLimite,
        });
      });

      Alert.alert(
        "Importação CSV",
        `Importadas ${tarefasBase.length} tarefas do arquivo.`
      );
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Erro",
        "Não foi possível importar o CSV. Verifique o arquivo e tente novamente."
      );
    }
  };

  // ====== NAVEGAÇÃO ======
  const handleNovaTarefa = () =>
    navigation.navigate("Edit", { mode: "task" });

  const handleNovoProjeto = () =>
    navigation.navigate("Edit", { mode: "project" });

  // ====== RENDER TAREFA (ITEM DA LISTA) ======
  const renderTarefa: ListRenderItem<Tarefa> = ({ item }) => {
    const projeto = projetos.find((p) => p.id === item.projetoId);

    return (
      <TarefaItem
        tarefa={item}
        projeto={projeto}
        onPress={() =>
          navigation.navigate("TarefaDetalhe", { id: item.id })
        }
        onToggleConcluida={() => alternarConcluida(item.id)}
      />
    );
  };

  // ====== HEADER DA LISTA (calendário + filtros + projetos + título tarefas) ======
  const renderHeader = () => (
    <View className="px-4">
      {/* CALENDÁRIO */}
      <View className="">
        <CalendarioTarefas
          tarefas={tarefas}
          selectedDate={dataFiltro}
          onChangeSelectedDate={setDataFiltro}
        />
      </View>

      {/* PROJETOS */}
      <Text className="mb-4 text-center text-xl font-semibold text-white border-y border-white/10 py-4">
        Meus Projetos:
      </Text>

      {/* Filtro de projetos */}
      <View className="mb-4">
        <View className="flex-row rounded-full bg-neutral-900 p-1">
          <Pressable
            onPress={() => setFiltroProjetos("ativos")}
            className={`flex-1 items-center rounded-full px-3 py-2 ${
              filtroProjetos === "ativos" ? "bg-blue-600" : ""
            }`}
          >
            <Text
              className={
                filtroProjetos === "ativos"
                  ? "text-xs font-semibold text-white"
                  : "text-xs text-neutral-300"
              }
            >
              PROJETOS ATIVOS
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setFiltroProjetos("concluidos")}
            className={`flex-1 items-center rounded-full px-3 py-2 ${
              filtroProjetos === "concluidos" ? "bg-blue-600" : ""
            }`}
          >
            <Text
              className={
                filtroProjetos === "concluidos"
                  ? "text-xs font-semibold text-white"
                  : "text-xs text-neutral-300"
              }
            >
              PROJETOS CONCLUÍDOS
            </Text>
          </Pressable>
        </View>
      </View>

      <ProjetoSection
        projetos={projetosVisiveis}
        tarefas={tarefas}
        onPressProjeto={(id) =>
          navigation.navigate("ProjetoDetalhe", { id })
        }
      />

      {/* TAREFAS */}
      <Text className="mb-4 text-center mt-2 text-xl font-semibold text-white border-y border-white/10 py-4">
        Minhas Tarefas:
      </Text>

      {/* Filtro de tarefas */}
      <View className="mb-2">
        <View className="flex-row rounded-full bg-neutral-900 p-1">
          <Pressable
            onPress={() => setFiltroTarefas("ativas")}
            className={`flex-1 items-center rounded-full px-3 py-2 ${
              filtroTarefas === "ativas" ? "bg-blue-600" : ""
            }`}
          >
            <Text
              className={
                filtroTarefas === "ativas"
                  ? "text-xs font-semibold text-white"
                  : "text-xs text-neutral-300"
              }
            >
              TAREFAS ATIVAS
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setFiltroTarefas("concluidas")}
            className={`flex-1 items-center rounded-full px-3 py-2 ${
              filtroTarefas === "concluidas" ? "bg-blue-600" : ""
            }`}
          >
            <Text
              className={
                filtroTarefas === "concluidas"
                  ? "text-xs font-semibold text-white"
                  : "text-xs text-neutral-300"
              }
            >
              TAREFAS CONCLUÍDAS
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <AppHeader title="" reverse />

      <FlatList
        data={tarefasVisiveis}
        keyExtractor={(item) => item.id}
        renderItem={renderTarefa}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      />

      <FabMenu
        onNovaTarefa={handleNovaTarefa}
        onNovoProjeto={handleNovoProjeto}
        onExportar={handleExportar}
        onImportar={handleImportar}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
