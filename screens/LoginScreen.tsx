import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { View, Text, Pressable, ImageBackground, Animated } from "react-native";
import useAuth from "../hooks/useAuth";
import { useTailwind } from "tailwind-rn";
import { TouchableOpacity } from "react-native-gesture-handler";

type LoginScreen = {
  user: any;
};

const LoginScreen = () => {
  //useAuth is a createContext from which the user is pulled off
  // const { user, status } = useAuth();

  // console.log(user, " is ", status);

  const { signInWithGoogle, loading } = useAuth();
  const navigation = useNavigation();
  const tw = useTailwind();
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerShown: false,
  //   })
  // },[])

  return (
    <View style={{ flex: 1 }}>
      {/* {!user ? (
        <Text style={{ fontSize: 44, fontWeight: "bold" }}>
          Hello stranger!
        </Text>
      ) : (
        <Text>Hello {user}</Text>
      )} */}

      <ImageBackground
        resizeMode="cover"
        style={{ flex: 1 }}
        source={{ uri: "http://tinder.com/static/tinder.png" }}
      >
        <Pressable
          style={{
            backgroundColor: "#fff",
            paddingHorizontal: 8,
            paddingVertical: 18,
            width: "40%",
            position: "absolute",
            bottom: 100,
            left: -1,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: "28%",
            borderRadius: 12,
          }}
          onPress={signInWithGoogle}
        >
          <Text style={{ fontSize: 13, fontWeight: "bold" }}>
            Sign In & Get Swiping
          </Text>
        </Pressable>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
