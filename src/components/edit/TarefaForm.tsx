import React, { useState } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import Input from "../ui/Input";
import Button from "../ui/Button";
import { Projeto, Tarefa } from "../../types";

type TarefaFormProps = {
  titulo: string;
  descricao: string;
  projetoId?: string;
  prioridade: Tarefa["prioridade"];
  dataLimite: string;
  projetos: Projeto[];

  onChangeTitulo: (texto: string) => void;
  onChangeDescricao: (texto: string) => void;
  onChangeProjetoId: (id?: string) => void;
  onChangePrioridade: (p: Tarefa["prioridade"]) => void;
  onChangeDataLimite: (texto: string) => void;

  onSalvar: () => void;
};

// chaves das prioridades
type PrioridadeKey = "baixa" | "media" | "alta";

const prioridades: PrioridadeKey[] = ["baixa", "media", "alta"];

// === CORES DAS PRIORIDADES (pastel) ===
const prioridadeStyles: Record<
  PrioridadeKey,
  { bg: string; border: string; text: string }
> = {
  baixa: {
    bg: "bg-[#86EFAC]", // verde pastel
    border: "border-[#86EFAC]",
    text: "text-[#166534]",
  },
  media: {
    bg: "bg-[#FDE68A]", // amarelo pastel
    border: "border-[#FDE68A]",
    text: "text-[#92400E]",
  },
  alta: {
    bg: "bg-[#FCA5A5]", // vermelho pastel
    border: "border-[#FCA5A5]",
    text: "text-[#991B1B]",
  },
};

// helper para exibir em DD/MM/AAAA
const formatDateForDisplay = (value: string | undefined) => {
  if (!value) return "";
  // esperado: YYYY-MM-DD
  const parts = value.split("-");
  if (parts.length !== 3) return value; // fallback se vier em outro formato

  const [yyyy, mm, dd] = parts;
  if (!yyyy || !mm || !dd) return value;

  return `${dd.padStart(2, "0")}/${mm.padStart(2, "0")}/${yyyy}`;
};

const TarefaForm: React.FC<TarefaFormProps> = ({
  titulo,
  descricao,
  projetoId,
  prioridade,
  dataLimite,
  projetos,
  onChangeTitulo,
  onChangeDescricao,
  onChangeProjetoId,
  onChangePrioridade,
  onChangeDataLimite,
  onSalvar,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }

    const current = selectedDate || new Date();
    setShowDatePicker(false);

    // salva sempre no formato YYYY-MM-DD
    const formatted = current.toISOString().split("T")[0];
    onChangeDataLimite(formatted);
  };

  const initialDate =
    dataLimite && !Number.isNaN(Date.parse(dataLimite))
      ? new Date(dataLimite)
      : new Date();

  const displayDate = formatDateForDisplay(dataLimite);

  return (
    <View>
      {/* Título */}
      <Input
        label="Título da tarefa:"
        placeholder="Ex: Escrever relatório"
        value={titulo}
        onChangeText={onChangeTitulo}
      />

      {/* Descrição */}
      <Input
        label="Descrição:"
        placeholder="Detalhes da tarefa (opcional)"
        value={descricao}
        onChangeText={onChangeDescricao}
        multiline
      />

      {/* Projeto vinculado */}
      <Text className="text-neutral-200 mb-1 font-medium">
        Projeto (opcional):
      </Text>

      <View className="flex-row flex-wrap gap-2 mb-3">
        <Pressable
          onPress={() => onChangeProjetoId(undefined)}
          className={`px-3 py-2 rounded-full border ${
            !projetoId
              ? "bg-blue-600 border-blue-500"
              : "border-neutral-600"
          }`}
        >
          <Text
            className={
              !projetoId
                ? "text-white text-xs"
                : "text-neutral-200 text-xs"
            }
          >
            Sem projeto
          </Text>
        </Pressable>

        {projetos.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => onChangeProjetoId(p.id)}
            className={`px-3 py-2 rounded-full border ${
              projetoId === p.id
                ? "bg-blue-600 border-blue-500"
                : "border-neutral-600"
            }`}
          >
            <Text
              className={
                projetoId === p.id
                  ? "text-white text-xs"
                  : "text-neutral-200 text-xs"
              }
            >
              {p.nome}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Prioridade */}
      <Text className="text-neutral-200 mb-1 font-medium">
        Prioridade:
      </Text>

      <View className="flex-row gap-2 mb-3">
        {prioridades.map((p) => {
          const selected = prioridade === p;
          const style = prioridadeStyles[p];

          return (
            <Pressable
              key={p}
              onPress={() => onChangePrioridade(p)}
              className={`px-3 py-2 rounded-full border ${
                selected ? `${style.bg} ${style.border}` : "border-neutral-600"
              }`}
            >
              <Text
                className={
                  selected
                    ? `${style.text} text-xs font-semibold`
                    : "text-neutral-200 text-xs"
                }
              >
                {p === "baixa" ? "Baixa" : p === "media" ? "Média" : "Alta"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Data limite com DatePicker */}
      <Text className="text-neutral-200 mb-1 font-medium">
        Data limite (opcional):
      </Text>

      <Pressable
        onPress={() => setShowDatePicker(true)}
        className="flex-row items-center justify-between px-3 py-2 mb-3 rounded-lg border border-neutral-700 bg-neutral-900"
      >
        <Text
          className={
            dataLimite
              ? "text-white text-xs"
              : "text-neutral-500 text-sm"
          }
        >
          {dataLimite ? displayDate : "Selecionar data"}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#ccc" />
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={initialDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}

      {/* Botão salvar */}
      <Button label="Salvar tarefa" onPress={onSalvar} />
    </View>
  );
};

export default TarefaForm;
