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
import { auth } from "../config/firebase"; // firebase.js with AsyncStorage persistence
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // ✅ No need to navigate manually
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert("Login Error", error.message);
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Please login to continue</Text>

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
              style={[styles.button, styles.loginButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginText}>
                {loading ? "Logging In..." : "Log In"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={styles.accountText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.replace("SignUp")}>
              <Text style={styles.signUpText}>Sign Up</Text>
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
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    width: width * 0.8,
    height: height * 0.65,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 42,
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
  buttonContainer: { width: "100%", marginTop: 20, alignItems: "center" },
  button: {
    width: "80%",
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 15,
    borderEndEndRadius: 25,
    borderStartStartRadius: 25,
  },
  loginButton: { backgroundColor: "#9A2143" },
  loginText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "DMSerifDisplay_400Regular",
  },
  accountText: {
    fontSize: 16,
    color: "#555",
    fontFamily: "DMSerifDisplay_400Regular",
  },
  signUpText: {
    fontSize: 16,
    color: "#9A2143",
    fontFamily: "DMSerifDisplay_400Regular",
  },
});

export default LoginScreen;
