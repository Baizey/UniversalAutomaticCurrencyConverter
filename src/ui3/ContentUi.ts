import { CompactCurrencyLocalization } from "../currencyConverter/Localization/ActiveLocalization";
import { useProvider } from "../di";
import { TabMessage, TabMessageType } from "../infrastructure";
import { Icons } from "./Icons";
import { DropdownOption, Input } from "./Input";
import { createDiv } from "./Utils";

type AlertSectionProps = {
    title: string;
    onDismiss: () => void;
    children: HTMLDivElement[];
};

type LocalizationChoiceProps = {
    title: string;
    selected: boolean;
    values: string[];
    onClick: () => void;
};

export class ContentUi {
    private readonly root: HTMLDivElement;
    private showLocalization: boolean;
    private showMenu: boolean = false;
    private useDetectedLocalization: boolean = true;
    private symbols: Record<string, string> | null = null;
    private symbolsPromise: Promise<Record<string, string>> | null = null;

    constructor( root: HTMLDivElement ) {
        this.root = root;
        this.showLocalization = useProvider().activeLocalization.hasConflict();
    }

    static mount( root: HTMLDivElement ): ContentUi {
        const ui = new ContentUi( root );
        ui.mount();
        return ui;
    }

    mount(): void {
        this.root.setAttribute( "uacc:watched", "true" );
        this.registerMessageListener();
        this.render();
    }

    private registerMessageListener(): void {
        const { browser } = useProvider();
        browser.runtime.onMessage.addListener( ( data: TabMessage, sender, sendResponse ) => {
            if ( data?.type !== TabMessageType.openContextMenu ) return false;
            this.showMenu = true;
            this.render();
            sendResponse( { success: true, data: undefined } );
            return true;
        } );
    }

    private render(): void {
        const { tabState } = useProvider();
        this.root.innerHTML = "";

        const shouldShowLocalization = this.showLocalization && tabState.isAllowed;
        if ( !this.showMenu && !shouldShowLocalization ) return;

        const container = createDiv();
        container.className = "uacc-content-alert-container";
        container.appendChild( this.createTitle() );

        if ( shouldShowLocalization ) container.appendChild( this.createLocalizationAlert() );
        if ( this.showMenu ) container.appendChild( this.createMenuAlert() );

        this.root.appendChild( container );
    }

    private createTitle(): HTMLDivElement {
        const { browser } = useProvider();
        const title = createDiv();
        title.className = "uacc-content-title";
        title.textContent = browser.extensionName;
        return title;
    }

    private createAlertSection( { title, onDismiss, children }: AlertSectionProps ): HTMLDivElement {
        const section = createDiv();
        section.className = "uacc-alert-section";

        const dismiss = createDiv();
        dismiss.className = "uacc-alert-dismiss uacc-icon-button uacc-icon-button-danger";
        dismiss.appendChild( Icons.close() );
        dismiss.addEventListener( "click", onDismiss );

        const inner = createDiv();
        inner.className = "uacc-alert-inner";

        const header = createDiv();
        header.className = "uacc-alert-header";
        header.textContent = title;
        inner.appendChild( header );

        children.forEach( child => inner.appendChild( child ) );
        section.appendChild( dismiss );
        section.appendChild( inner );
        return section;
    }

    private createMenuAlert(): HTMLDivElement {
        return this.createAlertSection( {
            title: "Context menu",
            onDismiss: () => {
                this.showMenu = false;
                this.render();
            },
            children: [
                this.createMenuGroup( [ this.createAllowanceControls() ] ),
                this.createMenuGroup( [ this.createConversionsControls() ] ),
                this.createMenuGroup( [ this.createGroupHeader( "Current page localization" ), this.createPageLocalizationControls() ] ),
                this.createMenuGroup( [ this.createConvertToControls() ] ),
            ]
        } );
    }

    private createLocalizationAlert(): HTMLDivElement {
        const { activeLocalization, tabState } = useProvider();
        const detectedValues = [
            activeLocalization.krone.hasConflict() ? activeLocalization.krone.detectedValue : "",
            activeLocalization.dollar.hasConflict() ? activeLocalization.dollar.detectedValue : "",
            activeLocalization.yen.hasConflict() ? activeLocalization.yen.detectedValue : "",
        ].filter( Boolean );
        const defaultValues = [
            activeLocalization.krone.hasConflict() ? activeLocalization.krone.defaultValue : "",
            activeLocalization.dollar.hasConflict() ? activeLocalization.dollar.defaultValue : "",
            activeLocalization.yen.hasConflict() ? activeLocalization.yen.defaultValue : "",
        ].filter( Boolean );

        const choices = createDiv();
        choices.className = "uacc-localization-choices";
        choices.appendChild( this.createLocalizationChoice( {
            title: "Use detected",
            selected: this.useDetectedLocalization,
            values: detectedValues,
            onClick: () => this.updateLocalization( true )
        } ) );
        choices.appendChild( this.createLocalizationChoice( {
            title: "Use your defaults",
            selected: !this.useDetectedLocalization,
            values: defaultValues,
            onClick: () => this.updateLocalization( false )
        } ) );

        const save = Input.createButton( {
            label: "Save as site default and don't ask again",
            variant: "primary",
            onClick: () => {
                const promise = this.useDetectedLocalization
                    ? activeLocalization.overloadWithDetected()
                    : activeLocalization.overloadWithDefaults();
                promise
                    .then( () => activeLocalization.save() )
                    .then( () => tabState.updateDisplay() )
                    .then( () => activeLocalization.setLocked( true ) )
                    .then( () => {
                        activeLocalization.isLocked = true;
                        this.showLocalization = false;
                        this.render();
                    } )
                    .catch( console.error );
            }
        } );

        return this.createAlertSection( {
            title: "Localization alert",
            onDismiss: () => {
                this.showLocalization = false;
                this.render();
            },
            children: [ choices, save ]
        } );
    }

