import React from "react";
import { Text, View } from "react-native";

type Props = {
  label: string;
  variant?: "neutral" | "primary" | "success" | "danger" | "warning";
  size?: "sm" | "md";
  icon?: React.ReactNode;
};

const Tag: React.FC<Props> = ({
  label,
  variant = "neutral",
  size = "sm",
  icon,
}) => {
  const variants = {
    neutral: "bg-neutral-800 text-neutral-200",
    primary: "bg-blue-600 text-white",
    success: "bg-green-600 text-white",
    danger: "bg-red-600 text-white",
    warning: "bg-yellow-500 text-black",
  } as const;

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  } as const;

  const [bg, text] = variants[variant].split(" ");

  return (
    <View
      className={`flex-row items-center rounded-full ${sizes[size]} ${bg}`}
    >
      {icon && <View className="mr-1">{icon}</View>}

      <Text className={`${text} font-medium`}>{label}</Text>
    </View>
  );
};

export default Tag;
