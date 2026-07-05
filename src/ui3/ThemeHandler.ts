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
    primary: '#2563EB',
    secondary: '#475569',
    ternary: '#E2E8F0',
    warning: '#DC2626',
    title: '#0F172A',
    text: '#334155',
    background1: '#F8FAFC',
    background2: '#FFFFFF',
    background3: '#F1F5F9',
} satisfies ThemeColors;
const darkTheme = {
    primary: '#2563EB',
    secondary: '#334155',
    ternary: '#1E293B',
    warning: '#EF4444',
    title: '#F8FAFC',
    text: '#CBD5E1',
    background1: '#0F172A',
    background2: '#111827',
    background3: '#1E293B',
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