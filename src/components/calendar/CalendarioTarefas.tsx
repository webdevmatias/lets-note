import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import { Tarefa } from "../../types";

type CalendarioTarefasProps = {
  tarefas: Tarefa[];
  /** Data selecionada no formato "YYYY-MM-DD" */
  selectedDate?: string;
  /** Callback disparado ao trocar o dia selecionado */
  onChangeSelectedDate?: (date: string) => void;
};

const hojeISO = () => new Date().toISOString().slice(0, 10);

/**
 * Garante que a string de data esteja no formato "YYYY-MM-DD"
 * mesmo que venha um ISO completo (com horas).
 */
const normalizarData = (data?: string | null) => {
  if (!data) return undefined;
  // "2025-11-21T03:00:00.000Z" -> "2025-11-21"
  return data.slice(0, 10);
};

const CalendarioTarefas: React.FC<CalendarioTarefasProps> = ({
  tarefas,
  selectedDate,
  onChangeSelectedDate,
}) => {
  const dataSelecionada = selectedDate || hojeISO();

  /**
   * Monta o objeto de datas marcadas a partir das tarefas que têm dataLimite.
   * Cada dia com pelo menos 1 tarefa ganha um pontinho pastel.
   */
  const markedDates = useMemo(() => {
    const marcados: { [date: string]: any } = {};

    tarefas.forEach((tarefa) => {
      const d = normalizarData(tarefa.dataLimite);
      if (!d) return;

      if (!marcados[d]) {
        marcados[d] = {
          marked: true,
          dots: [
            {
              key: "tarefa",
              color: "#A5B4FC", // lilás pastel
            },
          ],
        };
      }
    });

    // Destaca a data selecionada
    if (dataSelecionada) {
      marcados[dataSelecionada] = {
        ...(marcados[dataSelecionada] || {}),
        selected: true,
        selectedColor: "#38BDF8", // azul claro
        selectedTextColor: "#0B1120",
      };
    }

    return marcados;
  }, [tarefas, dataSelecionada]);

  const handleDayPress = (day: any) => {
    // day.dateString vem no formato "YYYY-MM-DD"
    onChangeSelectedDate?.(day.dateString);
  };

  return (
    <View className="rounded-2xl p-3">
      <Calendar
        // Data inicial/selecionada
        current={dataSelecionada}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        markingType="multi-dot"
        // Estilização geral
        theme={{
          backgroundColor: "#0a0a0a",
          calendarBackground: "#0a0a0a",
          textSectionTitleColor: "#9CA3AF", // título dias semana
          monthTextColor: "#F9FAFB",
          dayTextColor: "#E5E7EB",
          todayTextColor: "#38BDF8",
          selectedDayBackgroundColor: "#38BDF8",
          selectedDayTextColor: "#0B1120",
          arrowColor: "#F9FAFB",
          disabledArrowColor: "#4B5563",
          textDisabledColor: "#4B5563",
        }}
        // Deixa a borda mais compacta
        style={{
          borderRadius: 16,
        transform: [{ scale: 0.9 }],
        }}
      />
{/* 
      <View className="mt-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-full bg-[#A5B4FC]" />
          <Text className="text-xs text-neutral-400">Dia com tarefas</Text>
        </View>

        <View className="flex-row items-center gap-2">
          <View className="h-3 w-3 rounded-full bg-[#38BDF8]" />
          <Text className="text-xs text-neutral-400">Dia selecionado</Text>
        </View>
      </View> */}
    </View>
  );
};

export default CalendarioTarefas;
