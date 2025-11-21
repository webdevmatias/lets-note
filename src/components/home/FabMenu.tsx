import React, { useRef, useState } from "react";
import { View, Text, Pressable, Animated, Easing } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FabMenuProps = {
  onNovaTarefa: () => void;
  onNovoProjeto: () => void;
  onExportar: () => void;
  onImportar: () => void;
};

const FabMenu: React.FC<FabMenuProps> = ({
  onNovaTarefa,
  onNovoProjeto,
  onExportar,
  onImportar,
}) => {
  const insets = useSafeAreaInsets();

  const [fabOpen, setFabOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleFab = () => {
    Animated.timing(animation, {
      toValue: fabOpen ? 0 : 1,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    setFabOpen(!fabOpen);
  };

  const fade = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const slide = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const handlePressNovaTarefa = () => {
    onNovaTarefa();
    toggleFab();
  };

  const handlePressNovoProjeto = () => {
    onNovoProjeto();
    toggleFab();
  };

  const handlePressExportar = () => {
    onExportar();
    toggleFab();
  };

  const handlePressImportar = () => {
    onImportar();
    toggleFab();
  };

  return (
    <>
      {/* Overlay para bloquear fundo */}
      {fabOpen && (
        <Pressable
          onPress={toggleFab}
          className="absolute inset-0 bg-black/90"
        />
      )}

      {/* FAB + menu, ancorado com safe area para não bater na barra de gestos */}
      <View
        style={{
          position: "absolute",
          bottom: insets.bottom + 80, // margem dinâmica + 80dp
          right: 24,                  // margem lateral consistente
          alignItems: "flex-end",
        }}
      >
        {fabOpen && (
          <>
            {/* Importar CSV */}
            <Animated.View
              style={{
                opacity: fade,
                transform: [{ translateY: slide }],
                marginBottom: 12,
              }}
            >
              <Pressable
                onPress={handlePressImportar}
                className="px-4 py-2 rounded-xl bg-purple-600"
              >
                <Text className="text-white">Importar CSV</Text>
              </Pressable>
            </Animated.View>

            {/* Exportar CSV */}
            <Animated.View
              style={{
                opacity: fade,
                transform: [{ translateY: slide }],
                marginBottom: 12,
              }}
            >
              <Pressable
                onPress={handlePressExportar}
                className="px-4 py-2 rounded-xl bg-yellow-600"
              >
                <Text className="text-white">Exportar CSV</Text>
              </Pressable>
            </Animated.View>

            {/* Novo projeto */}
            <Animated.View
              style={{
                opacity: fade,
                transform: [{ translateY: slide }],
                marginBottom: 12,
              }}
            >
              <Pressable
                onPress={handlePressNovoProjeto}
                className="px-4 py-2 rounded-xl bg-green-600"
              >
                <Text className="text-white">+ Novo Projeto</Text>
              </Pressable>
            </Animated.View>

            {/* Nova tarefa */}
            <Animated.View
              style={{
                opacity: fade,
                transform: [{ translateY: slide }],
                marginBottom: 12,
              }}
            >
              <Pressable
                onPress={handlePressNovaTarefa}
                className="px-4 py-2 rounded-xl bg-blue-600"
              >
                <Text className="text-white">+ Nova Tarefa</Text>
              </Pressable>
            </Animated.View>
          </>
        )}

        {/* FAB principal */}
        <Pressable
          onPress={toggleFab}
          className="w-16 h-16 rounded-full bg-blue-600 items-center justify-center shadow-lg"
        >
          <Text className="text-white text-3xl">
            {fabOpen ? "×" : "+"}
          </Text>
        </Pressable>
      </View>
    </>
  );
};

export default FabMenu;
