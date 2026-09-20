import React from 'react'
import { Pressable, useWindowDimensions } from 'react-native'
import * as LucideIcons from 'lucide-react-native'
import type { LucideIcon } from 'lucide-react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MotiView } from 'moti'
import Animated, {
    LinearTransition,
    FadeInRight,
    FadeOutRight,
} from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import { cssInterop } from 'nativewind'

cssInterop(MotiView, { className: 'style' })

type IconName = Exclude<
    keyof typeof LucideIcons,
    'icons' | 'createLucideIcon' | 'Icon'
>

type IconProps = {
    name: IconName
    color: string
    size?: number
}

function Icon({ name, color, size = 20 }: IconProps) {
    const IconComponent = LucideIcons[name] as LucideIcon
    return <IconComponent color={color} size={size} />
}

type DataItem = {
    label: string
    route: string
    name: IconName
}

type CustomTabBarProps = BottomTabBarProps & {
    data: DataItem[]
    onChange?: (index: number) => void
}

const ICON_ACTIVE = '#FFFFFF'
const ICON_INACTIVE = '#1A1A1A'

const SPRING = {
    damping: 80,
    stiffness: 200,
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({
    data,
    onChange,
    state,
}) => {
    const { bottom } = useSafeAreaInsets()
    const { width } = useWindowDimensions()
    const navigation = useNavigation<any>()

    return (
        <MotiView
            from={{ marginBottom: 0, opacity: 0 }}
            animate={{ marginBottom: bottom, opacity: 1 }}
            transition={{
                type: 'spring',
                damping: 80,
                stiffness: 500,
            }}
            style={{ marginHorizontal: width * 0.06 }}
            className="flex-row items-center justify-around rounded-full bg-primary-white py-3 shadow-lg shadow-black/20 elevation-8"
        >
            {data.map((item, index) => {
                const isSelected = state.index === index

                return (
                    <MotiView
                        key={item.route}
                        layout={LinearTransition.springify()
                            .damping(SPRING.damping)
                            .stiffness(SPRING.stiffness)}
                        className="overflow-hidden"
                    >
                        <Pressable
                            onPress={() => {
                                onChange?.(index)
                                navigation.navigate('MainTabs', {
                                    screen: item.route,
                                })
                            }}
                            className={`flex-row items-center justify-center gap-1 rounded-full px-5 py-3 active:opacity-80 ${
                                isSelected
                                    ? 'bg-primary-orange'
                                    : 'bg-primary-white'
                            }`}
                        >
                            <Icon
                                name={item.name}
                                color={
                                    isSelected
                                        ? ICON_ACTIVE
                                        : ICON_INACTIVE
                                }
                            />

                            {isSelected && (
                                <Animated.Text
                                    className="text-[15px] font-medium text-primary-white"
                                    entering={FadeInRight.springify()
                                        .damping(SPRING.damping)
                                        .stiffness(SPRING.stiffness)}
                                    exiting={FadeOutRight.springify()
                                        .damping(SPRING.damping)
                                        .stiffness(SPRING.stiffness)}
                                >
                                    {item.label}
                                </Animated.Text>
                            )}
                        </Pressable>
                    </MotiView>
                )
            })}
        </MotiView>
    )
}

export default CustomTabBar