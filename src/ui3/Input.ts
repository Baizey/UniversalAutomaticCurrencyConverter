import { DelayAction } from "./DelaySave";
import { createDiv } from "./Utils";

export type NumberInputProps = {
    align?: 'left' | 'center' | 'right';
    placeholder?: string;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    onChange: ( value: number ) => void;
};

export type TextInputProps = {
    align?: 'left' | 'center' | 'right';
    placeholder?: string;
    value?: string;
    readonly?: boolean;
    onChange: ( value: string ) => void;
};

export type TextClickInputProps = {
    align?: 'left' | 'center' | 'right';
    placeholder?: string;
    value?: string;
    readonly?: boolean;
    onClick: ( self: HTMLDivElement ) => void;
};

export type ShortcutInputProps = {
    align?: "left" | "center" | "right";
    value?: string;
    onChange: ( shortcut: string ) => void;
};

export type DropdownOption = { value: string; label: string };
export type DropdownProps = {
    value?: DropdownOption,
    align?: 'left' | 'center' | 'right';
    options: DropdownOption[];
    onChange: ( option: DropdownOption ) => void;
};

export type MultiSelectProps = {
    title: string
    subtitle?: string
    align?: 'left' | 'center' | 'right';
    options: DropdownOption[];
    selected: string[]
    onChange: ( selected: string[] ) => void;
};

export type ToggleProps = {
    value?: boolean;
    onChange: ( checked: boolean ) => void;
};
export type InputWrapperProps = {
    value: HTMLDivElement;
    title: string
    subtitle?: string
};

export type InputRowWrapperProps = {
    values: HTMLDivElement[]
}

export type EverExpandingListProps = {
    values: string[];
    placeholder?: string;
    onChange: ( values: string[] ) => void;
};

export interface ButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    variant?: "primary" | "secondary" | "ternary" | "warning";
}

export interface ButtonGroupProps {
    values: HTMLDivElement[];
}

export class Input {

    static createButtonGroup( { values }: ButtonGroupProps ) {
        const realWrap = createDiv()
        realWrap.className = 'uacc-button-group-wrap'

        const wrapper = realWrap.appendChild( document.createElement( "div" ) )
        wrapper.className = "uacc-button-group";
        values.forEach( button => {
            const wrap = createDiv()
            wrap.style.width = `calc(100% / ${ values.length })`
            wrap.appendChild( button )
            wrapper.appendChild( wrap )
        } );
        return realWrap;
    }

    static createWrapperRow( { values }: InputRowWrapperProps ) {
        const root = document.createElement( "div" );
        root.className = values.length > 1
            ? "uacc-input-row-wrapper"
            : "uacc-input-row-wrapper-solo";

        const gap = 5 / values.length

        const each = 100 / values.length - (values.length > 1 ? gap : 0)


        values.forEach( value => {
            const wrap = root.appendChild( document.createElement( "div" ) );
            wrap.style.width = `${ each }%`;
            wrap.style.alignItems = "baseline";
            wrap.appendChild( value )
        } );
        return root
    }

    static createWrapper( { title, subtitle, value }: InputWrapperProps ): HTMLDivElement {
        const div = document.createElement( "div" );
        div.className = "uacc-input-wrapper";

        // Title
        const titleEl = document.createElement( "div" );
        titleEl.className = "uacc-input-wrapper-title";
        titleEl.textContent = title;

        // Input container
        const inputContainer = document.createElement( "div" );
        inputContainer.className = "uacc-input-wrapper-input";
        inputContainer.appendChild( value );

        // Subtitle
        const subtitleEl = document.createElement( "div" );
        subtitleEl.className = "uacc-input-wrapper-subtitle";
        subtitleEl.textContent = subtitle ?? "";

        div.appendChild( titleEl );
        div.appendChild( inputContainer );
        div.appendChild( subtitleEl );
        return div;
    }

    static createMultiSelect( { onChange, align, options, selected, title, subtitle }: MultiSelectProps ) {
        const container = document.createElement( "div" );
        container.className = "uacc-everlist";

        let values: { value: string, element: HTMLDivElement }[] = []

        function addRow( input: DropdownOption ) {
            const wrap = { value: input.value, element: null as any as HTMLDivElement }
            wrap.element = Input.createTextClick( {
                value: `${ input.label } (${ input.value })`,
                readonly: true,
                onClick: ( self ) => {
                    self.remove()
                    values = values.filter( e => e !== wrap )
                    onChange( values.map( e => e.value ) )
                }
            } )
            values.push( wrap )
            container.appendChild( wrap.element )
        }

        container.appendChild( Input.createWrapper( {
            title, subtitle,
            value: this.createDropdown( {
                align,
                options: options.map( e => ({ value: e.value, label: `${ e.label }` }) ),
                onChange: value => {
                    // No duplicates
                    if ( values.map( e => e.value ).includes( value.value ) )
                        return
                    addRow( value )
                    onChange( values.map( e => e.value ) )
                }
            } )
        } ) )

        selected
            .map( it => options.find( e => it === e.value ) )
            .forEach( e => {
                if ( e ) addRow( e )
            } );

        values.forEach( i => container.appendChild( i.element ) )
        return container;
    }

