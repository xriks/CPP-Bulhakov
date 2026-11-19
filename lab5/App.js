import { useState } from "react";
import { Alert, Platform, ScrollView, StatusBar, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
  Montserrat_700Bold,
  Montserrat_700Bold_Italic,
} from "@expo-google-fonts/montserrat";
import Header from "./components/Header.js";
import BookForm from "./components/BookForm.js";
import BookList from "./components/BookList.js";
import { colors, fonts } from "./theme";

function BookstoreApp() {
  const insets = useSafeAreaInsets();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  function addBook(data) {
    const cleanTitle = data.title.trim();
    const cleanAuthor = data.author.trim();
    const cleanPublisher = data.publisher.trim();
    const cleanDescription = data.description.trim();
    const price = Number(data.price.replace(",", "."));
    const stock = Number(data.stock);

    if (!cleanTitle) {
      Alert.alert("Помилка", "Будь ласка, введіть назву книги.");
      return false;
    }
    if (!cleanAuthor) {
      Alert.alert("Помилка", "Будь ласка, введіть автора.");
      return false;
    }
    if (!Number.isFinite(price) || price <= 0) {
      Alert.alert("Помилка", "Будь ласка, введіть коректну ціну.");
      return false;
    }
    if (data.stock.trim() === "" || !Number.isInteger(stock) || stock < 0) {
      Alert.alert("Помилка", "Будь ласка, введіть коректну кількість.");
      return false;
    }

    const newBook = {
      id: Date.now().toString(),
      title: cleanTitle,
      author: cleanAuthor,
      price,
      genre: data.genre,
      publisher: cleanPublisher,
      stock,
      description: cleanDescription,
      sold: false,
    };
    setBooks((currentBooks) => [newBook, ...currentBooks]);
    Alert.alert("Успіх", "Книгу успішно додано.");
    return true;
  }

  function toggleBook(id) {
    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book.id === id ? { ...book, sold: !book.sold } : book
      )
    );
  }

  function deleteBook(id) {
    setBooks((currentBooks) => currentBooks.filter((book) => book.id !== id));
    Alert.alert("Видалення", "Книгу видалено зі списку.");
  }

  const soldCount = books.filter((book) => book.sold).length;

  const query = search.trim().toLowerCase();
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.genre.toLowerCase().includes(query)
  );

  const emptyText = query
    ? "Нічого не знайдено за вашим запитом."
    : "Книг поки немає. Додайте першу!";

  const topPadding = Math.max(insets.top, Platform.OS === "ios" ? 50 : 0);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.sand }}
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.screen, { paddingTop: topPadding }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          <Header total={books.length} sold={soldCount} />
          <BookForm onAdd={addBook} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Пошук за назвою, автором чи жанром..."
            placeholderTextColor={colors.textMuted}
          />
          <BookList
            books={filteredBooks}
            emptyText={emptyText}
            onToggle={toggleBook}
            onDelete={deleteBook}
          />
        </View>
      </View>
    </ScrollView>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_400Regular_Italic,
    Montserrat_700Bold,
    Montserrat_700Bold_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <BookstoreApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.sand,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.sand,
  },
  searchInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sky,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.navy,
    marginBottom: 16,
  },
});
