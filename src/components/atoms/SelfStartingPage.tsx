import * as React from 'react';
import {useEffect, useState} from 'react';
import {ThemeProvider} from 'styled-components';
import {mapToTheme, themes, useProvider} from '../../infrastructure';

type SelfStartingPageProps = {
    Child: React.ReactNode &
        ((props: {
            isLoading: boolean,
            setTheme: React.Dispatch<React.SetStateAction<keyof typeof themes>>,
            symbols: { value: string, label: string }[]
        }) => JSX.Element)
}

export function SelfStartingPage({Child}: SelfStartingPageProps) {
    const {configuration, colorTheme, backendApi, logger} = useProvider();
    const [isLoading, setIsLoading] = useState(true);
    const [symbols, setSymbols] = useState<{ label: string, value: string }[]>([])
    const [theme, setTheme] = useState(colorTheme.value as keyof typeof themes)

    useEffect(() => {
        configuration.load()
            .then(async () => {
                setTheme(colorTheme.value as keyof typeof themes)

                const symbols = await backendApi.symbols()
                setSymbols(Object.entries(symbols).map(([k, v]) => ({label: `${v} (${k})`, value: k})))

                setIsLoading(false)
            })
            .catch(err => logger.error(err))
    }, [])

    return <ThemeProvider theme={mapToTheme(theme)}>
        <Child symbols={symbols} isLoading={isLoading} setTheme={setTheme}/>
    </ThemeProvider>
}