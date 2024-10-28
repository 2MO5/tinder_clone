import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { View, Text } from "react-native";
import * as Google from "expo-google-app-auth";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "@firebase/auth";

import { auth } from "../firebase";

//creating the context
const AuthContext = createContext({});

const config = {
  androidClientId:
    "905192686231-eltq9irh3kgeg13qeldgqi1qtidr3ue1.apps.googleusercontent.com",
  scopes: ["profile", "email"],
  permissions: ["publice_profile", "email", "gender", "location"],
};

export function AuthProvider({ children }: any) {
  const [error, setError] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loadingInitial, setLoadingInitial] = useState<Boolean>(true);
  const [loading, setLoading] = useState<Boolean>(false);

  // useEffect(() => {
  //   const unsub = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       //logged in.....
  //       setUser(user);
  //     } else {
  //       setUser(null);
  //     }

  //     setLoadingInitial(false);
  //   });

  //   return unsub;
  // }, []);

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          //logged in.....
          setUser(user);
        } else {
          setUser(null);
        }

        setLoadingInitial(false);
      }),

    []
  );

  const logOut = () => {
    setLoading(true);

    signOut(auth)
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  const signInWithGoogle = async () => {
    setLoading(true);

    await Google.logInAsync(config)
      .then(async (logInResult: any) => {
        if (logInResult.type === "success") {
          //...login
          const { idToken, accessToken } = logInResult;
          console.log(idToken);
          const credential = GoogleAuthProvider.credential(
            idToken,
            accessToken
          );
          await signInWithCredential(auth, credential);
        }

        return Promise.reject();
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  //To render only the required instead of giving out all
  const memoedValues = useMemo(
    () => ({
      user,
      loading,
      error,
      signInWithGoogle,
      logOut,
    }),
    [user, loading, error]
  );

  return (
    //creating the provider; the one who provides
    <AuthContext.Provider
      // value={
      //   {
      //     // user: "John",
      //     // user: user,
      //     // loading: loading,
      //     // error: error,
      //     // signInWithGoogle,
      //     // logOut,
      //     // status: "active"
      //   }
      // }
      value={memoedValues}
    >
      {/* Wrapping all the children with all her arms */}
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
}

//passing above to another useContext which then accessed on other pages
export default function useAuth() {
  return useContext(AuthContext);
}

// 1. Creating the authContext and its providers
// 2. Passing the AuthContext to a useContext
// 3. Then accessing that which is in there
