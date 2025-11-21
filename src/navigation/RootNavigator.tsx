import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import EditScreen from "../screens/EditScreen";
import ProjetoDetalheScreen from "../screens/ProjetoDetalheScreen";
import TarefaDetalheScreen from "../screens/TarefaDetalheScreen";

export type RootStackParamList = {
  Home: undefined;
  Edit: { mode: "task" | "project"; id?: string } | undefined;
  ProjetoDetalhe: { id: string };
  TarefaDetalhe: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // usamos AppHeader custom
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Edit" component={EditScreen} />
        <Stack.Screen name="ProjetoDetalhe" component={ProjetoDetalheScreen} />
        <Stack.Screen name="TarefaDetalhe" component={TarefaDetalheScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
