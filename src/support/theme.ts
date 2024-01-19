import { theme } from "antd";
import { ColorScheme, darkenHexColor, lightenHexColor } from "./colorSupport";

export const cqTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorBgBase: ColorScheme.SPRINGWOOD,
    colorBgContainer: ColorScheme.SPRINGWOOD,
    colorBgLayout: ColorScheme.SPRINGWOOD,
    colorBorderSecondary: darkenHexColor(ColorScheme.STONE, 10),
    colorFill: ColorScheme.SHIPGRAY,
    colorError: ColorScheme.POMEGRANATE,
    colorErrorActive: lightenHexColor(ColorScheme.POMEGRANATE, 10),
    colorErrorBg: darkenHexColor(ColorScheme.POMEGRANATE, 10),
    colorErrorBgHover: lightenHexColor(ColorScheme.POMEGRANATE, 5),
    colorErrorBorder: darkenHexColor(ColorScheme.POMEGRANATE, 5),
    colorLink: ColorScheme.RUST,
    colorPrimary: ColorScheme.SEABUCKTHORN,
    colorPrimaryBg: darkenHexColor(ColorScheme.SEABUCKTHORN, 20),
    colorSuccess: ColorScheme.SUSHI,
    colorTextBase: ColorScheme.SHIPGRAY,
    colorWarning: ColorScheme.CALIFORNIA,
    screenXS: 320,
    screenXSMin: 320,
    screenXSMax: 639,
    screenSM: 640,
    screenSMMin: 640,
    screenSMMax: 767,
  },
  components: {
    Alert: {
      colorInfoBg: lightenHexColor(ColorScheme.SEABUCKTHORN, 75),
      colorInfoBorder: lightenHexColor(ColorScheme.SEABUCKTHORN, 50),
    },
    Badge: {
      colorBgContainer: ColorScheme.SPRINGWOOD,
      colorBorderBg: ColorScheme.SPRINGWOOD,
      colorError: ColorScheme.SUSHI,
    },
    Button: {
      primaryColor: ColorScheme.SHIPGRAY,
      textHoverBg: ColorScheme.SHIPGRAY,
      borderColorDisabled: lightenHexColor(ColorScheme.STONE, 50),
      defaultBg: lightenHexColor(ColorScheme.SHIPGRAY, 90),
      defaultBorderColor: lightenHexColor(ColorScheme.SHIPGRAY, 50),
    },
    Card: {
      actionsBg: ColorScheme.SEABUCKTHORN,
    },
    Checkbox: {
      colorBorder: ColorScheme.STONE,
    },
    Collapse: {
      headerBg: ColorScheme.SEABUCKTHORN,
      colorBorder: ColorScheme.CALIFORNIA,
    },
    Descriptions: {
      padding: 8,
      titleMarginBottom: 8,
    },
    Divider: {
      colorSplit: ColorScheme.SEABUCKTHORN,
      lineWidth: 2,
      verticalMarginInline: 0,
      margin: 0,
      marginLG: 0,
    },
    FloatButton: {
      colorBgElevated: ColorScheme.SEABUCKTHORN,
    },
    Form: {
      itemMarginBottom: 8,
      colorError: ColorScheme.POMEGRANATE,
    },
    Input: {
      colorBorder: lightenHexColor(ColorScheme.STONE, 50),
      activeBg: "#FFF",
      colorBgContainer: "#FFF",
      colorText: ColorScheme.SHIPGRAY,
    },
    InputNumber: {
      colorBorder: ColorScheme.STONE,
    },
    Layout: {
      headerBg: ColorScheme.SHIPGRAY,
      headerPadding: "16px",
      footerBg: ColorScheme.SHIPGRAY,
      footerPadding: "16px",
    },
    List: {
      colorBorder: ColorScheme.STONE,
    },
    Modal: {
      colorIconHover: ColorScheme.SHIPGRAY,
    },
    Notification: {
      colorBgElevated: ColorScheme.SEABUCKTHORN,
      paddingMD: 16,
      paddingContentHorizontalLG: 16,
    },
    Radio: {
      colorBorder: ColorScheme.STONE,
    },
    Select: {
      colorBorder: ColorScheme.STONE,
    },
    Statistic: { contentFontSize: 72 },
    Tooltip: {
      colorBgSpotlight: ColorScheme.SHIPGRAY,
      colorText: ColorScheme.SEABUCKTHORN,
    },
  },
};
