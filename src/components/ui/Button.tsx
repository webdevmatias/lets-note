import React from "react";
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from "react-native";

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "danger" | "outline";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  fullWidth = true,
}) => {
  const base = "flex-row items-center justify-center rounded-xl px-4 py-3 mb-2";

  const variants = {
    primary: "bg-blue-600",
    secondary: "bg-neutral-800",
    danger: "bg-red-600",
    outline: "bg-transparent border border-neutral-700",
  } as const;

  const textVariants = {
    primary: "text-white",
    secondary: "text-white",
    danger: "text-white",
    outline: "text-neutral-200",
  } as const;

  const width = fullWidth ? "w-full" : "w-auto";

  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled}
      onPress={!isDisabled ? onPress : undefined}
      className={`${base} ${variants[variant]} ${width} ${
        isDisabled ? "opacity-50" : ""
      }`}
    >
      {loading && (
        <View className="mr-2">
          <ActivityIndicator size="small" color="#fff" />
        </View>
      )}

      <Text className={`font-semibold ${textVariants[variant]}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
