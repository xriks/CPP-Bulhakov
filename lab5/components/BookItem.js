import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, fonts } from "../theme";

export default function BookItem({ book, onToggle, onDelete }) {
    const details = [book.author, book.genre, book.publisher, `${book.stock}\u00A0шт`]
        .filter(Boolean)
        .join(" · ");

    return (
        <View style={[styles.item, book.sold && styles.itemDone]}>
            <TouchableOpacity
                style={styles.textArea}
                onPress={() => onToggle(book.id)}
            >
                <Text style={[styles.titleText, book.sold && styles.textDone]}>
                    {book.title}
                </Text>
                <Text style={[styles.detailsText, book.sold && styles.textDone]}>
                    {details}
                </Text>
                {book.description ? (
                    <Text style={[styles.descriptionText, book.sold && styles.textDone]}>
                        {book.description}
                    </Text>
                ) : null}
                <Text style={styles.price}>
                    {book.price} грн
                </Text>
                {book.sold ? <Text style={styles.statusText}>Продано</Text> : null}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDelete(book.id)}
            >
                <Text style={styles.deleteButtonText}>Видалити</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: colors.skySoft,
        borderWidth: 1,
        borderColor: colors.line,
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    itemDone: {
        backgroundColor: colors.line,
    },
    textArea: {
        flex: 1,
    },
    titleText: {
        fontFamily: fonts.bold,
        fontSize: 18,
        color: colors.navy,
        marginBottom: 2,
    },
    detailsText: {
        fontFamily: fonts.regular,
        fontSize: 14,
        color: colors.textMuted,
    },
    descriptionText: {
        fontFamily: fonts.italic,
        fontSize: 14,
        color: colors.textMuted,
        marginTop: 2,
    },
    price: {
        fontFamily: fonts.bold,
        fontSize: 16,
        color: colors.brand,
        marginTop: 6,
    },
    statusText: {
        fontFamily: fonts.boldItalic,
        fontSize: 13,
        color: colors.navy,
        marginTop: 2,
    },
    textDone: {
        textDecorationLine: "line-through",
        opacity: 0.7,
    },
    deleteButton: {
        backgroundColor: colors.danger,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    deleteButtonText: {
        fontFamily: fonts.bold,
        color: colors.white,
        fontSize: 14,
    },
});
