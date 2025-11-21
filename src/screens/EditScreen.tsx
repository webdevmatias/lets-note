import React, { useMemo, useState, useEffect } from "react";
import { View, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useMListStore } from "../store/useMListStore";
import Button from "../components/ui/Button";
import ProjetoForm from "../components/edit/ProjetoForm";
import TarefaForm from "../components/edit/TarefaForm";
import { Tarefa } from "../types";
import AppHeader from "../components/layout/AppHeader";

type Props = NativeStackScreenProps<RootStackParamList, "Edit">;

const EditScreen: React.FC<Props> = ({ route, navigation }) => {
  const mode = route.params?.mode ?? "task";
  const id = route.params?.id;

  const projetos = useMListStore((s) => s.projetos);
  const tarefas = useMListStore((s) => s.tarefas);
  const adicionarProjeto = useMListStore((s) => s.adicionarProjeto);
  const editarProjeto = useMListStore((s) => s.editarProjeto);
  const removerProjeto = useMListStore((s) => s.removerProjeto);
  const adicionarTarefa = useMListStore((s) => s.adicionarTarefa);
  const editarTarefa = useMListStore((s) => s.editarTarefa);
  const removerTarefa = useMListStore((s) => s.removerTarefa);

  const projetoExistente = useMemo(
    () => (mode === "project" && id ? projetos.find((p) => p.id === id) : null),
    [id, mode, projetos]
  );

  const tarefaExistente = useMemo(
    () => (mode === "task" && id ? tarefas.find((t) => t.id === id) : null),
    [id, mode, tarefas]
  );

  const [nomeProjeto, setNomeProjeto] = useState("");
  const [descricaoProjeto, setDescricaoProjeto] = useState("");
  const [corProjeto, setCorProjeto] = useState("");

  const [tituloTarefa, setTituloTarefa] = useState("");
  const [descricaoTarefa, setDescricaoTarefa] = useState("");
  const [projetoId, setProjetoId] = useState<string | undefined>(undefined);
  const [prioridade, setPrioridade] = useState<Tarefa["prioridade"]>("media");
  const [dataLimite, setDataLimite] = useState("");

  useEffect(() => {
    if (projetoExistente) {
      setNomeProjeto(projetoExistente.nome);
      setDescricaoProjeto(projetoExistente.descricao ?? "");
      setCorProjeto(projetoExistente.cor ?? "");
    }

    if (tarefaExistente) {
      setTituloTarefa(tarefaExistente.titulo);
      setDescricaoTarefa(tarefaExistente.descricao ?? "");
      setProjetoId(tarefaExistente.projetoId);
      setPrioridade(tarefaExistente.prioridade ?? "media");
      setDataLimite(tarefaExistente.dataLimite ?? "");
    }
  }, [projetoExistente, tarefaExistente]);

  const isEdit = Boolean(id);

  const handleSalvarProjeto = () => {
    if (!nomeProjeto.trim()) {
      Alert.alert("Atenção", "O nome do projeto é obrigatório.");
      return;
    }

    if (isEdit && projetoExistente) {
      editarProjeto(projetoExistente.id, {
        nome: nomeProjeto.trim(),
        descricao: descricaoProjeto.trim() || undefined,
        cor: corProjeto.trim() || undefined,
      });
    } else {
      adicionarProjeto({
        nome: nomeProjeto.trim(),
        descricao: descricaoProjeto.trim() || undefined,
        cor: corProjeto.trim() || undefined,
      });
    }

    navigation.goBack();
  };

  const handleSalvarTarefa = () => {
    if (!tituloTarefa.trim()) {
      Alert.alert("Atenção", "O título da tarefa é obrigatório.");
      return;
    }

    const payloadBase = {
      titulo: tituloTarefa.trim(),
      descricao: descricaoTarefa.trim() || undefined,
      projetoId: projetoId || undefined,
      prioridade,
      dataLimite: dataLimite.trim() || undefined,
    };

    if (isEdit && tarefaExistente) {
      editarTarefa(tarefaExistente.id, payloadBase);
    } else {
      adicionarTarefa(payloadBase);
    }

    navigation.goBack();
  };

  const handleExcluir = () => {
    if (mode === "project" && projetoExistente) {
      Alert.alert(
        "Excluir projeto",
        "Isso também vai remover as tarefas vinculadas. Deseja continuar?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress: () => {
              removerProjeto(projetoExistente.id);
              navigation.goBack();
            },
          },
        ]
      );
    }

    if (mode === "task" && tarefaExistente) {
      Alert.alert("Excluir tarefa", "Deseja excluir esta tarefa?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            removerTarefa(tarefaExistente.id);
            navigation.goBack();
          },
        },
      ]);
    }
  };

  const tituloPagina =
    mode === "project"
      ? isEdit
        ? "Editar projeto"
        : "Novo projeto"
      : isEdit
      ? "Editar tarefa"
      : "Nova tarefa";

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <AppHeader title={tituloPagina} showBack />

      <ScrollView className="flex-1 px-4 pt-8">
        {mode === "project" ? (
          <ProjetoForm
            nome={nomeProjeto}
            descricao={descricaoProjeto}
            cor={corProjeto}
            onChangeNome={setNomeProjeto}
            onChangeDescricao={setDescricaoProjeto}
            onChangeCor={setCorProjeto}
            onSalvar={handleSalvarProjeto}
          />
        ) : (
          <TarefaForm
            titulo={tituloTarefa}
            descricao={descricaoTarefa}
            projetoId={projetoId}
            prioridade={prioridade}
            dataLimite={dataLimite}
            projetos={projetos}
            onChangeTitulo={setTituloTarefa}
            onChangeDescricao={setDescricaoTarefa}
            onChangeProjetoId={setProjetoId}
            onChangePrioridade={setPrioridade}
            onChangeDataLimite={setDataLimite}
            onSalvar={handleSalvarTarefa}
          />
        )}

        {isEdit && (
          <Button
            label={mode === "project" ? "Excluir projeto" : "Excluir tarefa"}
            variant="secondary"
            onPress={handleExcluir}
          />
        )}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditScreen;
