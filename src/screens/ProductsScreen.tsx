import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Product } from '../types';
import { initDatabase, getProducts, addProduct, deleteProduct } from '../database/db';

export const ProductsScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      await initDatabase();
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      Alert.alert('Помилка БД', 'Не вдалося завантажити товари');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddProduct = async () => {
    if (!title.trim() || !price.trim()) {
      Alert.alert('Помилка', 'Введіть назву та ціну');
      return;
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      Alert.alert('Помилка', 'Ціна має бути числом');
      return;
    }

    try {
      await addProduct(title.trim(), numericPrice, description.trim());
      setTitle('');
      setPrice('');
      setDescription('');
      await loadData();
    } catch (error) {
      Alert.alert('Помилка БД', 'Не вдалося зберегти товар');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      await loadData();
    } catch (error) {
      Alert.alert('Помилка БД', 'Не вдалося видалити товар');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Управління Товарами (БД)</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Назва товару"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Ціна (грн)"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        <TextInput
          style={styles.input}
          placeholder="Опис товару"
          value={description}
          onChangeText={setDescription}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Text style={styles.addButtonText}>Додати в БД</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subHeader}>Список товарів із БД:</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardPrice}>{item.price} грн</Text>
                {item.description ? (
                  <Text style={styles.cardDesc}>{item.description}</Text>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteProduct(item.id)}
              >
                <Text style={styles.deleteButtonText}>Видалити</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>База даних порожня</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  addButton: {
    backgroundColor: '#28a745',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardInfo: {
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardPrice: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 2,
  },
  cardDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});