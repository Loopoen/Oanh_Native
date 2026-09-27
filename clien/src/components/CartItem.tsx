import { Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { COLORS, FONT_FAMILY } from '../constants'
import { Minus, Plus } from 'lucide-react-native'
import { ItemPrice } from '../types'

type CartItemType = {
  _id: string
  name: string
  image: string
  brand: string
  prices: ItemPrice[]
  onIncrement: (_id: string, size: string) => void
  onDecrement: (_id: string, size: string) => void
}

const QtyButton = ({ onPress, children }: { onPress: () => void; children: React.ReactNode }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className="bg-[#FF7622] p-2 rounded-lg items-center justify-center"
  >
    {children}
  </TouchableOpacity>
)

const CartItem: React.FC<CartItemType> = ({
  _id,
  name,
  image,
  brand,
  prices,
  onIncrement,
  onDecrement,
}) => {
  const mainPrices = prices.filter((item) => item.quantity !== 0)
  const isMultiSize = mainPrices.length > 1

  return (
    <View>
      {isMultiSize ? (
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={[COLORS.primaryVeryWhite, COLORS.primaryVeryWhite]}
          className="rounded-3xl p-3"
        >
          <View className="flex-row gap-3 mb-2">
            <Image
              source={{ uri: image }}
              resizeMode="cover"
              className="w-[130px] h-[90px] rounded-xl"
            />
            <View className="flex-1 justify-center">
              <Text
                style={{ fontFamily: FONT_FAMILY.poppins_medium }}
                className="text-[18px] text-black"
                numberOfLines={1}
              >
                {name}
              </Text>
              <Text
                style={{ fontFamily: FONT_FAMILY.poppins_light }}
                className="text-[11px] text-gray-400 mt-1"
              >
                {brand}
              </Text>
            </View>
          </View>

          <View className="gap-3">
            {mainPrices.map((item, index) => (
              <View
                key={index}
                className="flex-row items-center justify-between bg-white/50 rounded-2xl px-3 py-2"
              >
                <View className="flex-row items-center gap-4">
                  <View className="bg-white h-10 w-[70px] rounded-lg items-center justify-center">
                    <Text
                      style={{ fontFamily: FONT_FAMILY.poppins_medium }}
                      className="text-gray-400"
                    >
                      {item.size}
                    </Text>
                  </View>
                  <Text
                    style={{ fontFamily: FONT_FAMILY.poppins_semibold }}
                    className="text-[16px] text-[#FF7622]"
                  >
                    $ <Text className="text-black">{item.price}</Text>
                  </Text>
                </View>

                <View className="flex-row items-center gap-2">
                  <QtyButton onPress={() => onDecrement(_id, item.size)}>
                    <Minus color={COLORS.primaryWhite} size={16} />
                  </QtyButton>
                  <View className="bg-white h-9 w-11 rounded-lg items-center justify-center border-2 border-[#FF7622]">
                    <Text
                      style={{ fontFamily: FONT_FAMILY.poppins_semibold }}
                      className="text-gray-600 text-[16px]"
                    >
                      {item.quantity}
                    </Text>
                  </View>
                  <QtyButton onPress={() => onIncrement(_id, item.size)}>
                    <Plus color={COLORS.primaryWhite} size={16} />
                  </QtyButton>
                </View>
              </View>
            ))}
          </View>
        </LinearGradient>
      ) : (
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={[COLORS.primaryVeryWhite, COLORS.primaryVeryWhite + '40']}
          className="flex-row items-center gap-3 p-3 rounded-3xl"
        >
          <Image
            source={{ uri: image }}
            resizeMode="cover"
            className="w-[110px] h-[110px] rounded-2xl"
          />

          <View className="flex-1 justify-between self-stretch py-1">
            <View>
              <Text
                style={{ fontFamily: FONT_FAMILY.poppins_medium }}
                className="text-[18px] text-black"
                numberOfLines={1}
              >
                {name}
              </Text>
              <Text
                style={{ fontFamily: FONT_FAMILY.poppins_light }}
                className="text-[11px] text-gray-400 mt-1"
              >
                {brand}
              </Text>
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <View className="bg-white h-10 w-[80px] rounded-lg items-center justify-center">
                <Text
                  style={{ fontFamily: FONT_FAMILY.poppins_medium }}
                  className="text-gray-400"
                >
                  {mainPrices[0].size}
                </Text>
              </View>
              <Text
                style={{ fontFamily: FONT_FAMILY.poppins_semibold }}
                className="text-[18px] text-[#FF7622]"
              >
                $ <Text className="text-black">{mainPrices[0].price}</Text>
              </Text>
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <QtyButton onPress={() => onDecrement(_id, mainPrices[0].size)}>
                <Minus color={COLORS.primaryWhite} size={16} />
              </QtyButton>
              <View className="bg-white h-9 w-[90px] rounded-lg items-center justify-center border-2 border-[#FF7622]">
                <Text
                  style={{ fontFamily: FONT_FAMILY.poppins_semibold }}
                  className="text-gray-600 text-[16px]"
                >
                  {mainPrices[0].quantity}
                </Text>
              </View>
              <QtyButton onPress={() => onIncrement(_id, mainPrices[0].size)}>
                <Plus color={COLORS.primaryWhite} size={16} />
              </QtyButton>
            </View>
          </View>
        </LinearGradient>
      )}
    </View>
  )
}

export default CartItem