--- 
+++ 
@@ -6,23 +6,51 @@
   Image,
   StyleSheet,
   ActivityIndicator,
+  TouchableOpacity,
 } from 'react-native';
 import { getGameDetails, BoardGame } from '../api/boardgamegeek';
 import { LinearGradient } from 'expo-linear-gradient';
+import { AirbnbRating } from 'react-native-ratings';
+import { addGameToCollection, removeGameFromCollection, isGameInCollection, CollectionGame } from '../storage/collection';
 
 export const GameDetailsScreen = ({ route }) => {
   const { gameId } = route.params;
   const [game, setGame] = useState<BoardGame | null>(null);
   const [loading, setLoading] = useState(true);
+  const [inCollection, setInCollection] = useState(false);
 
   useEffect(() => {
     loadGameDetails();
+    checkCollectionStatus();
   }, [gameId]);
 
   const loadGameDetails = async () => {
     const details = await getGameDetails(gameId);
     setGame(details);
     setLoading(false);
+  };
+
+  const checkCollectionStatus = async () => {
+    const status = await isGameInCollection(gameId);
+    setInCollection(status);
+  };
+
+  const handleCollectionToggle = async () => {
+    if (!game) return;
+
+    if (inCollection) {
+      await removeGameFromCollection(gameId);
+    } else {
+      const collectionGame: CollectionGame = {
+        id: game.id,
+        name: game.name,
+        thumbnail: game.thumbnail,
+        userRating: 0,
+        dateAdded: new Date().toISOString(),
+      };
+      await addGameToCollection(collectionGame);
+    }
+    setInCollection(!inCollection);
   };
 
   if (loading) {
@@ -63,6 +91,18 @@
       </View>
 
       <View style={styles.detailsContainer}>
+        <TouchableOpacity
+          style={[
+            styles.collectionButton,
+            inCollection ? styles.removeButton : styles.addButton,
+          ]}
+          onPress={handleCollectionToggle}
+        >
+          <Text style={styles.buttonText}>
+            {inCollection ? 'Remove from Collection' : 'Add to Collection'}
+          </Text>
+        </TouchableOpacity>
+
         <View style={styles.statsRow}>
           <View style={styles.statItem}>
             <Text style={styles.statLabel}>Players</Text>
@@ -130,6 +170,23 @@
   detailsContainer: {
     padding: 16,
   },
+  collectionButton: {
+    padding: 16,
+    borderRadius: 8,
+    alignItems: 'center',
+    marginBottom: 16,
+  },
+  addButton: {
+    backgroundColor: '#1A237E',
+  },
+  removeButton: {
+    backgroundColor: '#FF5722',
+  },
+  buttonText: {
+    color: '#fff',
+    fontSize: 16,
+    fontWeight: 'bold',
+  },
   statsRow: {
     flexDirection: 'row',
     justifyContent: 'space-between',
