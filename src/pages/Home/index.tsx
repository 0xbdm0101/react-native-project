import React, { useRef } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Trans, t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { useLanguage } from "@/provider/I18nProvider";
import { LOCALES } from "@/locales/config";
import DialogComp, { DialogRef } from "@/components/Dialog";

export function Home() {
  const { i18n } = useLingui();
  const { currentLanguage, changeLanguage } = useLanguage();
  const dialogRef = useRef<DialogRef>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>欢迎111</Text>
      <Text style={styles.text}>
        <Trans>欢迎</Trans>
      </Text>
      <Text style={styles.text}>
        <Trans>我是大前端工程师</Trans>
      </Text>
      <Text style={styles.text}>
        <Trans>当前语言: {currentLanguage}</Trans>
      </Text>

      <View style={styles.langRow}>
        <Pressable
          style={[
            styles.langBtn,
            currentLanguage === LOCALES.ZH_CN && styles.langBtnActive,
          ]}
          onPress={() => changeLanguage(LOCALES.ZH_CN)}
        >
          <Text style={styles.langBtnText}>中文</Text>
        </Pressable>

        <Pressable
          style={[
            styles.langBtn,
            currentLanguage === LOCALES.EN_US && styles.langBtnActive,
          ]}
          onPress={() => changeLanguage(LOCALES.EN_US)}
        >
          <Text style={styles.langBtnText}>EN</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.langBtn, { marginTop: 32 }]}
        onPress={() => dialogRef.current?.openDialog()}
      >
        <Text style={styles.langBtnText}>打开弹窗</Text>
      </Pressable>

      <DialogComp ref={dialogRef} title="提示" isShowClose>
        <Text style={{ color: "#000", fontSize: 16 }}>
          {i18n._(t`这是一个 Tamagui 弹窗`)}
        </Text>
      </DialogComp>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  text: {
    color: "#fff",
    fontSize: 18,
  },
  langRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 24,
  },
  langBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#666",
  },
  langBtnActive: {
    borderColor: "#4FC3F7",
    backgroundColor: "rgba(79,195,247,0.15)",
  },
  langBtnText: {
    color: "#fff",
    fontSize: 16,
  },
});