    static createToggle( { value, onChange }: ToggleProps ): HTMLDivElement {
        const div = document.createElement( "div" );
        div.className = "uacc-toggle-wrapper";

        // Build toggle
        const label = document.createElement( "label" );
        label.className = "uacc-toggle";

        const input = document.createElement( "input" );
        input.type = "checkbox";
        input.className = "uacc-toggle-input";
        input.checked = value ?? false;

        const track = document.createElement( "span" );
        track.className = "uacc-toggle-track";

        const thumb = document.createElement( "span" );
        thumb.className = "uacc-toggle-thumb";

        track.appendChild( thumb );
        label.appendChild( input );
        label.appendChild( track );

        div.appendChild( label );
        input.addEventListener( "change", () => {
            onChange?.( input.checked );
        } );
        return div;
    }

    static createDropdown( { value, align, options, onChange }: DropdownProps ) {
        const div = document.createElement( "div" );
        div.className = "uacc-dropdown-wrapper";

        // Search input
        const input = document.createElement( "input" );
        input.type = "text";
        input.className = "uacc-search-input";
        input.placeholder = value?.label ?? "";
        input.style.textAlign = align ?? "center";

        // Dropdown container
        const dropdown = document.createElement( "div" );
        dropdown.className = "uacc-dropdown";

        let filteredItems: DropdownOption[] = [ ...options ];
        let selectedIndex = 0;

        function renderDropdown() {
            dropdown.innerHTML = "";
            if ( filteredItems.length === 0 ) {
                const empty = document.createElement( "div" );
                empty.className = "uacc-dropdown-empty";
                empty.textContent = "No results";
                dropdown.appendChild( empty );
                dropdown.style.display = "block";
                return;
            }

            filteredItems.forEach( ( item, i ) => {
                const el = document.createElement( "div" );
                el.className = "uacc-dropdown-item";
                if ( i === selectedIndex ) el.classList.add( "uacc-selected" );
                el.textContent = item.label;
                el.addEventListener( "mousedown", () => {
                    input.placeholder = item.label; // show selected label
                    input.value = ""; // clear input
                    dropdown.style.display = "none";
                    onChange( item );
                } );
                dropdown.appendChild( el );
            } );
            dropdown.style.display = "block";
        }

        function updateDropdown( query: string ) {
            filteredItems = options.filter( i =>
                i.label.toLowerCase().includes( query )
                || i.value.toLowerCase().includes( query )
            );
            selectedIndex = 0;
            renderDropdown();
        }

        input.addEventListener( "input", () => updateDropdown( input.value.toLowerCase() ) );

        input.addEventListener( "focus", () => updateDropdown( input.value.toLowerCase() ) );

        input.addEventListener( "blur", () => {
            setTimeout( () => {
                dropdown.style.display = "none";
            }, 150 );
        } );

        input.addEventListener( "keydown", ( e ) => {
            if ( dropdown.style.display === "none" ) return;
            if ( e.key === "ArrowDown" ) {
                selectedIndex = (selectedIndex + 1) % filteredItems.length;
                renderDropdown();
                e.preventDefault();
            } else if ( e.key === "ArrowUp" ) {
                selectedIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
                renderDropdown();
                e.preventDefault();
            } else if ( e.key === "Enter" ) {
                if ( filteredItems.length > 0 ) {
                    const selected = filteredItems[selectedIndex];
                    input.placeholder = selected.label;
                    input.value = "";
                    dropdown.style.display = "none";
                    onChange( selected );
                    e.preventDefault();
                }
            }
        } );

        div.appendChild( input );
        div.appendChild( dropdown );
        return div;
    }

    static createNumberInput( { placeholder, align, value, min, max, step, onChange }: NumberInputProps ) {
        const div = document.createElement( "div" );
        div.className = "uacc-text-input-wrapper";

        // Number input
        const input = document.createElement( "input" );
        input.type = "number";
        input.className = "uacc-text-input";
        input.placeholder = placeholder ?? "";
        input.style.textAlign = align ?? "center";
        if ( min ) input.min = min.toString()
        if ( max ) input.max = max.toString()
        if ( step ) input.step = step.toString()
        if ( value ) input.value = value.toString()

        // Font family and weight
        input.style.fontFamily = "'Inter', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        input.style.fontWeight = "500"; // semi-bold for readability
        input.style.fontSize = "20px";
        input.style.lineHeight = "48px"; // centers text in 50px row

        input.addEventListener( "input", ( e ) => {
            onChange?.( Number( (e.target as HTMLInputElement).value ) );
        } );
        div.appendChild( input );
        return div;
    }

    static createTextInput( { align, placeholder, value, onChange, readonly }: TextInputProps ) {
        const div = document.createElement( "div" );
        div.className = "uacc-text-input-wrapper";

        // Text input
        const input = document.createElement( "input" );
        input.type = "text";
        input.className = "uacc-text-input";
        input.placeholder = placeholder ?? "";
        input.value = value ?? "";
        input.readOnly = readonly ?? false;

        // Text alignment
        input.style.textAlign = align ?? "center";

        // Font family and weight
        input.style.fontFamily = "'Inter', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        input.style.fontWeight = "500";
        input.style.fontSize = "20px";
        input.style.lineHeight = "48px";

        div.appendChild( input );

        input.addEventListener( "input", ( e ) => {
            onChange?.( (e.target as HTMLInputElement).value );
        } );
        return div;
    }

