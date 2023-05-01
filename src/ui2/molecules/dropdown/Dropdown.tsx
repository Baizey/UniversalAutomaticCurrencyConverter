import {Signal, useSignal} from '@preact/signals'
import {useEffect} from 'preact/compat'
import {Pixel, Size} from '../../atoms/utils/Size'
import {css, Div, DivProps, List, ListProps, mergeStyling} from "@baizey/styled-preact";
import {ReadonlyInput, TextInput, useTheme} from "../../atoms";


const Container = ({children, ...props}: DivProps) => <Div
    {...props}
    style={{
        margin: '0 auto',
        position: 'relative',
    }}>{children}</Div>

const maxDisplayedItems = 3

type DropdownListProps = ListProps & {
    isVisible: boolean,
    location?: DropdownListLocation,
    totalOptions: number
}
const DropdownList = ({children, isVisible, totalOptions, location, styling}: DropdownListProps) =>
    <List
        children={children}
        styling={mergeStyling(styling, css`
          display: ${isVisible ? '' : 'none'};
          position: absolute;
          width: auto;
          top: ${location === DropdownListLocation.top
                  ? Pixel.of(-Math.min(maxDisplayedItems, totalOptions) * (Size.field - 1))
                  : Pixel.fieldWithUnderline};
          filter: brightness(110%);
          left: 0;
          right: 0;
          padding: 0;
          margin: 0;
          list-style: none;
          background-color: #fff;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
          z-index: 1;
          max-height: ${Pixel.of(maxDisplayedItems * Size.field)};
          overflow: auto;
          border-bottom-width: ${location === DropdownListLocation.top ? Pixel.zero : Pixel.one};
          border-top-width: ${location === DropdownListLocation.top ? Pixel.one : Pixel.zero};
          border-left-width: ${Pixel.one};
          border-right-width: ${Pixel.one};
        }`)}/>

export enum DropdownListLocation {
    top = 'top',
    bottom = 'bottom'
}

export type DropdownOption = {
    key: string
    text: string
}

type Props = {
    options: DropdownOption[]
    initialValue: string
    onSelection: (option: string) => void
    listLocation?: DropdownListLocation
}

function isPossible(query: string, option: DropdownOption): boolean {
    return option.key.toLowerCase().includes(query)
        || option.text.toLowerCase().includes(query)
}

export function Dropdown({
                             options,
                             initialValue,
                             onSelection,
                             listLocation = DropdownListLocation.bottom,
                         }: Props) {
    const selectedOption = options.filter(e => e.key === initialValue)[0]
    const isFocused = useSignal(0)
    const query = useSignal('')
    const selected = useSignal(selectedOption?.text)

    const visibleOptions = options.filter(option => isPossible(query.value, option))
    const handleSelection = (option: DropdownOption) => {
        onSelection(option.key)
        selected.value = option.text
        query.value = ''
        isFocused.value = 0
    }

    useEffect(() => {
        const selectedOption = options.filter(e => e.key === initialValue)[0]
        selected.value = selectedOption?.text
    }, [initialValue])

    useEffect(() => {
        if (!isFocused.value) return
        const handler = (e: KeyboardEvent) => {
            if (e.key !== 'Enter') return
            const choice = visibleOptions[0]
            if (!choice) return
            handleSelection(choice)
        }
        document.addEventListener('keyup', handler)
        return () => document.removeEventListener('keyup', handler)
    }, [isFocused.value, visibleOptions])

    const inputField = <DropdownInput selectedValue={selected} isFocused={isFocused} query={query}/>
    return (
        <Container
            onfocusin={() => isFocused.value = 1 + Math.random()}>
            {listLocation === DropdownListLocation.top && inputField}
            <DropdownOptions isFocused={isFocused}
                             visibleOptions={visibleOptions}
                             listLocation={listLocation}
                             handleSelection={handleSelection}/>
            {listLocation === DropdownListLocation.bottom && inputField}
        </Container>
    )
}

function DropdownOptions({isFocused, visibleOptions, listLocation, handleSelection}: {
    isFocused: Signal<number>,
    visibleOptions: DropdownOption[],
    listLocation?: DropdownListLocation,
    handleSelection: (option: DropdownOption) => void
}) {
    const options = visibleOptions.map(option => <ReadonlyInput
        value={option.text}
        onClick={() => handleSelection(option)}
    />)
    return <DropdownList isVisible={!!isFocused.value}
                         location={listLocation}
                         totalOptions={visibleOptions.length}
                         children={options}/>
}

function DropdownInput({isFocused, query, selectedValue}: {
    isFocused: Signal<number>,
    selectedValue: Signal<string>
    query: Signal<string>
}) {
    const currentValue = isFocused.value
    return <TextInput
        onfocusout={() => {
            setTimeout(() => {
                if (isFocused.value === currentValue) isFocused.value = 0
            }, 150)
        }}
        placeholder={selectedValue.value}
        placeholderColor={useTheme().normalText}
        value={query.value}
        onValueChange={value => query.value = value}
    />
}