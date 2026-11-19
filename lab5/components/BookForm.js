import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors, fonts } from "../theme";

const GENRES = ["Класика", "Поезія", "Фентезі", "Фантастика", "Антиутопія", "Детектив", "Казка"];

export default function BookForm({ onAdd }) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [price, setPrice] = useState("");
    const [genre, setGenre] = useState(GENRES[0]);
    const [publisher, setPublisher] = useState("");
    const [stock, setStock] = useState("");
    const [description, setDescription] = useState("");

    function handleAdd() {
        const added = onAdd({ title, author, price, genre, publisher, stock, description });
        if (added) {
            setTitle("");
            setAuthor("");
            setPrice("");
            setPublisher("");
            setStock("");
            setDescription("");
        }
    }

    return (
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Додати нову книгу</Text>

            <TextInput
                style={styles.input}
                placeholder="Назва книги..."
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={setTitle}
                returnKeyType="next"
            />

            <TextInput
                style={styles.input}
                placeholder="Автор..."
                placeholderTextColor={colors.textMuted}
                value={author}
                onChangeText={setAuthor}
                returnKeyType="next"
            />

            <View style={styles.row}>
                <TextInput
                    style={[styles.input, styles.half]}
                    placeholder="Ціна, грн"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="decimal-pad"
                    value={price}
                    onChangeText={setPrice}
                />
                <TextInput
                    style={[styles.input, styles.half]}
                    placeholder="Кількість, шт"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    value={stock}
                    onChangeText={setStock}
                />
            </View>

            <Text style={styles.label}>Жанр:</Text>
            <View style={styles.chips}>
                {GENRES.map((g) => (
                    <TouchableOpacity
                        key={g}
                        style={[styles.chip, genre === g && styles.chipActive]}
                        onPress={() => setGenre(g)}
                    >
                        <Text style={[styles.chipText, genre === g && styles.chipTextActive]}>{g}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TextInput
                style={styles.input}
                placeholder="Видавництво"
                placeholderTextColor={colors.textMuted}
                value={publisher}
                onChangeText={setPublisher}
            />

            <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Опис"
                placeholderTextColor={colors.textMuted}
                value={description}
                onChangeText={setDescription}
                onSubmitEditing={handleAdd}
                returnKeyType="done"
                blurOnSubmit
                multiline
            />

            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                <Text style={styles.addButtonText}>Додати книгу</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
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
    label: {
        fontFamily: fonts.italic,
        fontSize: 14,
        color: colors.textMuted,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.sky,
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        fontFamily: fonts.regular,
        marginBottom: 12,
        backgroundColor: colors.white,
        color: colors.navy,
    },
    textarea: {
        minHeight: 80,
        textAlignVertical: "top",
    },
    row: {
        flexDirection: "row",
        gap: 12,
    },
    half: {
        flex: 1,
    },
    chips: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 12,
        gap: 8,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.sky,
        alignItems: "center",
        backgroundColor: colors.white,
    },
    chipActive: {
        backgroundColor: colors.brand,
        borderColor: colors.brand,
    },
    chipText: {
        fontFamily: fonts.regular,
        fontSize: 14,
        color: colors.brand,
    },
    chipTextActive: {
        fontFamily: fonts.bold,
        color: colors.white,
    },
    addButton: {
        backgroundColor: colors.brand,
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 4,
    },
    addButtonText: {
        fontFamily: fonts.bold,
        color: colors.white,
        fontSize: 16,
    },
});
