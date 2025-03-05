--- 
+++ 
@@ -17,7 +17,7 @@
 
 const parseXMLResponse = (xml: string): Promise<any> => {
   return new Promise((resolve, reject) => {
-    parseString(xml, (err, result) => {
+    parseString(xml, { explicitArray: false }, (err, result) => {
       if (err) reject(err);
       else resolve(result);
     });
@@ -31,12 +31,15 @@
     
     if (!result.items.item) return [];
     
-    return result.items.item.map((item: any) => ({
-      id: item.$.id,
-      name: item.name?.[0]?.$.value || item.name?.[0] || 'Unknown',
+    // Ensure item is always an array
+    const items = Array.isArray(result.items.item) ? result.items.item : [result.items.item];
+    
+    return items.map((item: any) => ({
+      id: item.$ ? item.$.id : item.id,
+      name: item.name?.$ ? item.name.$.value : (item.name || 'Unknown'),
       thumbnail: '',
       description: '',
-      yearPublished: item.yearpublished?.[0]?.$.value || 'N/A',
+      yearPublished: item.yearpublished?.$ ? item.yearpublished.$.value : 'N/A',
       minPlayers: '',
       maxPlayers: '',
       playingTime: '',
@@ -53,18 +56,19 @@
     const response = await axios.get(`${BASE_URL}/thing?id=${gameId}&stats=1`);
     const result = await parseXMLResponse(response.data);
     
-    const item = result.items.item[0];
-    
+    const item = result.items.item;
+    if (!item) return null;
+
     return {
       id: gameId,
-      name: item.name?.[0]?.$.value || 'Unknown',
-      thumbnail: item.thumbnail?.[0] || '',
-      description: item.description?.[0] || '',
-      yearPublished: item.yearpublished?.[0]?.$.value || 'N/A',
-      minPlayers: item.minplayers?.[0]?.$.value || '',
-      maxPlayers: item.maxplayers?.[0]?.$.value || '',
-      playingTime: item.playingtime?.[0]?.$.value || '',
-      rating: item.statistics?.[0]?.ratings?.[0]?.average?.[0]?.$.value || 'N/A'
+      name: item.name?.$ ? item.name.$.value : (item.name || 'Unknown'),
+      thumbnail: item.thumbnail || '',
+      description: item.description || '',
+      yearPublished: item.yearpublished?.$ ? item.yearpublished.$.value : 'N/A',
+      minPlayers: item.minplayers?.$ ? item.minplayers.$.value : '',
+      maxPlayers: item.maxplayers?.$ ? item.maxplayers.$.value : '',
+      playingTime: item.playingtime?.$ ? item.playingtime.$.value : '',
+      rating: item.statistics?.ratings?.average?.$ ? item.statistics.ratings.average.$.value : 'N/A'
     };
   } catch (error) {
     console.error('Error fetching game details:', error);
