import { FlatList, StyleSheet, Text, View } from "react-native";
import BookItem from "./BookItem";
import { colors, fonts } from "../theme";

export default function BookList({ books, emptyText, onToggle, onDelete }) {
    return (
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Каталог книг</Text>

            {books.length === 0 ? (
                <Text style={styles.emptyText}>{emptyText}</Text>
            ) : (
                <>
                    <Text style={styles.hint}>
                        Торкніться книги, щоб позначити її проданою.
                    </Text>
                    <FlatList
                        data={books}
                        keyExtractor={(item) => item.id}
                        keyboardShouldPersistTaps="handled"
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <BookItem
                                book={item}
                                onToggle={onToggle}
                                onDelete={onDelete}
                            />
                        )}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    sectionTitle: {
        fontFamily: fonts.bold,
        fontSize: 20,
        color: colors.navy,
        marginBottom: 12,
    },
    hint: {
        fontFamily: fonts.italic,
        fontSize: 14,
        color: colors.textMuted,
        marginBottom: 12,
    },
    emptyText: {
        fontFamily: fonts.italic,
        color: colors.textMuted,
        fontSize: 16,
        textAlign: "center",
        padding: 10,
    },
});
