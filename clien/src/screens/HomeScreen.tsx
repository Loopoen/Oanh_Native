import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MotiView } from 'moti'
import { Search, SearchX, X } from 'lucide-react-native'
import { cssInterop } from 'nativewind'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { categories, Category, COLORS, homeTitle, ProductDataSample } from '../constants'
import ProductCard from '../components/ProductCard'
import { RootStackParamList } from '../types'

cssInterop(MotiView, { className: 'style' })
cssInterop(SafeAreaView, { className: 'style' })

type HomeScreenPropType = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>

const HomeScreen = () => {
  const titleWords = useMemo(() => homeTitle.split(' ').filter(word => word !== '"'), [])
  const products = ProductDataSample
  const navigation = useNavigation<HomeScreenPropType>()

  const [addedIds, setAddedIds] = useState<string[]>([])
  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<{
    index: number
    category: Category
  }>({
    index: 0,
    category: categories[0],
  })

  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setStep(1), 200)
    return () => clearTimeout(timer)
  }, [])

  const filteredProducts = useMemo(() => {
    const keyword = searchText.trim().toLowerCase()

    return products
      .filter(item =>
        selectedCategory.category === 'All'
          ? true
          : item.category === selectedCategory.category,
      )
      .filter(item => item.name.toLowerCase().includes(keyword))
  }, [products, selectedCategory.category, searchText])

  const handleAddItemToTheCart = (id: string) => {
    setAddedIds(prev => (prev.includes(id) ? prev : [...prev, id]))
  }

  const hasSearchText = searchText.length > 0

  const sectionTitle =
    selectedCategory.category === 'All' ? 'All products' : selectedCategory.category

  return (
    <SafeAreaView className="flex-1 bg-primary-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        className="flex-1"
      >
        <View className="flex-row flex-wrap gap-x-2 px-6 pt-4">
          {titleWords.map((text, index) => (
            <MotiView
              key={`${text}-${index}`}
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              onDidAnimate={(key, finished) => {
                if (key === 'opacity' && finished && step === 1) {
                  setStep(2)
                }
              }}
              transition={{ type: 'spring', delay: index * 250 }}
            >
              <Text className="font-poppins-semibold text-[32px] leading-[40px] tracking-tight text-primary-black">
                {text}
              </Text>
            </MotiView>
          ))}
        </View>

        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: step >= 2 ? 1 : 0,
            scale: step >= 2 ? 1 : 0.9,
          }}
          onDidAnimate={(key, finished) => {
            if (key === 'opacity' && finished && step === 2) {
              setStep(3)
            }
          }}
          transition={{
            type: 'spring',
            damping: 20,
            stiffness: 60,
            delay: 300,
          }}
          className="mx-6 mb-5 mt-6 h-14 flex-row items-center rounded-full border border-black/5 bg-primary-very-white pl-5 pr-2 shadow-sm shadow-black/10 elevation-2"
        >
          <Search
            size={20}
            color={hasSearchText ? COLORS.primaryOrange : COLORS.primaryLightGrey}
          />

          <TextInput
            placeholder="Search clothes, brands..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={COLORS.secondaryLightGrey}
            returnKeyType="search"
            className="h-full flex-1 px-3 font-poppins-medium text-[15px] text-primary-black"
          />

          {hasSearchText && (
            <TouchableOpacity
              onPress={() => setSearchText('')}
              hitSlop={10}
              className="h-10 w-10 items-center justify-center rounded-full bg-primary-white"
            >
              <X size={16} color={COLORS.primaryLightGrey} />
            </TouchableOpacity>
          )}
        </MotiView>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-6 gap-2"
          data={categories}
          keyExtractor={item => item}
          renderItem={({ index, item }) => {
            const isActive = selectedCategory.index === index

            return (
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{
                  opacity: step >= 3 ? 1 : 0,
                  translateY: step >= 3 ? 0 : 10,
                }}
                onDidAnimate={(key, finished) => {
                  if (key === 'opacity' && finished && step === 3) {
                    setStep(4)
                  }
                }}
                transition={{
                  type: 'spring',
                  damping: 12,
                  stiffness: 150,
                  delay: index * 120,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    setSelectedCategory({
                      index,
                      category: categories[index],
                    })
                  }
                  className={`rounded-full border px-5 py-2.5 ${
                    isActive
                      ? 'border-primary-black bg-primary-black'
                      : 'border-black/5 bg-primary-very-white'
                  }`}
                >
                  <Text
                    className={`font-poppins-medium text-sm ${
                      isActive
                        ? 'text-primary-very-white'
                        : 'text-primary-light-grey'
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              </MotiView>
            )
          }}
        />

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: step >= 4 ? 1 : 0 }}
          className="flex-row items-baseline justify-between px-6 pb-4 pt-7"
        >
          <Text className="font-poppins-semibold text-xl text-primary-black">
            {sectionTitle}
          </Text>

          <Text className="font-poppins-medium text-sm text-primary-light-grey">
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'item' : 'items'}
          </Text>
        </MotiView>

        <FlatList
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          data={filteredProducts}
          numColumns={2}
          keyExtractor={item => item._id}
          contentContainerClassName="px-6 pb-[180px]"
          columnWrapperClassName="mb-4 justify-between"
          ListEmptyComponent={
            <MotiView
              from={{ opacity: 0, translateY: 15 }}
              animate={{
                opacity: step >= 4 ? 1 : 0,
                translateY: step >= 4 ? 0 : 15,
              }}
              className="w-full items-center justify-center px-8 py-16"
            >
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary-very-white">
                <SearchX size={28} color={COLORS.primaryLightGrey} />
              </View>

              <Text className="font-poppins-semibold text-base text-primary-black">
                khong co
              </Text>

              <Text className="mt-1 text-center font-poppins-regular text-sm text-primary-light-grey">
                tim cai khac di
              </Text>
            </MotiView>
          }
          renderItem={({ index, item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              className="w-[48%]"
              onPress={() =>
                navigation.navigate('ProductDetails', {
                  _id: item._id,
                })
              }
            >
              <MotiView
                from={{ opacity: 0, translateY: 15 }}
                animate={{
                  opacity: step >= 4 ? 1 : 0,
                  translateY: step >= 4 ? 0 : 15,
                }}
                onDidAnimate={(key, finished) => {
                  if (key === 'opacity' && finished && step === 4) {
                    setStep(5)
                  }
                }}
                transition={{
                  type: 'spring',
                  damping: 12,
                  stiffness: 30,
                  delay: index * 120,
                }}
                className="w-full"
              >
                <ProductCard
                  _id={item._id}
                  image={item.images[0]}
                  name={item.name}
                  brand={item.brand}
                  average_rate={item.average_rating}
                  price={Number(item.prices[0].price)}
                  inCart={addedIds.includes(item._id)}
                  onPress={() => handleAddItemToTheCart(item._id)}
                />
              </MotiView>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen