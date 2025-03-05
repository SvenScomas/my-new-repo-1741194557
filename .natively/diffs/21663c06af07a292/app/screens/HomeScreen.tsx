--- 
+++ 
@@ -17,11 +17,27 @@
 export const HomeScreen = () => {
   const [searchQuery, setSearchQuery] = useState('');
   const [games, setGames] = useState<BoardGame[]>([]);
-  const [loading, setLoading] = useState(false);
+  const [loading, setLoading] = useState(true);
   const navigation = useNavigation();
 
+  useEffect(() => {
+    // Load popular games on mount
+    loadInitialGames();
+  }, []);
+
+  const loadInitialGames = async () => {
+    setLoading(true);
+    // Search for some popular games as initial data
+    const results = await searchGames('catan OR monopoly OR risk OR chess');
+    setGames(results);
+    setLoading(false);
+  };
+
   const handleSearch = async () => {
-    if (!searchQuery.trim()) return;
+    if (!searchQuery.trim()) {
+      loadInitialGames();
+      return;
+    }
     
     setLoading(true);
     const results = await searchGames(searchQuery);
@@ -34,14 +50,24 @@
       style={styles.card}
       onPress={() => navigation.navigate('GameDetails', { gameId: item.id })}
     >
-      <LinearGradient
-        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
-        style={styles.cardGradient}
-      >
-        <Text style={styles.gameTitle}>{item.name}</Text>
-        <Text style={styles.yearText}>{item.yearPublished}</Text>
-      </LinearGradient>
+      <View style={styles.cardInner}>
+        <LinearGradient
+          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
+          style={styles.cardGradient}
+        >
+          <Text style={styles.gameTitle}>{item.name}</Text>
+          <Text style={styles.yearText}>{item.yearPublished}</Text>
+        </LinearGradient>
+      </View>
     </TouchableOpacity>
+  );
+
+  const renderEmptyState = () => (
+    <View style={styles.emptyState}>
+      <Text style={styles.emptyStateText}>
+        {loading ? 'Loading games...' : 'No games found. Try a different search term!'}
+      </Text>
+    </View>
   );
 
   return (
@@ -66,6 +92,7 @@
           keyExtractor={(item) => item.id}
           numColumns={2}
           contentContainerStyle={styles.gamesList}
+          ListEmptyComponent={renderEmptyState}
         />
       )}
     </View>
@@ -80,6 +107,7 @@
   header: {
     padding: 16,
     backgroundColor: 'rgba(255,255,255,0.8)',
+    zIndex: 1,
   },
   searchInput: {
     backgroundColor: 'white',
@@ -94,6 +122,7 @@
   },
   gamesList: {
     padding: 8,
+    minHeight: '100%',
   },
   card: {
     flex: 1,
@@ -107,6 +136,10 @@
     shadowOpacity: 0.1,
     shadowRadius: 4,
     elevation: 3,
+  },
+  cardInner: {
+    flex: 1,
+    backgroundColor: '#ddd',
   },
   cardGradient: {
     position: 'absolute',
@@ -130,4 +163,16 @@
     justifyContent: 'center',
     alignItems: 'center',
   },
+  emptyState: {
+    flex: 1,
+    justifyContent: 'center',
+    alignItems: 'center',
+    padding: 32,
+    minHeight: 300,
+  },
+  emptyStateText: {
+    fontSize: 16,
+    color: '#666',
+    textAlign: 'center',
+  },
 });