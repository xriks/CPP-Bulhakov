import { StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../theme";

export default function Header({ total, sold }) {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.title}>Букварня</Text>
            <Text style={styles.stats}>
                Усього книг: {total} · Продано: {sold}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        marginBottom: 24,
    },
    title: {
        fontFamily: fonts.header,
        fontSize: 36,
        letterSpacing: 1,
        color: colors.brand,
        textAlign: "center",
        marginBottom: 4,
    },
    stats: {
        fontFamily: fonts.italic,
        fontSize: 16,
        color: colors.textMuted,
        textAlign: "center",
    },
});