    private createLocalizationChoice( { title, selected, values, onClick }: LocalizationChoiceProps ): HTMLDivElement {
        const choice = createDiv();
        choice.className = selected ? "uacc-localization-choice uacc-localization-choice-selected" : "uacc-localization-choice";
        choice.addEventListener( "click", onClick );

        const header = createDiv();
        header.className = "uacc-content-group-header";
        header.textContent = title;
        choice.appendChild( header );

        values.forEach( value => choice.appendChild( this.createValueText( value ) ) );

        const radio = createDiv();
        radio.className = selected ? "uacc-radio uacc-radio-selected" : "uacc-radio";
        radio.appendChild( createDiv() );
        choice.appendChild( radio );
        return choice;
    }

    private updateLocalization( useDetected: boolean ): void {
        const { activeLocalization, tabState } = useProvider();
        this.useDetectedLocalization = useDetected;
        const promise = useDetected
            ? activeLocalization.overloadWithDetected()
            : activeLocalization.overloadWithDefaults();
        promise
            .then( () => activeLocalization.save() )
            .then( () => tabState.updateDisplay() )
            .then( () => this.render() )
            .catch( console.error );
    }

    private createAllowanceControls(): HTMLDivElement {
        const { browser, siteAllowance } = useProvider();
        const options = this.createAllowanceOptions();
        let selected = options[options.length - 1] ?? browser.hostAndPath;

        const wrapper = createDiv();
        const buttonSlot = createDiv();

        const range = Input.createRange( {
            options,
            initialValue: selected,
            onChange: value => {
                selected = value;
                renderButton();
            }
        } );

        const rangeRow = Input.createWrapperRow( {
            values: [ Input.createWrapper( {
                title: "Site allowance",
                value: range
            } ) ]
        } );

        wrapper.appendChild( rangeRow );
        wrapper.appendChild( buttonSlot );
        renderButton();
        return wrapper;

        function renderButton() {
            buttonSlot.innerHTML = "";
            const isAllowed = siteAllowance.getAllowance( selected ).isAllowed;
            buttonSlot.appendChild( Input.createButtonGroup( {
                values: [ Input.createButton( {
                    label: isAllowed ? "Blacklist" : "Whitelist",
                    variant: isAllowed ? "warning" : "primary",
                    onClick: () => {
                        siteAllowance.addUri( selected, !isAllowed )
                            .then( renderButton )
                            .catch( console.error );
                    }
                } ) ]
            } ) );
        }
    }

    private createConversionsControls(): HTMLDivElement {
        const { tabState } = useProvider();
        const wrapper = createDiv();

        if ( !tabState.isAllowed ) {
            wrapper.appendChild( Input.createWrapperRow( {
                values: [ Input.createWrapper( {
                    title: "Conversions",
                    value: this.createValueText( "Site is blacklisted" )
                } ) ]
            } ) );
            return wrapper;
        }

        wrapper.appendChild( Input.createWrapperRow( {
            values: [ Input.createWrapper( {
                title: "Conversions",
                value: this.createValueText( `${ tabState.conversions.length } conversions` )
            } ) ]
        } ) );

        wrapper.appendChild( Input.createButtonGroup( {
            values: [ Input.createButton( {
                label: tabState.isShowingConversions ? "Hide conversions" : "Show conversions",
                variant: tabState.isShowingConversions ? "secondary" : "primary",
                onClick: () => {
                    tabState.setIsShowingConversions( !tabState.isShowingConversions );
                    this.render();
                }
            } ) ]
        } ) );
        return wrapper;
    }

