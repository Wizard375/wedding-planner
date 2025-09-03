import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { auth, db } from "../config/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

const msPerDay = 1000 * 60 * 60 * 24;

export default function WeddingCard() {
  const [weddingDate, setWeddingDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const user = auth.currentUser;

  // Load saved weddingDate from Firestore
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const ref = doc(db, "users", user.displayName);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().weddingDate) {
        setWeddingDate(snap.data().weddingDate.toDate());
      }
    };
    fetchData();
  }, [user]);

  const onChange = async (event, selectedDate) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      selectedDate.setHours(0, 0, 0, 0);
      setWeddingDate(selectedDate);

      if (user) {
        const ref = doc(db, "users", user.displayName);
        await setDoc(ref, { weddingDate: selectedDate }, { merge: true });
      }
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysLeft = weddingDate
    ? Math.max(0, Math.ceil((weddingDate - today) / msPerDay))
    : null;

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={() => setShowPicker(true)}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Wedding</Text>
          <MaterialIcons name="chevron-right" size={18} color="#9A2143" />
        </View>

        <View style={styles.centerRow}>
          <Text style={styles.bigNumber}>
            {daysLeft !== null ? daysLeft : "--"}
          </Text>
          <Text style={styles.bigLabel}>Days</Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.statSub}>
            {weddingDate
              ? weddingDate.toLocaleDateString()
              : "Set your wedding date"}
          </Text>
          <MaterialIcons name="calendar-today" size={16} color="#555" />
        </View>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={weddingDate || new Date()}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FBF8F2",
    padding: 14,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: "space-between",
    height: 150,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  centerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginVertical: 8,
  },
  bigNumber: {
    fontSize: 44,
    color: "#BFA054",
    fontFamily: "DMSerifDisplay_400Regular",
    marginTop: -10,
  },
  bigLabel: {
    fontSize: 16,
    color: "#BFA054",
    marginLeft: 6,
    marginBottom: 6,
    fontFamily: "DMSerifDisplay_400Regular",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statSub: {
    fontSize: 12,
    color: "#1E2742",
  },
});
