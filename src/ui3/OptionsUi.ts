import { createDiv } from "./Utils";
import { DropdownOption, Input } from "./Input";
import { useProvider } from "../di";
import { LoggingSettingType } from "../infrastructure/Configuration/setting";
import { ThemeHandler } from "./ThemeHandler";
import { Section } from "./Text";

type OptionsSectionProps = {
    title: string,
}

export class OptionsUi {

    static createGap( size: number ): HTMLDivElement {
        const div = createDiv()
        div.className = `uacc-gap-${ size }em`
        return div
    }

    static createOptionsBackground(): HTMLDivElement {
        const div = createDiv()
        div.className = "uacc-options-background-wrapper";
        return div
    }

    static createOptionsSection( { title }: OptionsSectionProps ): HTMLDivElement {
        const div = createDiv()
        div.className = "uacc-options-background-section";

        const header = document.createElement( "h1" );
        header.className = "uacc-options-section-header";
        header.textContent = title;
        div.appendChild( header );

        return div
    }

    static createInitialOptionsSection( updateFilter: ( v: string ) => void ) {
        const { browser } = useProvider()
        const searchSection = OptionsUi.createOptionsSection( {
            title: "Universal Automatic Currency Converter"
        } );
        const p = searchSection.appendChild( createDiv() );
        p.textContent = `Version ${ browser.extensionVersion } created by ${ browser.author }`;
        p.className = 'uacc-options-section-header-subtitle'

        searchSection.appendChild(
            Input.createWrapperRow( {
                values: [ Input.createWrapper( {
                    title: "Search for what you need",
                    subtitle: "Leave empty to show all options",
                    value: Input.createTextInput( {
                        placeholder: "Search for what you want to find here...",
                        value: "",
                        onChange: updateFilter
                    } )
                } )
                ]
            } ) );
        return searchSection
    }

    static createCurrencyOptionSection( symbols: Record<string, string> ) {
        const { config } = useProvider()
        const wrap = createDiv()
        wrap.appendChild( OptionsUi.createGap( 1 ) )
        const currencySection = wrap.appendChild( OptionsUi.createOptionsSection( { title: 'Currency' } ) );
        const currencyOptions: DropdownOption[] = Object.entries( symbols )
            .map( ( [ symbol, value ] ) => ({ label: value, value: symbol }) )
        const initialValue = config.currencyTag.convertTo.value
        currencySection.appendChild( Input.createWrapperRow( {
            values: [ Input.createWrapper( {
                title: "Convert to",
                value: Input.createDropdown( {
                    value: { value: initialValue, label: symbols[initialValue] },
                    options: currencyOptions,
                    onChange: v => {
                        config.currencyTag.convertTo.setAndSaveValue( v.value );

                    }
                } )
            } ) ]
        } ) );
        currencySection.appendChild( Input.createWrapperRow( {
            values: [ Input.createWrapper( {
                title: "Convert pages automatically on load",
                value: Input.createToggle( {
                    value: config.meta.useAutoConvertOnPageLoad.value,
                    onChange: v => {
                        config.meta.useAutoConvertOnPageLoad.setAndSaveValue( v );

                    }
                } )
            } ) ]
        } ) );
        return wrap
    }

    static createLocalizationOptionSection( symbols: Record<string, string> ) {
        const wrap = createDiv()
        wrap.appendChild( OptionsUi.createGap( 1 ) )

        const { config } = useProvider()
        const krone = [
            { value: 'SEK', label: symbols['SEK'] },
            { value: 'DKK', label: symbols['DKK'] },
            { value: 'NOK', label: symbols['NOK'] },
            { value: 'ISK', label: symbols['ISK'] },
            { value: 'CZK', label: symbols['CZK'] }
        ]
        const yen = [
            { value: 'CNY', label: symbols['CNY'] },
            { value: 'JPY', label: symbols['JPY'] }
        ]
        const dollar = [
            { value: 'USD', label: symbols['USD'] },
            { value: 'CAD', label: symbols['CAD'] },
            { value: 'AUD', label: symbols['AUD'] },
            { value: 'MXN', label: symbols['MXN'] },
            { value: 'NZD', label: symbols['NZD'] },
            { value: 'SGP', label: symbols['SGP'] ?? 'SGP' },
            { value: 'HKD', label: symbols['HKD'] },
            { value: 'ARS', label: symbols['ARS'] }
        ]
        const initYen = config.localization.yen.value
        const initKrone = config.localization.krone.value
        const initDollar = config.localization.dollar.value
        const yenOption = Input.createWrapper( {
            title: "Yen",
            value: Input.createDropdown( {
                value: { value: initYen, label: symbols[initYen] },
                options: yen,
                onChange: v => {
                    config.localization.yen.setAndSaveValue( v.value );
                }
            } )
        } )
        const kroneOption = Input.createWrapper( {
            title: "Krone",
            value: Input.createDropdown( {
                value: { value: initKrone, label: symbols[initKrone] },
                options: krone,
                onChange: v => {
                    config.localization.krone.setAndSaveValue( v.value );
                }
            } )
        } )
        console.log( dollar )
        const dollarOption = Input.createWrapper( {
            title: "Dollar",
            value: Input.createDropdown( {
                value: { value: initDollar, label: symbols[initDollar] },
                options: dollar,
                onChange: v => {
                    config.localization.dollar.setAndSaveValue( v.value );
                }
            } )
        } )
        const localizationSection = OptionsUi.createOptionsSection( { title: 'Preferred Localization' } );
        localizationSection.appendChild( Input.createWrapperRow( {
            values: [ dollarOption, kroneOption, yenOption ]
        } ) )
        localizationSection.appendChild( Input.createWrapper( {
                title: "Show localization alerts",
                value: Input.createToggle( {
                    value: config.localization.usingAlert.value,
                    onChange: v => {
                        config.localization.usingAlert.setAndSaveValue( v );
                    }
                } )
            } )
        );
        wrap.appendChild( localizationSection )
        return wrap
    }