    static createTextClick( { align, placeholder, value, onClick, readonly }: TextClickInputProps ) {
        const div = document.createElement( "div" );
        div.className = "uacc-text-input-wrapper";

        // Text input
        const input = document.createElement( "input" );
        input.type = "text";
        input.classList.add( 'uacc-text-input-click', "uacc-text-input" );
        input.placeholder = placeholder ?? "";
        input.value = value ?? "";
        input.readOnly = readonly ?? false;

        // Text alignment
        input.style.textAlign = align ?? "center";

        // Font family and weight
        input.style.fontFamily = "'Inter', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        input.style.fontWeight = "500";
        input.style.fontSize = "20px";
        input.style.lineHeight = "48px";

        div.appendChild( input );

        input.addEventListener( "click", () => {
            onClick( div )
        } )
        return div;
    }

    static createShortcutInput( { value, onChange, align }: ShortcutInputProps ) {
        const div = document.createElement( "div" );
        div.className = "uacc-text-input-wrapper";

        const input = document.createElement( "input" );
        input.type = "text";
        input.className = "uacc-text-input";
        input.readOnly = true;
        input.value = value ?? "";
        input.style.textAlign = align ?? "center";
        input.style.fontFamily = "'Inter', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        input.style.fontWeight = "500";
        input.style.fontSize = "20px";
        input.style.lineHeight = "48px";

        div.appendChild( input );

        function formatShortcut( e: KeyboardEvent ) {
            const keys: string[] = [];
            if ( e.ctrlKey ) keys.push( "Ctrl" );
            if ( e.shiftKey ) keys.push( "Shift" );
            if ( e.altKey ) keys.push( "Alt" );
            if ( e.metaKey ) keys.push( "Meta" );

            // Exclude modifier-only events
            if ( ![ "Control", "Shift", "Alt", "Meta" ].includes( e.key ) ) {
                keys.push( e.key.length === 1 ? e.key.toUpperCase() : e.key );
            }

            return keys.join( "+" );
        }

        function handleKeyDown( e: KeyboardEvent ) {
            if ( e.key === "Escape" ) {
                input.blur();
                return;
            }
            const shortcut = formatShortcut( e );
            input.value = shortcut;
            onChange?.( shortcut );
            e.preventDefault();
        }

        input.addEventListener( "focus", () => {
            input.value = ''
            onChange( '' )
            document.addEventListener( "keydown", handleKeyDown );
        } );

        input.addEventListener( "blur", () => {
            document.removeEventListener( "keydown", handleKeyDown );
        } );
        return div
    }

    static createButton( { label, onClick, disabled, variant }: ButtonProps ) {
        const div = document.createElement( "div" );
        div.className = "uacc-button-wrapper";

        const button = document.createElement( "button" );
        button.className = `uacc-button uacc-button-${ variant ?? "primary" }`;
        button.textContent = label ?? "Click me";
        button.disabled = disabled ?? false;

        if ( disabled ) {
            button.classList.add( "uacc-button-disabled" );
        }

        // Click handler
        button.addEventListener( "click", () => {
            if ( !button.disabled ) {
                onClick?.();
            }
        } );

        div.appendChild( button );
        return div;
    }

    static createEverExpandingList( {
                                        values: initialValues,
                                        placeholder,
                                        onChange
                                    }: EverExpandingListProps ): HTMLDivElement {
        // Outer wrapper for the list placed inside .uacc-input-wrapper-input
        const container = document.createElement( "div" );
        container.className = "uacc-everlist";

        const delay = new DelayAction()

        function delayedSave() {
            values = values.filter( ( e, i ) => {
                if ( i === values.length - 1 ) return true
                const isEmpty = e.value === ''
                if ( isEmpty ) e.element!!.remove()
                return !isEmpty
            } );
            const saving = values
                .map( e => e.value )
                .filter( e => e )
            onChange( saving );
        }

        function addNewEmpty() {
            const item = {
                value: "",
                element: null as HTMLDivElement | null,
            }
            let first = true
            item.element = Input.createTextInput( {
                placeholder: placeholder,
                onChange: c => {
                    delay.cancel()
                    item.value = c
                    if ( first ) {
                        first = false
                        addNewEmpty()
                    }
                    delay.delayedSave( () => delayedSave() )
                }
            } )
            values.push( item )
            container.appendChild( item.element )
        }

        let values = initialValues.map( e => {
            const wrap = { value: e, element: null as HTMLDivElement | null }
            wrap.element = Input.createTextInput( {
                value: e,
                onChange: c => {
                    delay.cancel()
                    wrap.value = c
                    delay.delayedSave( () => delayedSave() )
                }
            } )
            return wrap
        } );
        values.forEach( i => container.appendChild( i.element!! ) )
        addNewEmpty()

        return container;
    }
}