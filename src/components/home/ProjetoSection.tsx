import React from "react";
import { View, Text, FlatList } from "react-native";
import { Projeto, Tarefa } from "../../types";
import ProjetoCard from "./ProjetoCard";

type ProjetoSectionProps = {
  projetos: Projeto[];
  tarefas: Tarefa[];
  onPressProjeto: (id: string) => void;
};

const ProjetoSection: React.FC<ProjetoSectionProps> = ({
  projetos,
  tarefas,
  onPressProjeto,
}) => {
  return (
    <View>
      {projetos.length === 0 ? (
        <Text className="mb-4 text-neutral-500">
          Nenhum projeto cadastrado ainda.
        </Text>
      ) : (
        <FlatList
          data={projetos}
          keyExtractor={(p) => p.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
          renderItem={({ item }) => (
            <ProjetoCard
              projeto={item}
              tarefas={tarefas}
              onPress={onPressProjeto}
            />
          )}
        />
      )}
    </View>
  );
};

export default ProjetoSection;
