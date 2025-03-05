--- 
+++ 
@@ -1,19 +1,23 @@
 import AsyncStorage from '@react-native-async-storage/async-storage';
+import { BoardGame } from '../api/boardgamegeek';
 
-export interface CollectionGame {
-  id: string;
-  name: string;
-  thumbnail: string;
+export interface CollectionGame extends BoardGame {
   userRating: number;
   dateAdded: string;
 }
 
 const COLLECTION_KEY = '@boardgames_collection';
 
-export const addGameToCollection = async (game: CollectionGame) => {
+export const addGameToCollection = async (game: BoardGame): Promise<boolean> => {
   try {
     const collection = await getCollection();
-    const updatedCollection = [...collection, game];
+    const collectionGame: CollectionGame = {
+      ...game,
+      userRating: 0,
+      dateAdded: new Date().toISOString()
+    };
+    
+    const updatedCollection = [...collection, collectionGame];
     await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(updatedCollection));
     return true;
   } catch (error) {
@@ -22,7 +26,7 @@
   }
 };
 
-export const removeGameFromCollection = async (gameId: string) => {
+export const removeGameFromCollection = async (gameId: string): Promise<boolean> => {
   try {
     const collection = await getCollection();
     const updatedCollection = collection.filter(game => game.id !== gameId);
@@ -34,10 +38,10 @@
   }
 };
 
-export const updateGameRating = async (gameId: string, rating: number) => {
+export const updateGameRating = async (gameId: string, rating: number): Promise<boolean> => {
   try {
     const collection = await getCollection();
-    const updatedCollection = collection.map(game => 
+    const updatedCollection = collection.map(game =>
       game.id === gameId ? { ...game, userRating: rating } : game
     );
     await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(updatedCollection));
