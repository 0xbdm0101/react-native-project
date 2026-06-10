import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Providers } from "@/provider";

export default function App() {
  return (
    <Providers>
      <View style={styles.container}>
        <Text style={styles.text}>Open up App.tsx to start working on your app!</Text>
        <Text style={styles.text}>Hello 我是大前端工程师。</Text>
        <StatusBar style="auto" />
      </View>
    </Providers>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
  },
});
