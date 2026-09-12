import { Pressable, Text, View } from "react-native";
import * as LucideIcons from "lucide-react-native";
import { LucideIcon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiView } from "moti";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

type IconName = keyof typeof LucideIcons;

const TAB_ICONS: Record<string, IconName> = {
  Home: "House",
  Cart: "ShoppingCart",
  Profile: "User",
};

function AppIcon({
  name,
  color,
  size = 22,
}: {
  name: IconName;
  color: string;
  size?: number;
}) {
  const IconComponent = LucideIcons[name] as LucideIcon;
  if (!IconComponent) return null;
  return <IconComponent color={color} size={size} strokeWidth={2.2} />;
}

function TabButton({
  routeName,
  label,
  focused,
  onPress,
}: {
  routeName: string;
  label: string;
  focused: boolean;
  onPress: () => void;
}) {
  const iconName = TAB_ICONS[routeName] ?? "Circle";
  const activeColor = "#111827";
  const inactiveColor = "#9CA3AF";

  return (
    <Pressable onPress={onPress} className="flex-1 items-center justify-center">
      <MotiView
        animate={{ scale: focused ? 1 : 1 }}
        transition={{ type: "spring", damping: 14, stiffness: 220 }}
        className={`flex-row items-center justify-center rounded-full px-3.5 py-2 ${
          focused ? "bg-gray-100" : ""
        }`}
      >
        <MotiView
          from={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: focused ? 1.05 : 1, opacity: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200 }}
        >
          <AppIcon name={iconName} color={focused ? activeColor : inactiveColor} />
        </MotiView>

        {focused && (
          <MotiView
            from={{ opacity: 0, translateX: -6 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: "timing", duration: 180 }}
          >
            <Text className="ml-1.5 text-[13px] font-semibold text-gray-900">
              {label}
            </Text>
          </MotiView>
        )}
      </MotiView>
    </Pressable>
  );
}

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 items-center bg-transparent"
      style={{ paddingBottom: bottom || 16 }}
    >
      <View
        className="flex-row gap-1 rounded-[32px] bg-white px-3 py-2.5 mx-5"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 10,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? String(options.tabBarLabel)
              : options.title !== undefined
              ? options.title
              : route.name;

          const focused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabButton
              key={route.key}
              routeName={route.name}
              label={label}
              focused={focused}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;