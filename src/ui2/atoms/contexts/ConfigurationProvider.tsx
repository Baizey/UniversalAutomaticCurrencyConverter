import {useSignal} from '@preact/signals'
import {createContext} from 'preact'
import {PropsWithChildren, useContext, useEffect} from 'preact/compat'
import {handleError, useProvider} from '../../../di'
import {DropdownOption} from '../../molecules'

type Props = { symbols: DropdownOption[] }

const Context = createContext<Props>(null as any)

export function ConfigurationProvider({children}: PropsWithChildren) {
    const symbols = useSignal<DropdownOption[] | undefined>(undefined)

    useEffect(() => {
        const {backendApi, config} = useProvider()
        Promise.all([backendApi.symbols(), config.load()])
            .then(([newSymbols]) => symbols.value =
                Object.entries(newSymbols).map(([key, value]) => ({
                    text: `${value} (${key})`,
                    key: key,
                })))
            .catch(handleError)
    }, [])

    const isLoading = !symbols.value
    return isLoading
        ? <></>
        : <Context.Provider value={{symbols: symbols.value}} children={children}/>
}

export function useSymbols(): DropdownOption[] {
    return useContext(Context).symbols
}