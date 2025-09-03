import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const dummyVenues = [
  {
    id: "1",
    name: "Bloom Hotel",
    image: require("../assets/images/venue2.jpg"),
    rating: 4.9,
    reviews: 111,
  },
  {
    id: "2",
    name: "The Royal Palace",
    image: require("../assets/images/venue1.jpg"),
    rating: 4.8,
    reviews: 95,
  },
  {
    id: "3",
    name: "Sunset Resort",
    image: require("../assets/images/venue3.jpg"),
    rating: 4.7,
    reviews: 88,
  },
];

const categories = ["Top Rated", "Resorts", "Banquet Halls", "Farmhouses"];

const VenueListScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState("Top Rated");

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Bookings</Text>
        <TouchableOpacity>
          <Text style={styles.citySelector}>Agra ▼</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Section with Curved Background */}
      <View style={styles.heroWrapper}>
        <Image
          source={require("../assets/images/venue-bg.png")}
          style={styles.heroBg}
        />
        <View style={styles.heroContent}>
          <Image
            source={require("../assets/images/agra.png")}
            style={styles.heroImage}
          />
        </View>
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pick your Venue</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.categoryBtn,
              selectedCategory === cat && styles.categoryBtnActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Venue Cards */}
      <FlatList
        data={dummyVenues}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>
              ⭐ {item.rating} ({item.reviews} reviews)
            </Text>
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    marginBottom: 10,
    zIndex: 10,
    gap: 10,
    marginTop: 10,
  },
  headerText: {
    fontSize: 20,
    fontFamily: "DMSerifDisplay_400Regular",
    color: "#222",
  },
  citySelector: {
    fontSize: 16,
    color: "#9A2143",
    fontWeight: "600",
  },

  heroWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  heroBg: {
    width: "100%",
    height: 270,
    resizeMode: "cover",
    position: "absolute",
  },
  heroContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  heroImage: {
    width: 180,
    height: 100,
    resizeMode: "contain",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingStart: 15,
    paddingEnd: 20,
    marginBottom: 20,

    alignItems: "baseline",
  },
  sectionTitle: {
    fontSize: 26,
    fontFamily: "DMSerifDisplay_400Regular",
    color: "#222",
    marginTop: 60,
  },
  viewAll: {
    fontSize: 14,
    color: "#9A2143",
    fontWeight: "600",
    marginTop: 15,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    marginRight: 10,
  },
  categoryBtnActive: { backgroundColor: "#9A2143" },
  categoryText: { fontSize: 14, color: "#555" },
  categoryTextActive: { color: "#fff", fontWeight: "600" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 10,
    width: 200,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 120 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingTop: 8,
    fontFamily: "DMSerifDisplay_400Regular",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#666",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});

export default VenueListScreen;
