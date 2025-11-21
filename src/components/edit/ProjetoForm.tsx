import React from "react";
import { View, Text, Pressable } from "react-native";
import Input from "../ui/Input";
import Button from "../ui/Button";

type ProjetoFormProps = {
  nome: string;
  descricao: string;
  cor: string; // vamos usar "" como "sem cor"
  onChangeNome: (texto: string) => void;
  onChangeDescricao: (texto: string) => void;
  onChangeCor: (texto: string) => void;
  onSalvar: () => void;
};

// 4 tons pastéis
const CORES_PASTEL = [
  "#F7DAD9", // rosa pastel
  "#FFF2B2", // amarelo pastel
  "#D7F3E3", // verde pastel
  "#DCE6F8", // azul pastel
];

const ProjetoForm: React.FC<ProjetoFormProps> = ({
  nome,
  descricao,
  cor,
  onChangeNome,
  onChangeDescricao,
  onChangeCor,
  onSalvar,
}) => {
  const handleSelectCor = (hex: string) => {
    if (cor === hex) {
      // se clicar de novo na mesma, limpa
      onChangeCor("");
    } else {
      onChangeCor(hex);
    }
  };

  return (
    <View className="gap-4">
      <Input
        label="Nome do projeto:"
        placeholder="Ex: LetsNote pessoal"
        value={nome}
        onChangeText={onChangeNome}
      />

      <Input
        label="Descrição:"
        placeholder="Breve resumo do projeto"
        value={descricao}
        onChangeText={onChangeDescricao}
        multiline
      />

      {/* Seletor de cor (4 tons pastéis) */}
      <View>
        <Text className="text-neutral-200 mb-2 font-medium">
          Cor do projeto (opcional)
        </Text>

        <View className="flex-row items-center gap-3">
          {CORES_PASTEL.map((hex) => {
            const selecionada = cor === hex;

            return (
              <Pressable
                key={hex}
                onPress={() => handleSelectCor(hex)}
                className={`w-9 h-9 rounded-full items-center justify-center ${
                  selecionada ? "border-2 border-blue-500" : "border border-neutral-600"
                }`}
                style={{ backgroundColor: hex }}
              >
                {selecionada && (
                  <Text className="text-xs text-neutral-900 font-bold">✓</Text>
                )}
              </Pressable>
            );
          })}

          <Pressable
            onPress={() => onChangeCor("")}
            className={`px-3 py-1 rounded-full border ${
              !cor ? "border-blue-400" : "border-neutral-600"
            }`}
          >
            <Text
              className={!cor ? "text-blue-300 text-xs" : "text-neutral-300 text-xs"}
            >
              Sem cor
            </Text>
          </Pressable>
        </View>
      </View>

      <Button label="Salvar projeto" onPress={onSalvar} />
    </View>
  );
};

export default ProjetoForm;
