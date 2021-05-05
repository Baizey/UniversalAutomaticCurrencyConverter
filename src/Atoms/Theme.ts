export type Theme = {
    background: string
    containerBackground: string
    containerBorder: string,

    borderDimFocus: string
    borderFocus: string
    backgroundFocus: string

    normalText: string
    titleText: string
    subtitleText: string
    helperText: string

    link: string
    linkHover: string

    success: string
    error: string
}

export const DarkTheme = {
    background: '#0F171E',

    containerBackground: '#0C131B',
    containerBorder: '#808080',

    borderDimFocus: '#352F24',
    borderFocus: '#f0ad4e',
    backgroundFocus: '#1C232B',

    normalText: '#d0d0d0',
    titleText: '#ffffff',
    subtitleText: '#808080',
    helperText: '#737373',

    link: '#0000FF',
    linkHover: '',

    success: '#00FF00',
    error: '#FF0000',
} as Theme