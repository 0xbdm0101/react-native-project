import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Providers } from "@/provider";

export default function RootLayout() {
  return (
    <Providers>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </Providers>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
