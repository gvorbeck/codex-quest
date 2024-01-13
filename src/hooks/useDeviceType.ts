import { useMediaQuery } from "react-responsive";
import {
  mobileBreakpoint,
  tabletBreakpoint,
  desktopBreakpoint,
} from "../support/stringSupport";

export const useDeviceType = () => {
  const isMobile = useMediaQuery({ query: mobileBreakpoint });
  const isTablet = useMediaQuery({ query: tabletBreakpoint });
  const isDesktop = useMediaQuery({ query: desktopBreakpoint });

  return { isMobile, isTablet, isDesktop };
};
