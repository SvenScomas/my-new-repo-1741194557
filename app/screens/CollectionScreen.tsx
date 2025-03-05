import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { getCollection, CollectionGame, updateGameRating } from '../storage/collection';
import { AirbnbRating } from 'react-native-ratings';
import { useIsFocused } from '@react-navigation/native';

export const CollectionScreen = ({ navigation }) => {
  const [collection, setCollection] = useState<CollectionGame[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadCollection();
    }
  }, [isFocused]);

  const loadCollection = async () => {
    const games = await getCollection();
    setCollection(games.sort((a, b) => b.userRating - a.userRating));
  };

  const handleRatingChange = async (gameId: string, rating: number) => {
    await updateGameRating(gameId, rating);
    await loadCollection();
  };

  const renderGameItem = ({ item }: { item: CollectionGame }) => (
    <TouchableOpacity
      style={styles.gameCard}
      onPress={() => navigation.navigate('GameDetails', { gameId: item.id })}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.gameInfo}>
        <Text style={styles.gameName}>{item.name}</Text>
        <AirbnbRating
          count={10}
          defaultRating={item.userRating}
          size={20}
          showRating={false}
          onFinishRating={(rating) => handleRatingChange(item.id, rating)}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={collection}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Your collection is empty. Add games from the search tab!
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  listContainer: {
    padding: 16,
  },
  gameCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: 100,
    height: 100,
  },
  gameInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  gameName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});