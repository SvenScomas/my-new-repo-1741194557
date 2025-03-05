import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { getGameDetails, BoardGame } from '../api/boardgamegeek';
import { LinearGradient } from 'expo-linear-gradient';
import { AirbnbRating } from 'react-native-ratings';
import { addGameToCollection, removeGameFromCollection, isGameInCollection, CollectionGame } from '../storage/collection';

export const GameDetailsScreen = ({ route }) => {
  const { gameId } = route.params;
  const [game, setGame] = useState<BoardGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [inCollection, setInCollection] = useState(false);

  useEffect(() => {
    loadGameDetails();
    checkCollectionStatus();
  }, [gameId]);

  const loadGameDetails = async () => {
    const details = await getGameDetails(gameId);
    setGame(details);
    setLoading(false);
  };

  const checkCollectionStatus = async () => {
    const status = await isGameInCollection(gameId);
    setInCollection(status);
  };

  const handleCollectionToggle = async () => {
    if (!game) return;

    if (inCollection) {
      await removeGameFromCollection(gameId);
    } else {
      const collectionGame: CollectionGame = {
        id: game.id,
        name: game.name,
        thumbnail: game.thumbnail,
        userRating: 0,
        dateAdded: new Date().toISOString(),
      };
      await addGameToCollection(collectionGame);
    }
    setInCollection(!inCollection);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1A237E" />
      </View>
    );
  }

  if (!game) {
    return (
      <View style={styles.centered}>
        <Text>Failed to load game details</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {game.thumbnail ? (
          <Image
            source={{ uri: game.thumbnail }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage} />
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <Text style={styles.title}>{game.name}</Text>
          <Text style={styles.year}>{game.yearPublished}</Text>
        </LinearGradient>
      </View>

      <View style={styles.detailsContainer}>
        <TouchableOpacity
          style={[
            styles.collectionButton,
            inCollection ? styles.removeButton : styles.addButton,
          ]}
          onPress={handleCollectionToggle}
        >
          <Text style={styles.buttonText}>
            {inCollection ? 'Remove from Collection' : 'Add to Collection'}
          </Text>
        </TouchableOpacity>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Players</Text>
            <Text style={styles.statValue}>{game.minPlayers}-{game.maxPlayers}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Playing Time</Text>
            <Text style={styles.statValue}>{game.playingTime} min</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Rating</Text>
            <Text style={styles.statValue}>{Number(game.rating).toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.description}>{game.description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ddd',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    justifyContent: 'flex-end',
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  year: {
    color: '#fff',
    fontSize: 16,
    marginTop: 4,
  },
  detailsContainer: {
    padding: 16,
  },
  collectionButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#1A237E',
  },
  removeButton: {
    backgroundColor: '#FF5722',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});