import { AntDesign } from "@expo/vector-icons"
import { Pressable, Text, TextInput, View } from "react-native"
import { GoBack } from "./GoBackButton"

interface HeaderProps {
    goToPrevious?: () => void
    search?: () => void
    cartLength?: number
    goToCard?: () => void
}

export const Header = ({ goToPrevious, search, cartLength, goToCard }: HeaderProps) => {
    return (
        <View className="bg-white px-4 py-2.5 border-b border-gray-100">
            <View className="flex-row items-center gap-2.5">
                <GoBack onPress={goToPrevious} />

                <View className="flex-1 flex-row items-center gap-2 bg-gray-100 rounded-xl px-3 h-[42px]">
                    <AntDesign name="search" size={18} color="#8a8a8a" />
                    <TextInput
                        placeholder="Tìm kiếm sản phẩm..."
                        placeholderTextColor="#a0a0a0"
                        className="flex-1 text-[15px] text-gray-900 p-0"
                    />
                    <AntDesign name="close" size={16} color="#c0c0c0" />
                </View>

                <Pressable onPress={goToCard} className="p-1.5 relative">
                    <AntDesign name="shopping" size={22} color="#1a1a1a" />
                    <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] px-[3px] items-center justify-center">
                        <Text className="text-white text-[10px] font-bold">{cartLength}</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    )
}