import "./global.css";

import React from "react";
// import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <>
      {/* <StatusBar style="auto" /> */}

      <SafeAreaView className="flex-1">
        <RootNavigator />
      </SafeAreaView>
    </>
  );
}
