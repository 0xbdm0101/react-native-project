import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SearchInput } from "./components/SearchInput";
import { HotTags } from "./components/HotTags";
import { HistoryList } from "./components/HistoryList";
import { HOT_TAGS, HISTORY_LIST } from "./constants";

export function Search() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  return (
    <View style={styles.container}>
      <SearchInput
        value={keyword}
        onChangeText={setKeyword}
        onCancel={() => router.back()}
      />
      <HotTags tags={HOT_TAGS} onPressTag={setKeyword} />
      <HistoryList list={HISTORY_LIST} onPressItem={setKeyword} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
