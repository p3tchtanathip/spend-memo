import * as MuiIcons from "@mui/icons-material";

type IconName = keyof typeof MuiIcons;

interface DynamicIconProps {
  name: IconName;
  size?: "small" | "medium" | "large";
  color?: string;
}
export default function DynamicIcon({ name, size = "medium", color }: DynamicIconProps) {
  const IconComponent = MuiIcons[name];
  if (!IconComponent) return null;
  return <IconComponent fontSize={size} sx={{ color }} />;
};
