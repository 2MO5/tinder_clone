import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { View, Text } from "react-native";
import useAuth from "./hooks/useAuth";
import ChatScreen from "./screens/ChatScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import ModalScreen from "./screens/ModalScreen";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      {user ? (
        <>
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{ animation: "slide_from_right" }}
            />
          </Stack.Group>

          <Stack.Group
            screenOptions={{
              presentation: "containedModal",
              animation: "flip",
              animationTypeForReplace: "pop",
              // animationTypeForReplace: "push",
            }}
          >
            <Stack.Screen
              name="Modal"
              component={ModalScreen}
              options={{ animation: "simple_push" }}
            />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
