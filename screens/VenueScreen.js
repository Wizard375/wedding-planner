import React, { useState } from "react";
import { View, Text, FlatList, TextInput } from "react-native";

const venues = [
  { id: "1", name: "Rosewood Banquet", price: 50000, capacity: 200 },
  { id: "2", name: "Lotus Palace", price: 80000, capacity: 400 },
  { id: "3", name: "Golden Pavilion", price: 120000, capacity: 600 },
];

export default function VenueScreen() {
  const [budget, setBudget] = useState("");
  const [cap, setCap] = useState("");

  const filtered = venues.filter(
    (v) =>
      (!budget || v.price <= parseInt(budget)) &&
      (!cap || v.capacity >= parseInt(cap))
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Max Budget"
        value={budget}
        onChangeText={setBudget}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <TextInput
        placeholder="Min Capacity"
        value={cap}
        onChangeText={setCap}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>
            {item.name} - ₹{item.price} - {item.capacity} guests
          </Text>
        )}
      />
    </View>
  );
}
