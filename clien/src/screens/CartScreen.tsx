import { ScrollView, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MotiView } from 'moti'
import CartItem from '../components/CartItem'
import { ItemPrice } from '../types'

type CartListItem = {
  _id?: string
  brand: string
  name: string
  images: string[]
  prices: ItemPrice[]
}

type CartScreenProps = {
  CartList: CartListItem[]
  onIncrement: (_id: string, size: string) => void
  onDecrement: (_id: string, size: string) => void
}

const CartScreen: React.FC<CartScreenProps> = ({ CartList, onIncrement, onDecrement }) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
      >
        <View className="flex-1 px-5 pt-4">
          <View className="gap-5">
            {CartList.map((item, index) => (
              <MotiView
                key={item._id ?? index}
                from={{ opacity: 0, translateY: 15 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 300, delay: index * 60 }}
                className="bg-white rounded-2xl shadow-sm shadow-black/10 border border-gray-100"
              >
                <CartItem
                  brand={item.brand}
                  _id={item._id ?? ''}
                  prices={item.prices}
                  name={item.name}
                  image={item.images[0]}
                  onIncrement={onIncrement}
                  onDecrement={onDecrement}
                />
              </MotiView>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CartScreen