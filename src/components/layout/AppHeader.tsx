import React from "react";
import { View, Text, Pressable, StatusBar, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { Ionicons } from "@expo/vector-icons";

type Nav = NativeStackNavigationProp<RootStackParamList>;

type AppHeaderProps = {
  title: string;
  showBack?: boolean;
  reverse?: boolean; // 👈
};

const AppHeader: React.FC<AppHeaderProps> = ({ title, showBack = false, reverse = false }) => {
  const navigation = useNavigation<Nav>();

  const handleBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <View>
      <StatusBar
        translucent={false}
        backgroundColor="#111827"
        barStyle="light-content"
      />


      <View
        className={`px-4 bg-gray-900 flex-row items-center justify-between ${
          reverse ? "flex-row-reverse" : ""
        }`}
      >
        {/* Lado esquerdo (ou direito se reverse) */}
        <View className="flex-row items-center">
          {showBack && (
            <Pressable
              onPress={handleBack}
              className="mr-3 pr-2"
              hitSlop={8}
            >
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </Pressable>
          )}

          <Text className="text-white text-xl font-bold" numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Lado direito (ou esquerdo se reverse) */}
        <Image
          source={require("../../../assets/letsnote-logo.png")}
          style={{
            width: 80,
            height: 80,
            resizeMode: "contain",
            opacity: 0.9,
          }}
        />
      </View>
    </View>
  );
};

export default AppHeader;
