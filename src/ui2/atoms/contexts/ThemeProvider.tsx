import {useSignal} from '@preact/signals'
import {createContext} from 'preact'
import {PropsWithChildren, useContext, useEffect} from 'preact/compat'
import {useProvider} from '../../../di'
import {mapToTheme, MyTheme, themes} from '../../../infrastructure'
import {css, StyledTheme} from "@baizey/styled-preact";
import {Percent, Pixel} from "../utils";

type ThemeType = keyof typeof themes

type ThemeProviderProps = {
    themeName: ThemeType
    changeTheme: (theme: ThemeType) => void
    theme: MyTheme
};

const Context = createContext<ThemeProviderProps>({
    themeName: 'darkTheme',
    changeTheme: () => undefined,
    theme: themes.darkTheme
})
const updateGlobalStyle = (theme: MyTheme) => {
    StyledTheme.style = {
        input: css`
          height: ${Pixel.halfField};
          line-height: ${Pixel.halfField};
          border-bottom-width: ${Pixel.one};
          appearance: none;
          width: ${Percent.all};

          &::placeholder {
            color: ${theme.normalText};
          };

          &:hover {
            border-color: ${theme.formBorderFocus};
          };

          &:focus {
            outline: none;
            background-color: ${theme.containerBackground};
            border-color: ${theme.formBorderFocus};
          };
        `,
        shared: css`
          background-color: ${theme.containerBackground};
          color: ${theme.normalText};
          border-color: ${theme.formBorder};
          transition: border-color 0.2s ease-in-out;
          border: 0 solid ${theme.formBorder};
          font-family: Calibri, monospace;
          font-size: ${Pixel.medium};
          font-weight: 500;
          text-align: center;
          text-align-last: center;
          appearance: none;
          margin: 0 auto;
          padding: 0;
          border-radius: 0;
          box-shadow: none;
          outline: none;
          vertical-align: auto;

          &:focus {
            outline: none;
            box-shadow: none;
          };
        `
    }
}

export function UACCThemeProvider({children}: PropsWithChildren) {
    const {metaConfig: {colorTheme}} = useProvider()
    const theme = useSignal<ThemeType>(colorTheme.value)
    updateGlobalStyle(mapToTheme(theme.value))
    useEffect(() => {
        theme.value = colorTheme.value
        updateGlobalStyle(mapToTheme(theme.value))
    }, [colorTheme.value])
    const changeTheme = (t: ThemeType) => {
        colorTheme.setValue(t)
    }
    return <Context.Provider value={{
        changeTheme,
        themeName: theme.value,
        theme: mapToTheme(theme.value),
    }} children={children}/>
}

export const useTheme = () => useContext(Context).theme;

export const useChangeTheme = (type: ThemeType) => useContext(Context).changeTheme(type);