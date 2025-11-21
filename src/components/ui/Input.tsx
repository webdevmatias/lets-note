import React from "react";
import { TextInput, Text, View, TextInputProps } from "react-native";

type Props = TextInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
};

const Input: React.FC<Props> = ({
  label,
  error,
  helperText,
  disabled = false,
  ...rest
}) => {
  return (
    <View className="mb-4 w-full">
      {/* Label */}
      {label && (
        <Text className="text-neutral-300 mb-1 font-medium">
          {label}
        </Text>
      )}

      {/* Input */}
      <TextInput
        className={`
          w-full px-3 py-3 rounded-xl text-white bg-neutral-900 border
          ${error ? "border-red-500" : "border-neutral-700"}
          ${disabled ? "opacity-50" : "opacity-100"}
        `}
        placeholderTextColor="#9CA3AF"
        editable={!disabled}
        {...rest}
      />

      {/* Error message */}
      {error && (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      )}

      {/* Helper text (só aparece se não tiver erro) */}
      {!error && helperText && (
        <Text className="text-neutral-400 text-xs mt-1">
          {helperText}
        </Text>
      )}
    </View>
  );
};

export default Input;
