import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { auth, db } from "../config/firebase"; // make sure db is exported in firebase.js
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const { width, height } = Dimensions.get("window");

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Save name in Firebase Auth profile
      await updateProfile(user, { displayName: name });

      // Save user in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        createdAt: new Date(),
      });

      console.log("User registered:", user.uid);
      Alert.alert("Success", "Account created successfully!");
      navigation.replace("Checklist"); // go to main app
    } catch (error) {
      console.log("Signup error:", error);
      Alert.alert("Sign Up Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg-image.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.signupButton]}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={styles.signUpText}>
                {loading ? "Signing Up..." : "Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={styles.accountText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.replace("Login")}>
              <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: width * 0.8,
    height: height * 0.75,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 38,
    color: "#BFA054",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "DMSerifDisplay_400Regular",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
    fontFamily: "DMSerifDisplay_400Regular",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FBF8F2",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#000",
    borderWidth: 1,
    borderColor: "#BFA054",
  },
  buttonContainer: { width: "100%", marginTop: 10, alignItems: "center" },
  button: {
    width: "80%",
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 15,
    borderEndEndRadius: 25,
    borderStartStartRadius: 25,
  },
  signupButton: { backgroundColor: "#9A2143" },
  signUpText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "DMSerifDisplay_400Regular",
  },
  accountText: {
    fontSize: 16,
    color: "#555",
    fontFamily: "DMSerifDisplay_400Regular",
  },
  loginText: {
    fontSize: 16,
    color: "#9A2143",
    fontFamily: "DMSerifDisplay_400Regular",
  },
});

export default SignUpScreen;
