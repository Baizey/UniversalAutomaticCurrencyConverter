import { MyTheme } from "./MyTheme";
import { lightTheme } from "./LightTheme";
import { darkTheme } from "./DarkTheme";

export const themes = { lightTheme, darkTheme };

export type ThemeProps = { theme: MyTheme }

export const mapToTheme = (theme: keyof typeof themes): MyTheme => themes[theme] || lightTheme;