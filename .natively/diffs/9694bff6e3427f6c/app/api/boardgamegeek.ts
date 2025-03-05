--- 
+++ 
@@ -31,15 +31,14 @@
     
     if (!result.items.item) return [];
     
-    // Ensure item is always an array
     const items = Array.isArray(result.items.item) ? result.items.item : [result.items.item];
     
     return items.map((item: any) => ({
-      id: item.$ ? item.$.id : item.id,
-      name: item.name?.$ ? item.name.$.value : (item.name || 'Unknown'),
+      id: item.$.id,
+      name: item.name?.$.value || item.name || 'Unknown',
       thumbnail: '',
       description: '',
-      yearPublished: item.yearpublished?.$ ? item.yearpublished.$.value : 'N/A',
+      yearPublished: item.yearpublished?.$.value || 'N/A',
       minPlayers: '',
       maxPlayers: '',
       playingTime: '',
@@ -61,14 +60,14 @@
 
     return {
       id: gameId,
-      name: item.name?.$ ? item.name.$.value : (item.name || 'Unknown'),
+      name: item.name?.$.value || 'Unknown',
       thumbnail: item.thumbnail || '',
       description: item.description || '',
-      yearPublished: item.yearpublished?.$ ? item.yearpublished.$.value : 'N/A',
-      minPlayers: item.minplayers?.$ ? item.minplayers.$.value : '',
-      maxPlayers: item.maxplayers?.$ ? item.maxplayers.$.value : '',
-      playingTime: item.playingtime?.$ ? item.playingtime.$.value : '',
-      rating: item.statistics?.ratings?.average?.$ ? item.statistics.ratings.average.$.value : 'N/A'
+      yearPublished: item.yearpublished?.$.value || 'N/A',
+      minPlayers: item.minplayers?.$.value || '',
+      maxPlayers: item.maxplayers?.$.value || '',
+      playingTime: item.playingtime?.$.value || '',
+      rating: item.statistics?.ratings?.average?.$.value || 'N/A'
     };
   } catch (error) {
     console.error('Error fetching game details:', error);
