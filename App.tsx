import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { ProductsScreen } from './src/screens/ProductsScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ProductsScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});