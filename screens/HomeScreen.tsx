import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  Pressable,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import tw from "tailwind-rn";
import useAuth from "../hooks/useAuth";
import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Swiper from "react-native-deck-swiper";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const DUMMY_DATA = [
  {
    id: 123,
    firstName: "Elon",
    lastName: "Musk",
    occupation: "Rocket Lover",
    photoURL:
      "https://www.aljazeera.com/wp-content/uploads/2021/12/musk-2.jpg?resize=770%2C513",
    age: 40,
  },
  {
    id: 345,
    firstName: "Angeline",
    lastName: "Jolie",
    occupation: "Actress",
    photoURL:
      "https://images.indianexpress.com/2021/08/angelina-jolie-1200.jpg",
    age: 44,
  },
  {
    id: 567,
    firstName: "Hiram",
    lastName: "Butler",
    occupation: "Esoteric Master",
    photoURL:
      "https://2.bp.blogspot.com/-Outkc3U7-NU/VIO_T8tzcoI/AAAAAAAAARg/V-AS1UZu1qo/s1600/Hiram%2BButler%2Bw%2Bsig.jpg",
    age: 42,
  },
  {
    id: 789,
    firstName: "John",
    lastName: "Kane",
    occupation: "Swimming Champ",
    photoURL:
      "https://upload.wikimedia.org/wikipedia/commons/7/71/John_Kinsella_%28swimmer%29.jpg",
    age: 42,
  },
  {
    id: 190,
    firstName: "Jiale",
    lastName: "Rae",
    occupation: "Teacher",
    photoURL:
      "https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/D8qa-2E/beautiful-chinese-women-with-happy-smiling-face-people-lifestyle-background_hmi19xan_thumbnail-1080_01.png",
    age: 32,
  },
];

const HomeScreen = ({ navigation }: any) => {
  const { user, logOut } = useAuth();
  const swipeRef = useRef();
  // const navigation = useNavigation();
  const [profiles, setProfiles] = useState<any>([]);

  console.log(user);

  useLayoutEffect(() => {
    const unsub = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      console.log("snapshot: ", snapshot);
      if (!snapshot.exists()) {
        navigation.navigate("Modal");
      }
    });

    return unsub();
  }, []);

  useEffect(() => {
    let unsub;

    const fetchCards = async () => {
      //an array to hold the passes
      const passes = getDocs(collection(db, "users", user.uid, "passes")).then(
        (snapshot) => snapshot.docs.map((doc) => doc.id)
      );

      // for swipes
      const swipes = getDocs(collection(db, "users", user.uid, "passes")).then(
        (snapshot) => snapshot.docs.map((doc) => doc.id)
      );

      //to see of there are passed ids
      const passedUserIds = passes.length > 0 ? passes : ["test"];
      //for swipes
      const swipedUserIds = swipes.length > 0 ? swipes : ["test"];

      //collection where the id is not in that passedUserIds array
      unsub = onSnapshot(
        query(
          //Throwing out the ones that we've previously passed
          collection(db, "users"),
          where("id", "not-in", [...passedUserIds])
        ),
        (snapshot) => {
          setProfiles(
            //building an object
            //get all the documents and map through each document
            //filter out documents so the logged in user is never included
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        }
      );
    };

    fetchCards();
    return unsub;
  }, []);

  console.log("profiles: ", profiles);

  //1. Recording the swipe and passes
  const swipeLeft = async (cardIndex) => {
    //check if the card exists. It it\s there then cut things out from there onwards
    if (!profiles.cards[cardIndex]) return;
    //if a user swiped on you then that card is inside the Profiles
    const userSwiped = profiles[cardIndex];
    console.log(`Swiping PASS on ${userSwiped.displayName}`);

    //finally setting the document
    // the first part of this is for the reference of the user. Identifying the user
    // second part is to insert the data
    // adding a new slot named  passes within the document
    setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
  };

  const swipeRight = async (cardIndex) => {
    //if there's no card index in the profile
    if (!profiles[cardIndex]) return;
    //Injecting it in
    const userSwiped = profiles[cardIndex];
    console.log(`Swiping MATCH on ${userSwiped.displayName}`);
    //adding it to a new array
    setDoc(doc(db, "users", user.uid, "swipes", userSwiped.id), userSwiped);
  };

  return (
    // <View style={tw("flex-1 justify-center items-center")}>
    <SafeAreaView
      style={{ flex: 1, paddingVertical: 40, backgroundColor: "#fff" }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 20,
        }}
      >
        <TouchableOpacity activeOpacity={0.4} onPress={logOut}>
          <Image
            style={{ height: 44, width: 44, borderRadius: 44 }}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image
            style={{
              height: 55,
              width: 55,
              borderRadius: 55,
            }}
            source={require("../logo.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons
            name="chatbubbles-sharp"
            style={{ color: "#ff5864" }}
            size={30}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, marginTop: 60 }}>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          verticalSwipe={false}
          onSwipedRight={(cardIndex: number) => {
            console.warn("Swiped MATCH");
            //passing the cardIndex
            swipeRight(cardIndex);
          }}
          onSwipedLeft={(cardIndex: number) => {
            console.warn("Swiped PASS");
            swipeLeft(cardIndex);
          }}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                textAlign: "right",
                color: "red",
              },
            },
            right: {
              title: "MATCH",
              style: {
                // textAlign: "right",
                color: "#4DED30",
              },
            },
          }}
          animateCardOpacity
          renderCard={(card: any) => {
            return card ? (
              <View
                key={card.id}
                style={{
                  backgroundColor: "#ffffff",
                  height: "80%",
                  borderRadius: 24,
                  marginTop: -75,
                  position: "relative",
                }}
              >
                <Image
                  style={{
                    position: "absolute",
                    top: 0,
                    height: "100%",
                    width: "100%",
                    borderRadius: 24,
                  }}
                  source={{ uri: card.photoURL }}
                />

                <View
                  style={{
                    backgroundColor: "#fff",
                    width: "100%",
                    height: "25%",
                    position: "absolute",
                    bottom: 0,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 60,
                    paddingVertical: 20,
                    borderRadius: 20,
                    alignItems: "space-between",
                    elevation: 2,
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 40, fontWeight: "bold" }}>
                      {card.firstName} {card.lastName}
                    </Text>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                      {card.occupation}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 40, fontWeight: "bold" }}>
                    {card.age}
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: "#f5f4f4",
                  height: "80%",
                  borderRadius: 24,
                  marginTop: -75,
                  position: "relative",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ paddingBottom: 10, fontWeight: "bold" }}>
                  No More Profiles
                </Text>
                <Image
                  style={{
                    height: "30%",
                    width: "40%",
                  }}
                  height={10}
                  width={20}
                  source={{ uri: "http://links.papareact.com/6gb" }}
                />
              </View>
            );
          }}
        />
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 55,
            height: 55,
            borderRadius: 55,
            backgroundColor: "#fbdada",
          }}
        >
          <Entypo name="cross" size={20} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 55,
            height: 55,
            borderRadius: 55,
            backgroundColor: "#d3ffcf",
          }}
        >
          <AntDesign name="heart" size={20} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
