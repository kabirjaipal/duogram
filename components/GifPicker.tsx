import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import { debounce } from "@/lib/functions";

const TENOR_API_KEY = "AIzaSyAY8XK11md7xVhlwHOdwFPdsgaHZeBNWjs";
const TENOR_BASE_URL = "https://g.tenor.com/v2";

interface GifPickerProps {
  onGifSelect: (url: string) => void;
  onClose: () => void;
}

interface Gif {
  id: string;
  media_formats: { tinygif: { url: string } };
}

interface Category {
  name: string;
  searchterm: string;
  image: string;
}

const GifPicker: React.FC<GifPickerProps> = ({ onGifSelect }) => {
  const { theme } = useThemeContext();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchGifs = async (query: string, page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${TENOR_BASE_URL}/search?q=${query}&key=${TENOR_API_KEY}&limit=20&page=${page}`
      );
      const data = await response.json();
      if (data && data.results) {
        if (page === 1) {
          setGifs(data.results);
        } else {
          setGifs((prevGifs) => [...prevGifs, ...data.results]);
        }
        setHasMore(data.results.length > 0);
      } else {
        setGifs([]);
      }
    } catch (error) {
      console.error("Error fetching GIFs:", error);
      setGifs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${TENOR_BASE_URL}/categories?key=${TENOR_API_KEY}`
      );
      const data = await response.json();
      if (data && data.tags) {
        setCategories(data.tags);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchGifs(selectedCategory.searchterm, 1);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setSelectedCategory(null); // Clear category selection
      fetchGifs(searchQuery, 1);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    setSelectedCategory(null); // Clear category selection
    fetchGifs(searchQuery, 1);
  };

  const handleCategorySelect = (category: Category) => {
    setSearchQuery(""); // Clear the search query
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const loadMoreGifs = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchGifs(
          searchQuery.trim() || selectedCategory?.searchterm || "",
          nextPage
        );
        return nextPage;
      });
    }
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 300), [
    searchQuery,
  ]);

  return (
    <View style={[styles.container, { backgroundColor: theme.primaryColor }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            { color: theme.textColor, borderColor: theme.secondaryColor },
          ]}
          placeholder="Search GIFs"
          placeholderTextColor={theme.textColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={debouncedHandleSearch} // Trigger search on submit with debounce
        />
      </View>
      {!searchQuery.trim() && !selectedCategory ? (
        <FlatList
          ListHeaderComponent={() => (
            <Text style={[styles.headerText, { color: theme.textColor }]}>
              Categories
            </Text>
          )}
          data={categories}
          keyExtractor={(item) => item.searchterm}
          numColumns={3}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => handleCategorySelect(item)}
            >
              <View style={styles.categoryImageContainer}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.categoryImage}
                />
                <Text style={[styles.categoryText, { color: theme.textColor }]}>
                  {item.name.replace(/#/g, "")}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View>
          {selectedCategory && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToCategories}
            >
              <Text style={[styles.backButtonText, { color: theme.textColor }]}>
                Back to Categories
              </Text>
            </TouchableOpacity>
          )}
          {loading && !gifs.length ? (
            <ActivityIndicator size="large" color={theme.secondaryColor} />
          ) : (
            <FlatList
              ListHeaderComponent={() => (
                <Text style={[styles.headerText, { color: theme.textColor }]}>
                  {selectedCategory
                    ? `GIFs for ${selectedCategory.name}`
                    : `Search Results for "${searchQuery}"`}
                </Text>
              )}
              data={gifs}
              keyExtractor={(item) => item.id}
              numColumns={3}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.gifItem}
                  onPress={() => onGifSelect(item.media_formats.tinygif.url)}
                >
                  <Image
                    source={{ uri: item.media_formats.tinygif.url }}
                    style={styles.gifImage}
                  />
                </TouchableOpacity>
              )}
              onEndReached={loadMoreGifs}
              onEndReachedThreshold={0.5}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#36393F", // Discord dark mode background
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 10,
    paddingBottom: 5,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4F545C", // Discord search input border color
    fontSize: 16,
    backgroundColor: "#2F3136", // Discord search input background
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFFFFF", // White text color for headers
  },
  categoryItem: {
    flex: 1,
    margin: 8,
    borderRadius: 10,
    overflow: "hidden", // Ensure image corners are rounded
  },
  categoryImageContainer: {
    position: "relative",
    borderRadius: 10,
    overflow: "hidden", // Ensure image corners are rounded
  },
  categoryImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  categoryText: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF", // White text color
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark overlay for better text readability
  },
  gifItem: {
    flex: 1 / 3,
    padding: 5,
  },
  gifImage: {
    width: "100%",
    height: Dimensions.get("window").width / 3 - 10,
    borderRadius: 10,
  },
  backButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#4F545C", // Match Discord's button background
    alignItems: "center",
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF", // White text color for the button
  },
});

export default GifPicker;
