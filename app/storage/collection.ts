import AsyncStorage from '@react-native-async-storage/async-storage';
import { BoardGame } from '../api/boardgamegeek';

export interface CollectionGame extends BoardGame {
  userRating: number;
  dateAdded: string;
}

const COLLECTION_KEY = '@boardgames_collection';

export const addGameToCollection = async (game: BoardGame): Promise<boolean> => {
  try {
    const collection = await getCollection();
    const collectionGame: CollectionGame = {
      ...game,
      userRating: 0,
      dateAdded: new Date().toISOString()
    };
    
    const updatedCollection = [...collection, collectionGame];
    await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(updatedCollection));
    return true;
  } catch (error) {
    console.error('Error adding game to collection:', error);
    return false;
  }
};

export const removeGameFromCollection = async (gameId: string): Promise<boolean> => {
  try {
    const collection = await getCollection();
    const updatedCollection = collection.filter(game => game.id !== gameId);
    await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(updatedCollection));
    return true;
  } catch (error) {
    console.error('Error removing game from collection:', error);
    return false;
  }
};

export const updateGameRating = async (gameId: string, rating: number): Promise<boolean> => {
  try {
    const collection = await getCollection();
    const updatedCollection = collection.map(game =>
      game.id === gameId ? { ...game, userRating: rating } : game
    );
    await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(updatedCollection));
    return true;
  } catch (error) {
    console.error('Error updating game rating:', error);
    return false;
  }
};

export const getCollection = async (): Promise<CollectionGame[]> => {
  try {
    const collection = await AsyncStorage.getItem(COLLECTION_KEY);
    return collection ? JSON.parse(collection) : [];
  } catch (error) {
    console.error('Error getting collection:', error);
    return [];
  }
};

export const isGameInCollection = async (gameId: string): Promise<boolean> => {
  const collection = await getCollection();
  return collection.some(game => game.id === gameId);
};