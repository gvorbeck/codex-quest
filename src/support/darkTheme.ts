import { theme } from "antd";
import { ColorScheme, darkenHexColor, lightenHexColor } from "./colorSupport";

export const cqDarkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorBgBase: ColorScheme.SHIPGRAY,
    colorBgContainer: ColorScheme.SHIPGRAY,
    colorBgLayout: ColorScheme.SHIPGRAY,
  },
  components: {
    Layout: {
      headerBg: ColorScheme.SPRINGWOOD,
    },
  },
};
