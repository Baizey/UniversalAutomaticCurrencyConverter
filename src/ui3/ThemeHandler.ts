import {useProvider} from "../di";

export interface ThemeColors {
    primary: string;
    secondary: string;
    ternary: string;
    warning: string;
    title: string;
    text: string;
    background1: string;
    background2: string,
    background3: string,
}

const lightTheme = {
    primary: '#1E40AF',
    secondary: '#2F6FE4',
    ternary: '#F3F4F6',
    warning: '#DC2626',
    title: '#111827',
    text: '#111827',
    background1: '#FFFFFF',
    background2: '#F9FAFB',
    background3: '#F9FAFB',
} satisfies ThemeColors;
const darkTheme = {
    primary: '#FACC15',
    secondary: '#CA8A04',
    ternary: '#374151',
    warning: '#EF4444',
    title: '#F9FAFB',
    text: '#E5E7EB',
    background1: '#0B0F17',
    background2: '#0E131E',
    background3: '#0E131E',
} satisfies ThemeColors;

export class ThemeHandler {
    private static theme: ThemeColors = lightTheme;
    private static name: string = 'lightTheme';

    private static themeNames = ['lightTheme', 'darkTheme'];
    private static themes = [lightTheme, darkTheme];

    static getThemeNames() {
        return this.themeNames
    }

    static swapTheme() {
        const next = (this.themeNames.indexOf(this.name) + 1) % this.themes.length;
        this.updateTheme(this.themeNames[next])
    }

    static updateTheme(useTheme?: string) {
        this.name = useTheme ?? useProvider().metaConfig.colorTheme.value
        this.theme = this.themes[this.themeNames.indexOf(this.name)]
        document.body.style.setProperty("--uacc-primary", this.theme.primary);
        document.body.style.setProperty("--uacc-secondary", this.theme.secondary);
        document.body.style.setProperty("--uacc-ternary", this.theme.ternary);
        document.body.style.setProperty("--uacc-warning", this.theme.warning);
        document.body.style.setProperty("--uacc-title", this.theme.title);
        document.body.style.setProperty("--uacc-text", this.theme.text);
        document.body.style.setProperty("--uacc-background1", this.theme.background1);
        document.body.style.setProperty("--uacc-background2", this.theme.background2);
        document.body.style.setProperty("--uacc-background3", this.theme.background3);
    }
}

(() => {
    ThemeHandler.swapTheme();
})()