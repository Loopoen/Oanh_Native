import React, { useEffect } from 'react'
import { ImageBackground, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Plus, Star } from 'lucide-react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { cssInterop } from 'nativewind'
import { COLORS } from '../constants'
import { ProductCardType } from '../types'

cssInterop(LinearGradient, { className: 'style' })

type ProductCardProps = ProductCardType & {
  inCart?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  name,
  brand,
  average_rate,
  price,
  onPress,
  inCart = false,
}) => {
  const { width } = useWindowDimensions()
  const imageSize = width * 0.32

  const opacity = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  useEffect(() => {
    opacity.value = withSpring(inCart ? 0.5 : 1)
  }, [inCart, opacity])

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={[COLORS.primaryVeryWhite, COLORS.primaryVeryWhite + '40']}
      className="min-h-[300px] w-full items-center rounded-[25px] py-4"
    >
      <ImageBackground
        source={{ uri: image }}
        resizeMode="cover"
        style={{ width: imageSize, height: imageSize }}
        className="mb-4 overflow-hidden rounded-[20px]"
      >
        <View className="absolute right-0 top-0 flex-row items-center justify-center gap-2 rounded-bl-[20px] rounded-tr-[20px] bg-primary-black/50 px-4">
          <Star color={COLORS.primaryOrange} size={16} />
          <Text className="font-poppins-medium text-sm leading-[22px] text-primary-white">
            {Number(average_rate).toFixed(1)}
          </Text>
        </View>
      </ImageBackground>

      <View className="w-full px-[18px]">
        <Text
          numberOfLines={1}
          className="font-poppins-medium text-base text-primary-black"
        >
          {name}
        </Text>

        <Text className="font-poppins-light text-[10px] text-secondary-light-grey">
          {brand}
        </Text>

        <View className="flex-row items-center justify-between pb-[22px] pt-4">
          <Text className="font-poppins-semibold text-lg text-primary-orange">
            $ <Text className="text-primary-black">{Number(price).toFixed(2)}</Text>
          </Text>

          <Animated.View style={animatedStyle}>
            <TouchableOpacity
              disabled={inCart}
              onPress={onPress}
              activeOpacity={0.8}
              className="rounded-lg bg-primary-orange p-[7px]"
            >
              <Plus color={COLORS.primaryWhite} size={16} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </LinearGradient>
  )
}

export default ProductCard