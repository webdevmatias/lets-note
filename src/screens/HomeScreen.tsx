// src/screens/HomeScreen.tsx

import React, { useMemo, useState } from 'react';
import { View, Pressable, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

import { RootStackParamList } from '../navigation/RootNavigator';
import { useMListStore } from '../store/useMListStore';
import { tarefasToCsv, csvToTarefas } from '../lib/csv';

import ProjetoSection from '../components/home/ProjetoSection';
import TaskSection from '../components/home/TarefaSection';
import FabMenu from '../components/home/FabMenu';
import AppHeader from '../components/layout/AppHeader';
import CalendarioTarefas from '../components/calendar/CalendarioTarefas';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type FiltroTarefas = 'ativas' | 'concluidas';
type FiltroProjetos = 'ativos' | 'concluidos';

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const projetos = useMListStore((s) => s.projetos);
  const tarefas = useMListStore((s) => s.tarefas);
  const alternarConcluida = useMListStore((s) => s.alternarConcluida);
  const adicionarTarefa = useMListStore((s) => s.adicionarTarefa);

  const [dataFiltro, setDataFiltro] = useState<string | undefined>(undefined);
  const [filtroTarefas, setFiltroTarefas] = useState<FiltroTarefas>('ativas');
  const [filtroProjetos, setFiltroProjetos] = useState<FiltroProjetos>('ativos');

  // ====== TAREFAS ======
  const tarefasOrdenadas = useMemo(
    () =>
      [...tarefas].sort((a, b) => {
        if (a.concluida === b.concluida) return 0;
        return a.concluida ? 1 : -1;
      }),
    [tarefas]
  );

  const tarefasFiltradasPorData = useMemo(
    () =>
      dataFiltro
        ? tarefas.filter(
            (t) => t.dataLimite && t.dataLimite.slice(0, 10) === dataFiltro.slice(0, 10)
          )
        : tarefas,
    [tarefas, dataFiltro]
  );

  const tarefasAtivas = useMemo(
    () => tarefasOrdenadas.filter((t) => !t.concluida),
    [tarefasOrdenadas]
  );

  const tarefasConcluidas = useMemo(
    () => tarefasOrdenadas.filter((t) => t.concluida),
    [tarefasOrdenadas]
  );

  const tarefasVisiveis = filtroTarefas === 'ativas' ? tarefasAtivas : tarefasConcluidas;

  // ====== PROJETOS (ATIVOS x CONCLUÍDOS) ======
  const projetosComStatus = useMemo(
    () =>
      projetos.map((p) => {
        const tarefasDoProjeto = tarefas.filter((t) => t.projetoId === p.id);
        const temTarefas = tarefasDoProjeto.length > 0;
        const todasConcluidas = temTarefas && tarefasDoProjeto.every((t) => t.concluida);

        return {
          projeto: p,
          concluido: todasConcluidas,
        };
      }),
    [projetos, tarefas]
  );

  const projetosAtivos = useMemo(
    () => projetosComStatus.filter((p) => !p.concluido).map((p) => p.projeto),
    [projetosComStatus]
  );

  const projetosConcluidos = useMemo(
    () => projetosComStatus.filter((p) => p.concluido).map((p) => p.projeto),
    [projetosComStatus]
  );

  const projetosVisiveis = filtroProjetos === 'ativos' ? projetosAtivos : projetosConcluidos;

  // ====== AÇÕES ======
  const handleNovaTarefa = () => navigation.navigate('Edit', { mode: 'task' });

  const handleNovoProjeto = () => navigation.navigate('Edit', { mode: 'project' });

  const handleExportar = async () => {
    try {
      const csv = tarefasToCsv(tarefas, projetos);

      const baseDir =
        (FileSystem as any).documentDirectory ?? (FileSystem as any).cacheDirectory ?? '';

      const fileUri = baseDir + 'letsnote-tarefas.csv';

      await FileSystem.writeAsStringAsync(fileUri, csv);

      const canShare = await Sharing.isAvailableAsync();

      if (!canShare) {
        Alert.alert(
          'Exportação CSV',
          `Arquivo salvo em:\n${fileUri}\n\nSeu dispositivo não suporta o painel de compartilhamento.`
        );
        return;
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Exportar tarefas como CSV',
      });
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível exportar o CSV. Tente novamente mais tarde.');
    }
  };

  const handleImportar = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      const uri = file.uri;

      const csv = await FileSystem.readAsStringAsync(uri);

      const tarefasBase = csvToTarefas(csv);

      if (tarefasBase.length === 0) {
        Alert.alert('Importação CSV', 'Nenhuma tarefa encontrada no arquivo.');
        return;
      }

      tarefasBase.forEach((t) => {
        adicionarTarefa({
          titulo: t.titulo,
          descricao: t.descricao,
          projetoId: t.projetoId,
          prioridade: t.prioridade ?? 'media',
          dataLimite: t.dataLimite,
        });
      });

      Alert.alert('Importação CSV', `Importadas ${tarefasBase.length} tarefas do arquivo.`);
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Erro',
        'Não foi possível importar o CSV. Verifique o arquivo e tente novamente.'
      );
    }
  };

  return (
    <SafeAreaView className="min-h-screen flex-1 bg-neutral-950">
      <AppHeader title="" reverse />

      <View className="flex-1 px-4">
        {/* CALENDÁRIO DE TAREFAS */}
        <View className="flex justify-center">
          <CalendarioTarefas
            tarefas={tarefas}
            selectedDate={dataFiltro}
            onChangeSelectedDate={setDataFiltro}
          />
        </View>

        {/* PROJETOS */}
        <Text className="mb-2 text-xl font-semibold text-white">Meus Projetos:</Text>

        {/* Filtro de projetos: ATIVOS / CONCLUÍDOS */}
        <View className="mb-4">
          <View className="flex-row rounded-full bg-neutral-900 p-1">
            <Pressable
              onPress={() => setFiltroProjetos('ativos')}
              className={`flex-1 items-center rounded-full px-3 py-2 ${
                filtroProjetos === 'ativos' ? 'bg-blue-600' : ''
              }`}>
              <Text
                className={
                  filtroProjetos === 'ativos'
                    ? 'text-xs font-semibold text-white'
                    : 'text-xs text-neutral-300'
                }>
                PROJETOS ATIVOS
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setFiltroProjetos('concluidos')}
              className={`flex-1 items-center rounded-full px-3 py-2 ${
                filtroProjetos === 'concluidos' ? 'bg-blue-600' : ''
              }`}>
              <Text
                className={
                  filtroProjetos === 'concluidos'
                    ? 'text-xs font-semibold text-white'
                    : 'text-xs text-neutral-300'
                }>
                PROJETOS CONCLUÍDOS
              </Text>
            </Pressable>
          </View>
        </View>

        <ProjetoSection
          projetos={projetosVisiveis}
          tarefas={tarefas}
          onPressProjeto={(id) => navigation.navigate('ProjetoDetalhe', { id })}
        />

        {/* TAREFAS */}
        <Text className="mb-2 text-xl font-semibold text-white">Minhas Tarefas:</Text>

        {/* Filtro de tarefas: ATIVAS / CONCLUÍDAS */}
        <View className="mb-2">
          <View className="flex-row rounded-full bg-neutral-900 p-1">
            <Pressable
              onPress={() => setFiltroTarefas('ativas')}
              className={`flex-1 items-center rounded-full px-3 py-2 ${
                filtroTarefas === 'ativas' ? 'bg-blue-600' : ''
              }`}>
              <Text
                className={
                  filtroTarefas === 'ativas'
                    ? 'text-xs font-semibold text-white'
                    : 'text-xs text-neutral-300'
                }>
                TAREFAS ATIVAS
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setFiltroTarefas('concluidas')}
              className={`flex-1 items-center rounded-full px-3 py-2 ${
                filtroTarefas === 'concluidas' ? 'bg-blue-600' : ''
              }`}>
              <Text
                className={
                  filtroTarefas === 'concluidas'
                    ? 'text-xs font-semibold text-white'
                    : 'text-xs text-neutral-300'
                }>
                TAREFAS CONCLUÍDAS
              </Text>
            </Pressable>
          </View>
        </View>

        {/* TaskSection cuida da rolagem via FlatList */}
        <TaskSection
          tarefas={tarefasVisiveis}
          projetos={projetos}
          onPressTarefa={(id) => navigation.navigate('TarefaDetalhe', { id })}
          onToggleConcluida={alternarConcluida}
        />
      </View>

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
