import { theme } from "antd";
import { ColorScheme, darkenHexColor, lightenHexColor } from "./colorSupport";

export const cqDarkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorBgBase: ColorScheme.SHIPGRAY,
    colorBgContainer: ColorScheme.SHIPGRAY,
    colorBgLayout: lightenHexColor(ColorScheme.SHIPGRAY, 10),
    colorBorderSecondary: lightenHexColor(ColorScheme.STONE, 10),
    colorFill: ColorScheme.SPRINGWOOD,
    colorError: ColorScheme.POMEGRANATE,
    colorErrorActive: lightenHexColor(ColorScheme.POMEGRANATE, 10),
    colorErrorBg: darkenHexColor(ColorScheme.POMEGRANATE, 10),
    colorErrorBgHover: lightenHexColor(ColorScheme.POMEGRANATE, 5),
    colorErrorBorder: darkenHexColor(ColorScheme.POMEGRANATE, 5),
    colorLink: lightenHexColor(ColorScheme.SEABUCKTHORN, 0),
    colorPrimary: ColorScheme.SEABUCKTHORN,
    colorPrimaryBg: darkenHexColor(ColorScheme.SEABUCKTHORN, 20),
    colorInfo: ColorScheme.SEABUCKTHORN,
    colorSuccess: ColorScheme.SUSHI,
    colorTextBase: ColorScheme.SPRINGWOOD,
    colorWarning: ColorScheme.CALIFORNIA,
    screenXS: 320,
    screenXSMin: 320,
    screenXSMax: 639,
    screenSM: 640,
    screenSMMin: 640,
    screenSMMax: 767,
  },
  components: {
    Card: {
      actionsBg: ColorScheme.CALIFORNIA,
      colorTextDescription: lightenHexColor(ColorScheme.SHIPGRAY, 20),
      colorBorderSecondary: darkenHexColor(ColorScheme.SHIPGRAY, 10),
    },
    Collapse: {
      headerBg: ColorScheme.SEABUCKTHORN,
      colorBorder: ColorScheme.CALIFORNIA,
      colorTextHeading: ColorScheme.SHIPGRAY,
      contentBg: lightenHexColor(ColorScheme.SHIPGRAY, 25),
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
      colorText: ColorScheme.SHIPGRAY,
      colorSplit: ColorScheme.CALIFORNIA,
    },
    Form: {
      itemMarginBottom: 8,
      colorError: ColorScheme.POMEGRANATE,
    },
    Layout: {
      headerBg: darkenHexColor(ColorScheme.SHIPGRAY, 50),
      headerPadding: "16px",
      footerBg: darkenHexColor(ColorScheme.SHIPGRAY, 50),
      footerPadding: "16px",
    },
    Notification: {
      colorBgElevated: ColorScheme.SEABUCKTHORN,
      paddingMD: 16,
      paddingContentHorizontalLG: 16,
      colorText: ColorScheme.SHIPGRAY,
      colorTextHeading: ColorScheme.SHIPGRAY,
    },
    Statistic: { contentFontSize: 72 },
  },
};