    static createShortcutsOptionSection() {
        const wrap = createDiv()
        wrap.appendChild( OptionsUi.createGap( 1 ) )
        const { config } = useProvider()
        const section = OptionsUi.createOptionsSection( { title: 'Keyboard shortcuts' } );

        const hoveredShortcut = Input.createWrapper( {
            title: "Convert-hovered shortcut",
            subtitle: 'Left-click to clear, then click your desired shortcut key',
            value: Input.createShortcutInput( {
                value: config.qualityOfLife.keyPressOnHoverFlipConversion.value,
                onChange: ( v ) => config.qualityOfLife.keyPressOnHoverFlipConversion.setAndSaveValue( v )
            } )
        } )
        const allShortcut = Input.createWrapper( {
            title: "Convert-all shortcut",
            subtitle: 'Left-click to clear, then click your desired shortcut key',
            value: Input.createShortcutInput( {
                value: config.qualityOfLife.keyPressOnAllFlipConversion.value,
                onChange: ( v ) => config.qualityOfLife.keyPressOnAllFlipConversion.setAndSaveValue( v )
            } )
        } )
        const leftClickToggle = Input.createWrapper( {
            title: 'Convert prices by left clicking',
            value: Input.createToggle( {
                value: config.qualityOfLife.leftClickOnHoverFlipConversion.value,
                onChange: ( v ) => config.qualityOfLife.leftClickOnHoverFlipConversion.setAndSaveValue( v )
            } )
        } )

        const hoverToggle = Input.createWrapper( {
            title: 'Convert prices on hover over',
            value: Input.createToggle( {
                value: config.qualityOfLife.onHoverFlipConversion.value,
                onChange: ( v ) => config.qualityOfLife.onHoverFlipConversion.setAndSaveValue( v )
            } )
        } )

        section.appendChild( Input.createWrapperRow( { values: [ hoveredShortcut, allShortcut ] } ) )
        section.appendChild( Input.createWrapperRow( { values: [ leftClickToggle, hoverToggle ] } ) )
        wrap.appendChild( section )
        return wrap
    }

    static createCustomDisplayOptionSection() {
        const wrap = createDiv()
        wrap.appendChild( OptionsUi.createGap( 1 ) )
        const { config } = useProvider()
        const section = OptionsUi.createOptionsSection( { title: 'Custom display' } );

        section.appendChild( Input.createWrapperRow( {
            values: [
                Input.createWrapper( {
                    title: 'Custom display format',
                    subtitle: '¤ is stand in for where the amount will be',
                    value: Input.createTextInput( {
                        value: config.currencyStyling.customDisplay.value,
                        onChange: e => config.currencyStyling.customDisplay.setAndSaveValue( e )
                    } )
                } ),
                Input.createWrapper( {
                    title: 'Use custom display',
                    value: Input.createToggle( {
                        value: config.currencyStyling.enabled.value,
                        onChange: e => config.currencyStyling.enabled.setAndSaveValue( e )
                    } )
                } ),
                Input.createWrapper( {
                    title: 'Custom conversion rate',
                    value: Input.createNumberInput( {
                        value: config.currencyStyling.conversionRate.value,
                        onChange: e => config.currencyStyling.conversionRate.setAndSaveValue( e )
                    } )
                } ),
            ]
        } ) )

        wrap.appendChild( section )
        return wrap
    }

