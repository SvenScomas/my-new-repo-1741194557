--- 
+++ 
@@ -1,38 +1,66 @@
 import React from 'react';
 import { NavigationContainer } from '@react-navigation/native';
+import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 import { createNativeStackNavigator } from '@react-navigation/native-stack';
 import { HomeScreen } from './app/screens/HomeScreen';
 import { GameDetailsScreen } from './app/screens/GameDetailsScreen';
+import { CollectionScreen } from './app/screens/CollectionScreen';
 import { StatusBar } from 'expo-status-bar';
+import { Ionicons } from '@expo/vector-icons';
 
 const Stack = createNativeStackNavigator();
+const Tab = createBottomTabNavigator();
+
+const HomeStack = () => (
+  <Stack.Navigator
+    screenOptions={{
+      headerStyle: {
+        backgroundColor: '#F5F7FA',
+      },
+      headerShadowVisible: false,
+      headerTitleStyle: {
+        fontWeight: 'bold',
+      },
+    }}
+  >
+    <Stack.Screen
+      name="HomeScreen"
+      component={HomeScreen}
+      options={{ title: 'Search Games' }}
+    />
+    <Stack.Screen
+      name="GameDetails"
+      component={GameDetailsScreen}
+      options={{ title: '' }}
+    />
+  </Stack.Navigator>
+);
 
 export default function App() {
   return (
     <NavigationContainer>
       <StatusBar style="dark" />
-      <Stack.Navigator
-        screenOptions={{
-          headerStyle: {
-            backgroundColor: '#F5F7FA',
+      <Tab.Navigator
+        screenOptions={({ route }) => ({
+          tabBarIcon: ({ focused, color, size }) => {
+            let iconName;
+
+            if (route.name === 'Home') {
+              iconName = focused ? 'search' : 'search-outline';
+            } else if (route.name === 'Collection') {
+              iconName = focused ? 'library' : 'library-outline';
+            }
+
+            return <Ionicons name={iconName} size={size} color={color} />;
           },
-          headerShadowVisible: false,
-          headerTitleStyle: {
-            fontWeight: 'bold',
-          },
-        }}
+          tabBarActiveTintColor: '#1A237E',
+          tabBarInactiveTintColor: 'gray',
+          headerShown: false,
+        })}
       >
-        <Stack.Screen
-          name="Home"
-          component={HomeScreen}
-          options={{ title: 'Board Games' }}
-        />
-        <Stack.Screen
-          name="GameDetails"
-          component={GameDetailsScreen}
-          options={{ title: '' }}
-        />
-      </Stack.Navigator>
+        <Tab.Screen name="Home" component={HomeStack} />
+        <Tab.Screen name="Collection" component={CollectionScreen} />
+      </Tab.Navigator>
     </NavigationContainer>
   );
 }