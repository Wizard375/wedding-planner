import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { auth, db } from "../config/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const taskImages = {
  venue: require("../assets/images/venue.jpg"),
  photography: require("../assets/images/photography.jpg"),
  catering: require("../assets/images/catering.jpg"),
  mehendi: require("../assets/images/mehndi.jpg"),
  sangeet: require("../assets/images/sangeet.webp"),
  honeymoon: require("../assets/images/honemoon.webp"),
  default: require("../assets/images/food.webp"),
};

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "tasks"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, []);

  if (tasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No tasks found</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tasks</Text>
      <FlatList
        data={tasks}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.taskItem}
            onPress={() => {
              if (item.type === "venue") {
                navigation.navigate("VenueList");
              } else {
                navigation.navigate("TaskDetail", { task: item });
              }
            }}
          >
            <Image
              source={taskImages[item.type] || taskImages.default}
              style={styles.taskImage}
            />
            <Text style={styles.taskName}>{item.title}</Text>
            <Text
              style={
                item.status === "Completed"
                  ? styles.taskStatusCompleted
                  : styles.taskStatus
              }
            >
              {item.status}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: { paddingHorizontal: 20, paddingVertical: 5 },
  sectionTitle: {
    fontSize: 25,
    marginBottom: 10,
    fontFamily: "DMSerifDisplay_400Regular",
  },
  taskItem: { marginRight: 20, alignItems: "center", marginTop: 10 },
  taskImage: {
    width: 100,
    height: 100,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  taskName: { marginTop: 5, fontWeight: "600" },
  taskStatus: { color: "orange" },
  taskStatusCompleted: { color: "green" },
  emptyContainer: { paddingHorizontal: 20, paddingVertical: 10 },
});

export default TaskList;