    static createNumberFormattingOptionSection() {
        const wrap = createDiv()
        wrap.appendChild( OptionsUi.createGap( 1 ) )
        const { config } = useProvider()
        const section = OptionsUi.createOptionsSection( { title: 'Number formatting and rounding' } );

        const decimalOptions = [
            { value: '.', label: '0.50 (dot)' },
            { value: ',', label: '0,50 (comma)' }
        ]
        const thousandsOptions = [
            { value: ' ', label: '100 000 (space)' },
            { value: '.', label: '100.000 (dot)' },
            { value: ',', label: '100,000 (comma)' },
            { value: '', label: '100000 (nothing)' }
        ]
        section.appendChild( Input.createWrapperRow( {
            values: [
                Input.createWrapper( {
                    title: 'Thousands separator',
                    value: Input.createDropdown( {
                        value: thousandsOptions.find( e => e.value === config.numberStyling.group.value ),
                        options: thousandsOptions,
                        onChange: e => config.numberStyling.group.setAndSaveValue( e.value )
                    } )
                } ),
                Input.createWrapper( {
                    title: 'Decimal point',
                    value: Input.createDropdown( {
                        value: decimalOptions.find( e => e.value === config.numberStyling.decimal.value ),
                        options: decimalOptions,
                        onChange: e => config.numberStyling.decimal.setAndSaveValue( e.value )
                    } )
                } ),
                Input.createWrapper( {
                    title: 'Important digits on rounding',
                    value: Input.createNumberInput( {
                        value: config.numberStyling.significantDigits.value,
                        onChange: e => config.numberStyling.significantDigits.setAndSaveValue( e )
                    } )
                } ),
            ]
        } ) )
        wrap.appendChild( section )
        return wrap
    }

    static createNumberConversionHighlightingOptionSection() {
        const wrap = createDiv()
        wrap.appendChild( OptionsUi.createGap( 1 ) )
        const { config } = useProvider()
        const section = OptionsUi.createOptionsSection( { title: 'Conversion highlight' } );

        section.appendChild( Input.createWrapperRow( {
            values: [
                Input.createWrapper( {
                    title: 'Highlight color',
                    value: Input.createTextInput( {
                        value: config.highlight.color.value,
                        onChange: e => config.highlight.color.setAndSaveValue( e )
                    } )
                } ),
                Input.createWrapper( {
                    title: 'Highlight conversions',
                    value: Input.createToggle( {
                        value: config.highlight.enabled.value,
                        onChange: e => config.highlight.enabled.setAndSaveValue( e )
                    } )
                } ),
                Input.createWrapper( {
                    title: 'Highlight duration',
                    value: Input.createNumberInput( {
                        value: config.highlight.duration.value,
                        onChange: e => config.highlight.duration.setAndSaveValue( e )
                    } )
                } ),
            ]
        } ) )
        wrap.appendChild( section )
        return wrap
    }

    static createMiscOptionSection() {
        const wrap = createDiv()
        wrap.appendChild( OptionsUi.createGap( 1 ) )
        const { config } = useProvider()
        const section = OptionsUi.createOptionsSection( { title: 'Misc' } );

        const loggingOptions: DropdownOption[] = [
            { value: LoggingSettingType.nothing, label: 'Nothing' },
            { value: LoggingSettingType.error, label: 'Error' },
            { value: LoggingSettingType.info, label: 'Info' },
            { value: LoggingSettingType.debug, label: 'Everything' },
            { value: LoggingSettingType.profile, label: 'Everything with profiling' },
        ]
        const loggingWrapper = Input.createWrapper( {
            title: 'Logging level',
            subtitle: 'Local only F12 => console to view',
            value: Input.createDropdown( {
                value: { value: config.meta.logging.value as unknown as string, label: '' + config.meta.logging.value },
                options: loggingOptions,
                onChange: ( opt ) => {
                    // opt.value is of type string; cast to LoggingSettingType
                    config.meta.logging.setAndSaveValue( opt.value as unknown as LoggingSettingType )
                }
            } )
        } )

        const bracketsWrapper = Input.createWrapper( {
            title: 'Display conversion in brackets',
            subtitle: '',
            value: Input.createToggle( {
                value: config.currencyTag.showConversionInBrackets.value,
                onChange: ( v ) => config.currencyTag.showConversionInBrackets.setAndSaveValue( v )
            } )
        } )

        const themeKeys = ThemeHandler.getThemeNames()
        const options: DropdownOption[] = themeKeys.map( k => ({
            value: k,
            label: k.substring( 0, 1 ).toUpperCase() +
                k.substring( 1 ).replace( /[A-Z]/g, e => ` ${ e }` )
        }) )
        const initial = config.meta.colorTheme.value
        const selected = options.find( k => k.value === initial ) ?? options[0]
        const themeDropdown = Input.createWrapper( {
            title: 'Color theme',
            value: Input.createDropdown( {
                value: selected,
                options: options,
                onChange: ( opt ) => {
                    config.meta.colorTheme.setAndSaveValue( opt.value as any )
                    ThemeHandler.updateTheme( opt.value )
                }
            } )
        } )

        section.appendChild( Input.createWrapperRow( { values: [ loggingWrapper, bracketsWrapper, themeDropdown ] } ) )
        wrap.appendChild( section )
        return wrap
    }

