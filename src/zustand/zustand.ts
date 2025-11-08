import { create } from "zustand";
/* eslint-disable */

export type GridMode = "Center" | "Quarters" | "Thirds";

export type GuidelinesMode = "Measure" | "Mirror";
export type GuidelineColour = "Pink" | "Grey" | "White" | "Black";

export function incrementGridlines(current: number) {
  const max = 10;
  if (current < max) {
    return current + 1;
  } else {
    return 1;
  }
}
export function decrementGridlines(current: number) {
  const max = 10;
  if (current > 1) {
    return current - 1;
  } else {
    return max;
  }
}
export const guidelineModeSwitch: { [key: string]: GuidelinesMode } = {
  Measure: "Mirror",
  Mirror: "Measure",
};

export const guidelinesSwitch: { [key: string]: GuidelineColour } = {
  Pink: "Grey",
  Grey: "White",
  White: "Black",
  Black: "Pink",
};
export function convertLineColourString(stringIn: string) {
  return stringIn === "Pink" ? "#FF00FF" : stringIn.toLowerCase();
}
export type GuidelineUnits = "px" | "rem" | "%" | "-";
export const guidelinesUnitsSwitch: { [key: string]: GuidelineUnits } = {
  "-": "px",
  px: "rem",
  rem: "%",
  "%": "-",
};

export type OnClickMode =
  | "Normal"
  | "Guidelines"
  | "Peek"
  | "Xray"
  | "Grid"
  | "FontSize"
  | "Edit";

export const onClickSwitch: { [key: string]: OnClickMode } = {
  Grid: "Normal",
  Normal: "Edit",
  Edit: "Guidelines",
  Guidelines: "Peek",
  Peek: "Xray",
  Xray: "FontSize",
  FontSize: "Grid",
};
export const onClickSwitchDown: { [key: string]: OnClickMode } = {
  Normal: "Grid",
  Edit: "Normal",
  Guidelines: "Edit",
  Peek: "Guidelines",
  Xray: "Peek",
  FontSize: "Xray",
  Grid: "FontSize",
};

export interface ZustandInterface {
  showContents: boolean;
  guidelines: boolean;
  grid: boolean;
  showFontSize: boolean;
  refreshFontSize: boolean;
  peek: boolean;
  xray: boolean;
  pointerEvents: boolean;
  darkMode: boolean;
  onClick: OnClickMode;
  guidelineMode: GuidelinesMode;
  guidelineColour: GuidelineColour;
  gridlineColour: GuidelineColour;
  guidelineUnits: GuidelineUnits;
  gridMode: GridMode;
  gridSegments: number;
  hash: string;
  screenWidth: number;
  accessLevel: string;
}

export const useStore = create<ZustandInterface>((set) => ({
  onClick: "Normal",
  guidelines: false,
  guidelineColour: "Pink",
  gridlineColour: "Pink",
  guidelineMode: "Measure",
  guidelineUnits: "-",
  grid: false,
  gridMode: "Center",
  gridSegments: 1,
  hash: "",
  showFontSize: false,
  refreshFontSize: false,
  xray: false,
  screenWidth: 0,
  peek: false,
  showContents: true,
  pointerEvents: true,
  accessLevel: "dev",
  darkMode: true,
}));
