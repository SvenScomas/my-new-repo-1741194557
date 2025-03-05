import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { searchGames, BoardGame } from '../api/boardgamegeek';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [games, setGames] = useState<BoardGame[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    // Load popular games on mount
    loadInitialGames();
  }, []);

  const loadInitialGames = async () => {
    setLoading(true);
    // Search for some popular games as initial data
    const results = await searchGames('catan OR monopoly OR risk OR chess');
    setGames(results);
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadInitialGames();
      return;
    }
    
    setLoading(true);
    const results = await searchGames(searchQuery);
    setGames(results);
    setLoading(false);
  };

  const renderGameCard = ({ item }: { item: BoardGame }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('GameDetails', { gameId: item.id })}
    >
      <View style={styles.cardInner}>
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
          style={styles.cardGradient}
        >
          <Text style={styles.gameTitle}>{item.name}</Text>
          <Text style={styles.yearText}>{item.yearPublished}</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        {loading ? 'Loading games...' : 'No games found. Try a different search term!'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <BlurView intensity={90} style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search board games..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          placeholderTextColor="#666"
        />
      </BlurView>
      
      {loading ? (
        <ActivityIndicator size="large" color="#1A237E" style={styles.loader} />
      ) : (
        <FlatList
          data={games}
          renderItem={renderGameCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gamesList}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gamesList: {
    padding: 8,
    minHeight: '100%',
  },
  card: {
    flex: 1,
    margin: 8,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardInner: {
    flex: 1,
    backgroundColor: '#ddd',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  gameTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  yearText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 300,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});