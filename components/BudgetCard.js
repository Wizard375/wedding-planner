import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { auth, db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  useFonts,
  DMSerifDisplay_400Regular,
} from "@expo-google-fonts/dm-serif-display";

// Format numbers in Indian style
function formatIndianNumber(num) {
  if (!num || isNaN(num)) return "—";

  const n = parseFloat(num);
  if (n >= 10000000) {
    return `₹${(n / 10000000).toFixed(0)} Cr`;
  } else if (n >= 100000) {
    return `₹${(n / 100000).toFixed(0)} Lakh`;
  } else if (n >= 1000) {
    return `₹${(n / 1000).toFixed(0)} K`;
  }
  return `₹${n}`;
}

export default function BudgetCard() {
  const [total, setTotal] = useState("");
  const [spent, setSpent] = useState("");
  const [splits, setSplits] = useState({
    venue: "50",
    catering: "30",
    decor: "20",
  });
  const [showModal, setShowModal] = useState(false);

  const user = auth.currentUser;

  const [fontsLoaded] = useFonts({
    DMSerifDisplay_400Regular,
  });

  // Load saved budget from Firestore
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const ref = doc(db, "users", user.displayName);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        if (data.budgetTotal) setTotal(data.budgetTotal.toString());
        if (data.budgetSpent) setSpent(data.budgetSpent.toString());
        if (data.budgetSplits) setSplits(data.budgetSplits);
      }
    };
    fetchData();
  }, [user]);

  const saveBudget = async () => {
    const totalSplit =
      parseFloat(splits.venue) +
      parseFloat(splits.catering) +
      parseFloat(splits.decor);

    if (totalSplit !== 100) {
      Alert.alert("Error", "Percentages must add up to 100%");
      return;
    }

    if (!user) return;
    const ref = doc(db, "users", user.displayName);
    await setDoc(
      ref,
      {
        budgetTotal: parseFloat(total) || 0,
        budgetSpent: parseFloat(spent) || 0,
        budgetSplits: splits,
      },
      { merge: true }
    );
    setShowModal(false);
  };

  const numericTotal = parseFloat(total) || 0;
  const numericSpent = parseFloat(spent) || 0;
  const percent =
    numericTotal > 0 ? Math.round((numericSpent / numericTotal) * 100) : 0;

  const allocations = [
    {
      label: "Venue",
      percent: parseFloat(splits.venue) || 0,
      amount: (numericTotal * (parseFloat(splits.venue) || 0)) / 100,
    },
    {
      label: "Catering",
      percent: parseFloat(splits.catering) || 0,
      amount: (numericTotal * (parseFloat(splits.catering) || 0)) / 100,
    },
    {
      label: "Décor",
      percent: parseFloat(splits.decor) || 0,
      amount: (numericTotal * (parseFloat(splits.decor) || 0)) / 100,
    },
  ];

  if (!fontsLoaded) {
    return null; // wait for font
  }

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={() => setShowModal(true)}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Budget</Text>
          <MaterialIcons name="chevron-right" size={18} color="#9A2143" />
        </View>

        <View style={styles.centerRow}>
          <Text style={styles.bigNumber}>{percent}%</Text>
          <Text style={styles.bigLabel}>Spent</Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.statSub}>
            {formatIndianNumber(numericSpent)} of{" "}
            {numericTotal > 0 ? formatIndianNumber(numericTotal) : "—"}
          </Text>
          <MaterialCommunityIcons name="cash" size={20} color="#555" />
        </View>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Budget Calculator</Text>

            {/* Budget Inputs */}
            <TextInput
              value={total}
              onChangeText={setTotal}
              placeholder="Total Budget"
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              value={spent}
              onChangeText={setSpent}
              placeholder="Amount Spent"
              keyboardType="numeric"
              style={styles.input}
            />

            {/* Split Inputs */}
            <Text style={styles.splitTitle}>Allocation Percentages</Text>
            <View style={styles.splitRow}>
              <Text style={styles.splitLabel}>Venue</Text>
              <TextInput
                value={splits.venue}
                onChangeText={(v) => setSplits({ ...splits, venue: v })}
                keyboardType="numeric"
                style={styles.splitInput}
              />
              <Text>%</Text>
            </View>
            <View style={styles.splitRow}>
              <Text style={styles.splitLabel}>Catering</Text>
              <TextInput
                value={splits.catering}
                onChangeText={(v) => setSplits({ ...splits, catering: v })}
                keyboardType="numeric"
                style={styles.splitInput}
              />
              <Text>%</Text>
            </View>
            <View style={styles.splitRow}>
              <Text style={styles.splitLabel}>Décor</Text>
              <TextInput
                value={splits.decor}
                onChangeText={(v) => setSplits({ ...splits, decor: v })}
                keyboardType="numeric"
                style={styles.splitInput}
              />
              <Text>%</Text>
            </View>

            {/* Show Allocations */}
            {numericTotal > 0 && (
              <View style={{ marginTop: 12 }}>
                <Text style={styles.splitTitle}>Suggested Allocation</Text>
                {allocations.map((a) => (
                  <View key={a.label} style={styles.splitRow}>
                    <Text style={styles.splitLabel}>
                      {a.label} ({a.percent}%)
                    </Text>
                    <Text style={styles.splitValue}>
                      {formatIndianNumber(a.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Buttons */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={[styles.btn, styles.btnLight]}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={saveBudget}
                style={[styles.btn, styles.btnPrimary]}
              >
                <Text style={{ color: "#fff" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  cardFooter: { flexDirection: "row", justifyContent: "space-between" },
  statSub: {
    fontSize: 12,
    color: "#1E2742",
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "86%",
    backgroundColor: "#FBF8F2",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "DMSerifDisplay_400Regular",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E4D7C3",
  },

  splitTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
  },
  splitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  splitLabel: {
    fontSize: 13,
    color: "#444",
    flex: 1,
  },
  splitInput: {
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 6,
    width: 60,
    marginHorizontal: 8,
    textAlign: "center",
  },
  splitValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9A2143",
  },

  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 8,
  },
  btnLight: { backgroundColor: "#eee" },
  btnPrimary: { backgroundColor: "#9A2143" },
});
