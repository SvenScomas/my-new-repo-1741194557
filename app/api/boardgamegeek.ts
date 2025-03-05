import axios from 'axios';
import { parseString } from 'react-native-xml2js';

const BASE_URL = 'https://boardgamegeek.com/xmlapi2';

export interface BoardGame {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  yearPublished: string;
  minPlayers: string;
  maxPlayers: string;
  playingTime: string;
  rating: string;
}

const parseXMLResponse = (xml: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    parseString(xml, { explicitArray: false }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

export const searchGames = async (query: string): Promise<BoardGame[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/search?query=${encodeURIComponent(query)}&type=boardgame`);
    const result = await parseXMLResponse(response.data);
    
    if (!result.items.item) return [];
    
    const items = Array.isArray(result.items.item) ? result.items.item : [result.items.item];
    
    return items.map((item: any) => ({
      id: item.$.id,
      name: item.name?.$.value || item.name || 'Unknown',
      thumbnail: '',
      description: '',
      yearPublished: item.yearpublished?.$.value || 'N/A',
      minPlayers: '',
      maxPlayers: '',
      playingTime: '',
      rating: ''
    }));
  } catch (error) {
    console.error('Error searching games:', error);
    return [];
  }
};

export const getGameDetails = async (gameId: string): Promise<BoardGame | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/thing?id=${gameId}&stats=1`);
    const result = await parseXMLResponse(response.data);
    
    const item = result.items.item;
    if (!item) return null;

    return {
      id: gameId,
      name: item.name?.$.value || 'Unknown',
      thumbnail: item.thumbnail || '',
      description: item.description || '',
      yearPublished: item.yearpublished?.$.value || 'N/A',
      minPlayers: item.minplayers?.$.value || '',
      maxPlayers: item.maxplayers?.$.value || '',
      playingTime: item.playingtime?.$.value || '',
      rating: item.statistics?.ratings?.average?.$.value || 'N/A'
    };
  } catch (error) {
    console.error('Error fetching game details:', error);
    return null;
  }
};