import { createTamagui } from "tamagui";
import { config as baseConfig } from "@tamagui/config";
import { createInterFont } from "@tamagui/font-inter";

const interFont = createInterFont();

const tamaguiConfig = createTamagui({
  ...baseConfig,
  fonts: {
    ...baseConfig.fonts,
    body: interFont,
    heading: interFont,
  },
});

export type TamaguiConfig = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends TamaguiConfig {}
}

export default tamaguiConfig;
