/**
 * PageHeader — 子页面通用头部组件
 *
 * 使用场景：
 * - 默认（返回+标题+占位）: <PageHeader title="..." />
 * - 返回+标题+右侧按钮:     <PageHeader title="..." right={<Btn />} titleCentered />
 * - 返回+标题+条件右侧按钮:  <PageHeader title="..." right={cond ? <Btn /> : undefined} />
 */
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { StyleProp, TextStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { PAGE_HEADER_STYLE as S } from "./constants";

export interface PageHeaderProps {
  /** 页面标题 */
  title: string;
  /** 自定义返回逻辑，默认 router.back() */
  onBack?: () => void;
  /** 右侧插槽；不传则渲染 40px 占位 View 保持标题居中 */
  right?: React.ReactNode;
  /** 标题是否 flex:1 + textAlign:center（右侧有真实按钮时开启） */
  titleCentered?: boolean;
  /** 覆盖标题样式 */
  titleStyle?: StyleProp<TextStyle>;
}

export function PageHeader({
  title,
  onBack,
  right,
  titleCentered = false,
  titleStyle,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = onBack ?? (() => router.back());

  const titleStyles: StyleProp<TextStyle>[] = [styles.title];
  if (titleCentered && right) {
    titleStyles.push(styles.titleCentered);
  }
  if (titleStyle) {
    titleStyles.push(titleStyle);
  }

  return (
    <View style={styles.header}>
      <Pressable onPress={handleBack} style={styles.backBtn}>
        <Ionicons
          name={S.BACK_ICON_NAME}
          size={S.BACK_ICON_SIZE}
          color={S.BACK_ICON_COLOR}
        />
      </Pressable>

      <Text style={titleStyles} numberOfLines={1}>
        {title}
      </Text>

      {right ?? <View style={styles.placeholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: S.CONTAINER_PADDING_HORIZONTAL,
    paddingTop: S.CONTAINER_PADDING_TOP,
    paddingBottom: S.CONTAINER_PADDING_BOTTOM,
    backgroundColor: S.HEADER_BG_COLOR,
  },
  backBtn: {
    padding: S.BACK_BTN_PADDING,
  },
  title: {
    color: S.TITLE_COLOR,
    fontSize: S.TITLE_FONT_SIZE,
    fontWeight: S.TITLE_FONT_WEIGHT,
  },
  titleCentered: {
    flex: 1,
    textAlign: "center",
    marginHorizontal: 12,
  },
  placeholder: {
    width: S.PLACEHOLDER_WIDTH,
  },
});
