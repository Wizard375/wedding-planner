import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

const AuthScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require("../assets/images/bg-image.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Down the Aisle</Text>
          <Text style={styles.subtitle}>
            Have the wedding of your dreams without giving up on your dreams,
            All your wedding planning needs in one place.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.signupButton]}
              onPress={() => navigation.navigate("SignUp")}
            >
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
  buttonContainer: {
    width: "100%",
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 15,
    borderEndEndRadius: 25,
    borderStartStartRadius: 25,
  },
  loginButton: {
    backgroundColor: "#9A2143",
  },
  signupButton: {
    backgroundColor: "#FBF8F2",
    borderWidth: 1,
    borderColor: "#9A2143",
  },
  loginText: {
    fontSize: 18,
    color: "#ffff",
    fontFamily: "DMSerifDisplay_400Regular",
  },
  signUpText: {
    fontSize: 18,
    color: "#000",
    fontFamily: "DMSerifDisplay_400Regular",
  },
});

export default AuthScreen;
