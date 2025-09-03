import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TaskDetailScreen = ({ route }) => {
  const { task } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.meta}>Type: {task.type}</Text>
      <Text style={styles.meta}>Status: {task.status}</Text>
      <Text style={styles.meta}>
        Created At: {task.createdAt?.toDate?.().toLocaleString?.() || "N/A"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  meta: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default TaskDetailScreen;
