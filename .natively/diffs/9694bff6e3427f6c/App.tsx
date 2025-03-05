--- 
+++ 
@@ -3,64 +3,55 @@
 import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 import { createNativeStackNavigator } from '@react-navigation/native-stack';
 import { HomeScreen } from './app/screens/HomeScreen';
+import { CollectionScreen } from './app/screens/CollectionScreen';
 import { GameDetailsScreen } from './app/screens/GameDetailsScreen';
-import { CollectionScreen } from './app/screens/CollectionScreen';
+import { Ionicons } from '@expo/vector-icons';
 import { StatusBar } from 'expo-status-bar';
-import { Ionicons } from '@expo/vector-icons';
 
+const Tab = createBottomTabNavigator();
 const Stack = createNativeStackNavigator();
-const Tab = createBottomTabNavigator();
 
-const HomeStack = () => (
-  <Stack.Navigator
-    screenOptions={{
-      headerStyle: {
-        backgroundColor: '#F5F7FA',
-      },
-      headerShadowVisible: false,
-      headerTitleStyle: {
-        fontWeight: 'bold',
-      },
-    }}
-  >
-    <Stack.Screen
-      name="HomeScreen"
-      component={HomeScreen}
-      options={{ title: 'Search Games' }}
-    />
-    <Stack.Screen
-      name="GameDetails"
-      component={GameDetailsScreen}
-      options={{ title: '' }}
-    />
-  </Stack.Navigator>
-);
+const TabNavigator = () => {
+  return (
+    <Tab.Navigator
+      screenOptions={({ route }) => ({
+        tabBarIcon: ({ focused, color, size }) => {
+          let iconName;
+
+          if (route.name === 'Search') {
+            iconName = focused ? 'search' : 'search-outline';
+          } else if (route.name === 'Collection') {
+            iconName = focused ? 'library' : 'library-outline';
+          }
+
+          return <Ionicons name={iconName} size={size} color={color} />;
+        },
+        tabBarActiveTintColor: '#1A237E',
+        tabBarInactiveTintColor: 'gray',
+      })}
+    >
+      <Tab.Screen name="Search" component={HomeScreen} />
+      <Tab.Screen name="Collection" component={CollectionScreen} />
+    </Tab.Navigator>
+  );
+};
 
 export default function App() {
   return (
     <NavigationContainer>
       <StatusBar style="dark" />
-      <Tab.Navigator
-        screenOptions={({ route }) => ({
-          tabBarIcon: ({ focused, color, size }) => {
-            let iconName;
-
-            if (route.name === 'Home') {
-              iconName = focused ? 'search' : 'search-outline';
-            } else if (route.name === 'Collection') {
-              iconName = focused ? 'library' : 'library-outline';
-            }
-
-            return <Ionicons name={iconName} size={size} color={color} />;
-          },
-          tabBarActiveTintColor: '#1A237E',
-          tabBarInactiveTintColor: 'gray',
-          headerShown: false,
-        })}
-      >
-        <Tab.Screen name="Home" component={HomeStack} />
-        <Tab.Screen name="Collection" component={CollectionScreen} />
-      </Tab.Navigator>
+      <Stack.Navigator>
+        <Stack.Screen
+          name="Main"
+          component={TabNavigator}
+          options={{ headerShown: false }}
+        />
+        <Stack.Screen
+          name="GameDetails"
+          component={GameDetailsScreen}
+          options={{ title: '' }}
+        />
+      </Stack.Navigator>
     </NavigationContainer>
   );
 }