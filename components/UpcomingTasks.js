import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { auth, db } from "../config/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";

const TASK_OPTIONS = [
  { key: "venue", title: "Venue Booking" },
  { key: "photography", title: "Photography" },
  { key: "catering", title: "Catering" },
  { key: "mehendi", title: "Mehendi" },
  { key: "sangeet", title: "Sangeet" },
  { key: "honeymoon", title: "Honeymoon Booking" },
];

const UpcomingTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [chooserOpen, setChooserOpen] = useState(false);

  // edit modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "tasks"),
      where("uid", "==", user.uid),
      where("status", "==", "Pending"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, []);

  // ➕ Add task
  const addSelectedTask = async (opt) => {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, "tasks"), {
      uid: user.uid,
      title: opt.title,
      type: opt.key,
      status: "Pending",
      createdAt: serverTimestamp(),
    });

    setChooserOpen(false);
  };

  // ✅ Mark as completed
  const completeTask = async (taskId) => {
    try {
      await updateDoc(doc(db, "tasks", taskId), { status: "Completed" });
    } catch (err) {
      Alert.alert("Error", "Could not mark as completed");
    }
  };

  // ✏️ Open edit modal
  const openEditModal = (task) => {
    setSelectedTask(task);
    setNewTitle(task.title);
    setEditModalOpen(true);
  };

  // 💾 Save edited task
  const saveTaskEdit = async () => {
    if (!selectedTask) return;

    try {
      await updateDoc(doc(db, "tasks", selectedTask.id), { title: newTitle });
      setEditModalOpen(false);
      setSelectedTask(null);
      setNewTitle("");
    } catch (err) {
      Alert.alert("Error", "Could not update task");
    }
  };

  // ✅ Mark as completed from Edit Modal
  const completeFromEdit = async () => {
    if (!selectedTask) return;
    try {
      await updateDoc(doc(db, "tasks", selectedTask.id), {
        status: "Completed",
      });
      setEditModalOpen(false);
      setSelectedTask(null);
      setNewTitle("");
    } catch (err) {
      Alert.alert("Error", "Could not complete task");
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          <TouchableOpacity onPress={() => setChooserOpen(true)}>
            <MaterialIcons name="add-circle" size={28} color="#9A2143" />
          </TouchableOpacity>
        </View>

        {tasks.length === 0 ? (
          <Text style={styles.noTaskText}>No Upcoming Tasks</Text>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.taskRow}>
                <View>
                  <Text style={styles.taskTitle}>{item.title}</Text>
                  <Text style={styles.taskMeta}>
                    {item.status === "Completed"
                      ? "✅ Completed"
                      : "⏳ Pending"}
                  </Text>
                </View>

                <View style={styles.actionsRow}>
                  {item.status !== "Completed" && (
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => completeTask(item.id)}
                    >
                      <MaterialIcons
                        name="check-circle"
                        size={24}
                        color="green"
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => openEditModal(item)}
                  >
                    <MaterialIcons name="edit" size={24} color="#1E2742" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>

      {/* ➕ Add chooser modal */}
      <Modal visible={chooserOpen} transparent animationType="fade">
        <Pressable
          style={styles.backdrop}
          onPress={() => setChooserOpen(false)}
        >
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>What is this task related to?</Text>
            {TASK_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={styles.optionRow}
                onPress={() => addSelectedTask(opt)}
              >
                <Text style={styles.optionText}>{opt.title}</Text>
                <MaterialIcons name="chevron-right" size={20} color="#9A2143" />
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {/* ✏️ Edit modal */}
      <Modal visible={editModalOpen} transparent animationType="fade">
        <Pressable
          style={styles.backdrop}
          onPress={() => setEditModalOpen(false)}
        >
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Edit Task</Text>
            <TextInput
              style={styles.input}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Task Title"
            />

            <TouchableOpacity style={styles.saveBtn} onPress={saveTaskEdit}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>

            {/* ✅ Mark as Completed Button */}
            <TouchableOpacity
              style={[
                styles.saveBtn,
                { backgroundColor: "green", marginTop: 10 },
              ]}
              onPress={completeFromEdit}
            >
              <Text style={styles.saveText}>Mark as Completed</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { paddingHorizontal: 20, paddingVertical: 5 },
  card: {
    backgroundColor: "#FBF8F2",
    padding: 15,
    borderRadius: 12,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 22, fontFamily: "DMSerifDisplay_400Regular" },
  noTaskText: { marginTop: 10, color: "#666" },

  taskRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskTitle: { fontSize: 18, fontFamily: "DMSerifDisplay_400Regular" },
  taskMeta: { color: "#1E2742", marginTop: 2 },

  actionsRow: { flexDirection: "row" },
  actionBtn: { marginLeft: 12 },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#FBF8F2",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "DMSerifDisplay_400Regular",
    marginBottom: 10,
  },
  optionRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E0D5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    fontFamily: "DMSerifDisplay_400Regular",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: "#9A2143",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "bold" },
});

export default UpcomingTasks;