    static createSiteAllowanceSection() {
        const wrap = createDiv()
        wrap.appendChild( OptionsUi.createGap( 1 ) )
        const { config } = useProvider()
        const section = OptionsUi.createOptionsSection( { title: 'Site allowance' } )

        const useWhite = Input.createWrapper( {
            title: 'Enable whitelisting',
            value: Input.createToggle( {
                value: config.siteAllowance.useWhitelisting.value,
                onChange: e => {
                    config.siteAllowance.useWhitelisting.setAndSaveValue( e )
                }
            } )
        } );
        const useBlack = Input.createWrapper( {
            title: 'Enable blacklisting',
            value: Input.createToggle( {
                value: config.siteAllowance.useBlacklisting.value,
                onChange: e => {
                    config.siteAllowance.useBlacklisting.setAndSaveValue( e )
                }
            } )
        } );
        section.appendChild( Input.createWrapperRow( { values: [ useWhite, useBlack ] } ) )


        const white = Input.createWrapper( {
            title: 'Whitelist',
            value: Input.createEverExpandingList( {
                values: config.siteAllowance.whitelistedUrls.value,
                placeholder: 'https://...',
                onChange: e => {
                    config.siteAllowance.whitelistedUrls.setAndSaveValue( e )
                }
            } )
        } );
        const black = Input.createWrapper( {
            title: 'Blacklist',
            value: Input.createEverExpandingList( {
                values: config.siteAllowance.blacklistedUrls.value,
                placeholder: 'https://...',
                onChange: e => {
                    config.siteAllowance.blacklistedUrls.setAndSaveValue( e )
                }
            } )
        } );
        section.appendChild( Input.createWrapperRow( { values: [ white, black ] } ) )
        wrap.appendChild( section )
        return wrap
    }

    static createLoginSection() {
        const wrap = createDiv()
        wrap.appendChild( OptionsUi.createGap( 1 ) )
        const { config, backendApi } = useProvider()

        const section = OptionsUi.createOptionsSection( { title: 'User' } )

        const getSessionId = () => config.user.userSessionId.value

        /* States:
            - no email
                + recover password (add token field / act with it)
                + login (add password field / act with it)

                + register email (button no extra fields)
            - has email
                + recover password (add token field / act with it)
                + login, if session is dead (add password field / act with it)

                + logout (button, no extra fields)
        */
        enum SetupType {dashboard, recover_password, login,}

        function setupUi(
            state: SetupType,
        ) {
            section.innerHTML = ''
            const sessionId = config.user.userSessionId.value
            const email = config.user.userEmail.value
            const inSystem = sessionId.length > 0
            const hasUser = email.length > 0

            const subtitle =
            wrap.appendChild( Section.subtitle( { text: '' } ) )


            const isPass = state === SetupType.login
            const loginButton = Input.createButton( {
                label: 'Login',
                variant: "secondary",
                disabled: false,
                onClick: () => {
                    if ( !isPass ) return setupUi( SetupType.login )
                    // TODO: attempt login
                    setupUi( SetupType.dashboard )
                }
            } )
            const isReset = state === SetupType.recover_password
            const resetButton = Input.createButton( {
                label: isReset ? 'Reset password' : 'Recover password',
                variant: "secondary",
                disabled: false,
                onClick: () => {
                    if ( !resetButton ) {
                        return setupUi( SetupType.recover_password )
                    }
                    setupUi( SetupType.dashboard )
                }
            } )
            const logoutButton = Input.createButton( {
                label: 'Logout',
                variant: "warning",
                onClick: () => {
                    config.user.userSessionId.setAndSaveValue( '' ).catch( console.error );
                    config.user.userEmail.setAndSaveValue( '' ).catch( console.error )
                }
            } )
            const registerButton = Input.createButton( {
                label: 'Register email',
                variant: "secondary",
                onClick: () => {
                    config.user.userSessionId.setAndSaveValue( '' ).catch( console.error );
                    config.user.userEmail.setAndSaveValue( '' ).catch( console.error )
                }
            } )

            const buttons: HTMLDivElement[] = [
                loginButton, resetButton
            ]
            if ( config.user.userEmail.value === '' ) {
                buttons.push( registerButton )
            } else {
                buttons.push( logoutButton )
            }

            section.appendChild( Input.createButtonGroup( {
                values: buttons
            } ) )
        }

        setupUi( SetupType.dashboard )

        return wrap
    }
}