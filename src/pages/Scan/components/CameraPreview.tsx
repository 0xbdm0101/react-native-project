/**
 * 摄像头预览 + 取景框 + 识别高亮
 * 封装 expo-camera 的 CameraView，叠加取景框 UI
 * 使用 React.memo 避免父组件重渲染时重复渲染原生相机视图
 */

import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { CameraView } from "expo-camera";
import type { BarcodeFormat } from "../constants";
import { COLORS, STYLE_CONFIG, UI_TEXTS } from "../constants";
import type { BarcodeScanningResult } from "expo-camera";

// ==================== Props ====================

interface CameraPreviewProps {
  /** 是否激活相机 */
  isActive: boolean;
  /** 闪光灯是否开启 */
  torchEnabled: boolean;
  /** 支持的码制类型 */
  barcodeTypes: BarcodeFormat[];
  /** 扫码回调 */
  onBarcodeScanned: (result: BarcodeScanningResult) => void;
  /** 高亮区域（识别到码的位置） */
  highlightBounds?: { x: number; y: number; width: number; height: number } | null;
  /** 是否显示扫描提示（超时未识别时） */
  showScanHint?: boolean;
}

// ==================== 组件 ====================

function CameraPreview({
  isActive,
  torchEnabled,
  barcodeTypes,
  onBarcodeScanned,
  highlightBounds,
  showScanHint = false,
}: CameraPreviewProps) {
  return (
    <View style={styles.container}>
      {/* 相机预览 */}
      {isActive && (
        <CameraView
          style={styles.camera}
          facing="back"
          active={isActive}
          enableTorch={torchEnabled}
          barcodeScannerSettings={{
            barcodeTypes: barcodeTypes as any[],
          }}
          onBarcodeScanned={onBarcodeScanned}
        />
      )}

      {/* 半透明遮罩 */}
      <View style={styles.overlay}>
        {/* 上方遮罩 */}
        <View style={styles.overlayTop} />
        {/* 中间：取景框 + 两侧遮罩 */}
        <View style={styles.overlayMiddle}>
          <View style={styles.overlaySide} />
          {/* 取景框 */}
          <View style={styles.viewfinder}>
            {/* 四角边框 */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {/* 识别高亮框 */}
            {highlightBounds && (
              <View
                style={[
                  styles.highlight,
                  {
                    left: highlightBounds.x,
                    top: highlightBounds.y,
                    width: highlightBounds.width,
                    height: highlightBounds.height,
                  },
                ]}
              />
            )}
          </View>
          <View style={styles.overlaySide} />
        </View>
        {/* 下方遮罩 + 提示文字 */}
        <View style={styles.overlayBottom}>
          {showScanHint ? (
            <Text style={styles.hintWarning}>
              {UI_TEXTS.SCAN_FAILED}
            </Text>
          ) : (
            <Text style={styles.hint}>{UI_TEXTS.VIEWFINDER_HINT}</Text>
          )}
          {!torchEnabled && (
            <Text style={styles.lowLightHint}>
              {UI_TEXTS.LOW_LIGHT_HINT}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

// ==================== 样式 ====================

const { VIEWFINDER: VF } = STYLE_CONFIG;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
  },

  // 遮罩层
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: COLORS.BG_OVERLAY,
  },
  overlayMiddle: {
    flexDirection: "row",
    height: VF.width,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: COLORS.BG_OVERLAY,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: COLORS.BG_OVERLAY,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 20,
  },

  // 取景框
  viewfinder: {
    width: VF.width,
    height: VF.height,
    position: "relative",
  },

  // 取景框四角
  corner: {
    position: "absolute",
    width: VF.cornerLength,
    height: VF.cornerLength,
    borderColor: COLORS.VIEWFINDER_CORNER,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: VF.cornerWidth,
    borderLeftWidth: VF.cornerWidth,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: VF.cornerWidth,
    borderRightWidth: VF.cornerWidth,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: VF.cornerWidth,
    borderLeftWidth: VF.cornerWidth,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: VF.cornerWidth,
    borderRightWidth: VF.cornerWidth,
  },

  // 识别高亮
  highlight: {
    position: "absolute",
    borderWidth: 2,
    borderColor: COLORS.HIGHLIGHT,
    borderRadius: 4,
  },

  // 提示文字
  hint: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 14,
    opacity: 0.8,
  },
  hintWarning: {
    color: COLORS.WARNING,
    fontSize: 14,
    fontWeight: "500",
  },
  lowLightHint: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
    marginTop: 8,
    opacity: 0.7,
  },
});

export default memo(CameraPreview);
