import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StatusBar,
} from "react-native";
import { auth, db } from "../config/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import UpcomingTasks from "../components/UpcomingTasks";
import WeddingCard from "../components/WeddingCard";
import BudgetCard from "../components/BudgetCard";
import TaskList from "../components/TaskList";

const { width } = Dimensions.get("window");

const ChecklistScreen = () => {
  const [username, setUsername] = useState("");
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUsername(currentUser.displayName || currentUser.email?.split("@")[0]);
    }
  }, []);

  return (
    <FlatList
      data={[]}
      renderItem={null}
      keyExtractor={() => "dummy"}
      ListHeaderComponent={
        <View style={styles.container}>
          <StatusBar
            barStyle="light-content"
            translucent
            backgroundColor="transparent"
          />

          {/* Top Banner */}
          <ImageBackground
            source={require("../assets/images/welcome.png")}
            style={styles.header}
            resizeMode="cover"
          >
            <View style={styles.headerContent}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.helloText}>Hello, {username}!</Text>
              <View style={styles.subTextContainer}>
                <Text style={styles.subText}>
                  Add a detailed profile to get personalised suggestions
                </Text>
              </View>
              <TouchableOpacity style={styles.profileButton}>
                <Text style={styles.profileButtonText}>Set up Profile</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>

          {/* Upcoming Section */}
          <UpcomingTasks />

          {/* Wedding & Budget */}
          <View style={styles.statsRow}>
            <WeddingCard />
            <BudgetCard />
          </View>

          {/* Tasks */}
          <TaskList />

          {/* Vendors */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vendors</Text>
            <FlatList
              data={[
                { name: "Decor", image: require("../assets/images/decor.jpg") },
                {
                  name: "Makeup",
                  image: require("../assets/images/makeup.jpg"),
                },
                {
                  name: "Caterer",
                  image: require("../assets/images/caterer.jpg"),
                },
                {
                  name: "Clothing",
                  image: require("../assets/images/clothing.jpg"),
                },
              ]}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.vendorItem}>
                  <Image source={item.image} style={styles.vendorImage} />
                  <Text style={styles.vendorText}>{item.name}</Text>
                </View>
              )}
            />
          </View>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { width: "100%", height: 350, justifyContent: "center" },
  headerContent: {
    padding: 10,
    width: "80%",
    marginStart: 20,
    marginTop: -40,
  },
  welcomeText: {
    fontSize: 18,
    color: "#1E2742",
    fontFamily: "DMSerifDisplay_400Regular",
  },
  helloText: {
    fontSize: 36,
    color: "#1E2742",
    fontFamily: "Comforter_400Regular",
  },
  subText: { fontSize: 12, color: "#1E2742", marginBottom: 5 },
  subTextContainer: { width: "60%" },
  profileButton: {
    backgroundColor: "#9A2143",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderStartStartRadius: 15,
    borderEndEndRadius: 15,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  profileButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "DMSerifDisplay_400Regular",
    textAlign: "center",
  },
  section: { paddingHorizontal: 20, paddingVertical: 5 },
  sectionTitle: {
    fontSize: 25,
    marginBottom: 10,
    fontFamily: "DMSerifDisplay_400Regular",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  vendorItem: { marginRight: 15, alignItems: "center" },
  vendorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  vendorText: { marginTop: 5, marginBottom: 20 },
});

export default ChecklistScreen;
