import * as SQLite from 'expo-sqlite';
import { Product } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('store.db');
  }

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT
    );
  `);
};

export const getProducts = async (): Promise<Product[]> => {
  if (!db) await initDatabase();
  const allRows = await db!.getAllAsync<Product>('SELECT * FROM products ORDER BY id DESC;');
  return allRows;
};

export const addProduct = async (title: string, price: number, description: string) => {
  if (!db) await initDatabase();
  const result = await db!.runAsync(
    'INSERT INTO products (title, price, description) VALUES (?, ?, ?);',
    [title, price, description]
  );
  return result.lastInsertRowId;
};

export const deleteProduct = async (id: number) => {
  if (!db) await initDatabase();
  await db!.runAsync('DELETE FROM products WHERE id = ?;', [id]);
};