    private createPageLocalizationControls(): HTMLDivElement {
        const { activeLocalization, tabState } = useProvider();
        const dollarOptions: DropdownOption[] = [
            { value: "USD", label: "American" },
            { value: "CAD", label: "Canadian" },
            { value: "AUD", label: "Australian" },
            { value: "MXN", label: "Mexican" },
            { value: "NZD", label: "New Zealand" },
            { value: "SGP", label: "Singapore" },
            { value: "HKD", label: "Hong Kong" },
            { value: "ARS", label: "Argentine" },
        ];
        const kroneOptions: DropdownOption[] = [
            { value: "SEK", label: "Swedish" },
            { value: "DKK", label: "Danish" },
            { value: "NOK", label: "Norwegian" },
            { value: "ISK", label: "Icelandic" },
            { value: "CZK", label: "Czechia" },
        ];
        const yenOptions: DropdownOption[] = [
            { value: "CNY", label: "Chinese" },
            { value: "JPY", label: "Japanese" },
        ];

        const changePageLocalization = ( compact: Partial<CompactCurrencyLocalization> ) => {
            activeLocalization.overload( compact )
                .then( () => activeLocalization.save() )
                .then( () => tabState.updateDisplay() )
                .catch( console.error );
        };

        return Input.createWrapperRow( {
            values: [
                Input.createWrapper( {
                    title: "Dollar$",
                    value: Input.createDropdown( {
                        value: this.getSelectedOption( dollarOptions, activeLocalization.dollar.value ),
                        options: dollarOptions,
                        listLocation: "top",
                        onChange: value => changePageLocalization( { dollar: value.value } )
                    } )
                } ),
                Input.createWrapper( {
                    title: "Kr.",
                    value: Input.createDropdown( {
                        value: this.getSelectedOption( kroneOptions, activeLocalization.krone.value ),
                        options: kroneOptions,
                        listLocation: "top",
                        onChange: value => changePageLocalization( { krone: value.value } )
                    } )
                } ),
                Input.createWrapper( {
                    title: "Yen",
                    value: Input.createDropdown( {
                        value: this.getSelectedOption( yenOptions, activeLocalization.yen.value ),
                        options: yenOptions,
                        listLocation: "top",
                        onChange: value => changePageLocalization( { yen: value.value } )
                    } )
                } )
            ]
        } );
    }

    private createConvertToControls(): HTMLDivElement {
        const { backendApi, currencyTagConfig: { convertTo }, logger, tabState } = useProvider();

        if ( !this.symbolsPromise ) {
            this.symbolsPromise = backendApi.symbols()
                .then( symbols => {
                    this.symbols = symbols;
                    this.render();
                    return symbols;
                } )
                .catch( error => {
                    console.error( error );
                    return {};
                } );
        }

        if ( !this.symbols ) {
            return Input.createWrapperRow( {
                values: [ Input.createWrapper( {
                    title: "Convert to",
                    value: this.createValueText( "Loading..." )
                } ) ]
            } );
        }

        const options = Object.entries( this.symbols )
            .map( ( [ value, label ] ) => ({ value, label: `${ label } (${ value })` }) );

        return Input.createWrapperRow( {
            values: [ Input.createWrapper( {
                title: "Convert to",
                value: Input.createDropdown( {
                    value: this.getSelectedOption( options, convertTo.value ),
                    options,
                    listLocation: "top",
                    onChange: option => {
                        convertTo.setAndSaveValue( option.value )
                            .then( changed => {
                                if ( !changed ) return;
                                logger.info( `Now converting to ${ option.value }` );
                                return tabState.updateDisplay( option.value );
                            } )
                            .catch( console.error );
                    }
                } )
            } ) ]
        } );
    }

    private createAllowanceOptions(): string[] {
        const { browser } = useProvider();
        const hostParts = browser.url.hostname
            .split( "." )
            .filter( part => part !== "www" )
            .reverse();
        const pathParts = browser.url.pathname.split( "/" ).filter( Boolean );
        const options: string[] = [];

        while ( hostParts.length + pathParts.length > 1 ) {
            const uri = `${ hostParts.map( part => part ).reverse().join( "." ) }${ pathParts.length > 0 ? "/" : "" }${ pathParts.join( "/" ) }`;
            if ( !options.includes( uri ) ) options.unshift( uri );
            if ( pathParts.length > 0 ) {
                pathParts.pop();
            } else {
                hostParts.pop();
            }
        }

        return options.length > 0 ? options : [ browser.hostAndPath ];
    }

    private getSelectedOption( options: DropdownOption[], value: string ): DropdownOption {
        return options.find( option => option.value === value ) ?? { value, label: value };
    }

    private createMenuGroup( children: HTMLDivElement[] ): HTMLDivElement {
        const group = createDiv();
        group.className = "uacc-content-menu-group";
        children.forEach( child => group.appendChild( child ) );
        return group;
    }

    private createGroupHeader( text: string ): HTMLDivElement {
        const header = createDiv();
        header.className = "uacc-content-group-header";
        header.textContent = text;
        return header;
    }

    private createValueText( text: string ): HTMLDivElement {
        const div = createDiv();
        div.className = "uacc-content-value";
        div.textContent = text;
        return div;
    }
}
