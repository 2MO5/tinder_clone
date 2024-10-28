import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigation } from "@react-navigation/native";

export default function ModalScreen() {
  const { user } = useAuth();
  const [image, setImage] = useState<any>(null);
  const [job, setJob] = useState<any>(null);
  const [age, setAge] = useState<any>(null);
  const navigation = useNavigation();
  const incompleteForm = !image || !job || !age;
  // 3:11
  const updateUserProfile = (props: any) => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image,
      job: job,
      age: age,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
        console.log(error);
      });
  };

  return (
    <View style={{ flex: 1, alignItems: "center", paddingTop: 10 }}>
      <Image
        style={{ height: 100, width: 100 }}
        resizeMode="contain"
        source={{ uri: "https://links.papareact.com/2pf" }}
      />

      <Text
        style={{ fontSize: 18, color: "grey", padding: 10, fontWeight: "bold" }}
      >
        Welcome {user.displayName}
      </Text>
      <Text
        style={{
          textAlign: "center",
          padding: 30,
          fontWeight: "bold",
          color: "#fababa",
        }}
      >
        Step 1: The Profile Pic
      </Text>
      <TextInput
        value={image}
        onChangeText={setImage}
        style={{ textAlign: "center", fontSize: 17, paddingBottom: 20 }}
        placeholder="Enter a profile pic url"
      />
      <Text
        style={{
          textAlign: "center",
          padding: 30,
          fontWeight: "bold",
          color: "#fababa",
        }}
      >
        Step 2: The Job
      </Text>
      <TextInput
        value={job}
        onChangeText={setJob}
        style={{ textAlign: "center", fontSize: 17, paddingBottom: 20 }}
        placeholder="Enter a job"
      />
      <Text
        style={{
          textAlign: "center",
          padding: 30,
          fontWeight: "bold",
          color: "#fababa",
        }}
      >
        Step 3: The Age
      </Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        style={{ textAlign: "center", fontSize: 17, paddingBottom: 20 }}
        placeholder="Enter your age"
        keyboardType={"numeric"}
        maxLength={2}
      />

      <TouchableOpacity
        onPress={updateUserProfile}
        disabled={incompleteForm}
        style={{
          width: "70%",
          padding: 16,
          borderRadius: 16,
          position: "absolute",
          bottom: 10,
          backgroundColor: incompleteForm ? "#d8d8d8" : "#ff8f8f",
        }}
      >
        <Text style={{ textAlign: "center", color: "#fff", fontSize: 17 }}>
          Update Your Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}
