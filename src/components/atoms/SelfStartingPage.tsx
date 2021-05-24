import * as React from 'react';
import {useEffect, useState} from 'react';
import {ThemeProvider, useTheme} from 'styled-components';
import {MyTheme, themes, useProvider} from '../../infrastructure';

type SelfStartingPageProps = {
    Child: React.ReactNode &
        ((props: {
            isLoading: boolean,
            setTheme: React.Dispatch<React.SetStateAction<keyof typeof themes>>,
            symbols: { value: string, label: string }[]
        }) => JSX.Element)
}

export function SelfStartingPage({Child}: SelfStartingPageProps) {
    const {configuration, colorTheme, backendApi} = useProvider();
    const theme = useTheme() as MyTheme;
    const [isLoading, setIsLoading] = useState(true);
    const [symbols, setSymbols] = useState<{ label: string, value: string }[]>([])
    const [, setTheme] = useState(colorTheme.value as keyof typeof themes)

    useEffect(() => {
        configuration.load()
            .then(() => setTheme(colorTheme.value as keyof typeof themes))
            .then(async () => {
                const symbols = await backendApi.symbols()
                setSymbols(Object.entries(symbols).map(([k, v]) => ({label: `${v} (${k})`, value: k})))
            })
            .then(() => setIsLoading(false))
    }, [])

    return <ThemeProvider theme={theme}>
        <Child symbols={symbols} isLoading={isLoading} setTheme={setTheme}/>
    </ThemeProvider>
}