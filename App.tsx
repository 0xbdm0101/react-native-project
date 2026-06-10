import { StatusBar } from "expo-status-bar";
import { Providers } from "@/provider";
import { Home } from "@/pages/Home";

export default function App() {
  return (
    <Providers>
      <Home />
      <StatusBar style="auto" />
    </Providers>
  );
}
