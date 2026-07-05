import { createDiv } from "./Utils";
import { DropdownOption, Input } from "./Input";
import { Icons } from "./Icons";
import { Text } from "./Text";
import { useProvider } from "../di";
import { CurrencyAmount } from "../currencyConverter/Currency";

type MiniRow = { from: string; to: string; amount: number };

function wrapCell( child: HTMLElement, className: string ): HTMLDivElement {
    const cell = createDiv();
    cell.className = className;
    cell.appendChild( child );
    return cell;
}

export class PopupUi {

    static createPopup( symbols: Record<string, string> ): HTMLDivElement {
        const { browser, tabMessenger } = useProvider();

        const root = createDiv();
        root.className = "uacc-popup";

        root.appendChild( Text.title( { text: "Universal Automatic Currency Converter" } ) );
        root.appendChild( PopupUi.createConverter( symbols ) );

        const gap = createDiv();
        gap.className = "uacc-gap-1em";
        root.appendChild( gap );

        root.appendChild( Input.createButton( {
            label: "Open context menu",
            variant: "secondary",
            onClick: () => tabMessenger.openContextMenu().catch( console.error )
        } ) );
        root.appendChild( Input.createButton( {
            label: "Go to settings",
            variant: "primary",
            onClick: () => window.open( "./options.html", "_blank" )
        } ) );

        root.appendChild( Text.footer( { text: "Like or hate this extension?" } ) );

        const reviewLine = Text.footer( { text: "" } );
        reviewLine.appendChild( Text.link( { text: "Leave a review", href: browser.reviewLink } ) );
        root.appendChild( reviewLine );

        const versionLine = Text.footer( { text: "" } );
        versionLine.appendChild( Text.link( {
            text: `Version ${ browser.extensionVersion } Baizey`,
            href: browser.sourceCodeLink
        } ) );
        root.appendChild( versionLine );

        return root;
    }

    static createConverter( symbols: Record<string, string> ): HTMLDivElement {
        const { config, currencyAmount } = useProvider();
        const miniConverter = config.meta.miniConverter;
        const convertTo = config.currencyTag.convertTo;

        const options: DropdownOption[] = Object.keys( symbols )
            .map( value => ({ value, label: value }) );

        const container = createDiv();
        container.className = "uacc-converter";

        const rowsContainer = createDiv();
        rowsContainer.className = "uacc-converter-rows";
        container.appendChild( rowsContainer );

        let rows: MiniRow[] = ( miniConverter.value ?? [] ).map( r => ({ ...r }) );

        function persist() {
            miniConverter.setAndSaveValue( rows.map( r => ({ ...r }) ) ).catch( console.error );
        }

        function renderRows() {
            rowsContainer.innerHTML = "";
            rows.forEach( ( row, index ) => rowsContainer.appendChild( buildRow( row, index ) ) );
        }

        function buildRow( row: MiniRow, index: number ): HTMLDivElement {
            const rowEl = createDiv();
            rowEl.className = "uacc-conversion-row";

            const toField = Input.createTextInput( {
                align: "right",
                readonly: true,
                value: "",
                onChange: () => {}
            } );
            const toInput = toField.querySelector( "input" ) as HTMLInputElement;

            let converted: CurrencyAmount | null = null;

            function recompute() {
                currencyAmount.create( { tag: row.from, amount: row.amount } )
                    .convertTo( row.to )
                    .then( result => {
                        converted = result;
                        toInput.value = result ? result.displayValue[0] : "";
                    } )
                    .catch( () => { toInput.value = ""; } );
            }

            // Delete row
            const del = createDiv();
            del.className = "uacc-icon-button uacc-icon-button-danger";
            del.appendChild( Icons.remove() );
            del.addEventListener( "click", () => {
                rows.splice( index, 1 );
                persist();
                renderRows();
            } );

            // From amount
            const fromAmount = Input.createNumberInput( {
                align: "right",
                value: row.amount,
                onChange: value => {
                    row.amount = value;
                    persist();
                    recompute();
                }
            } );

            // From currency
            const fromCurrency = Input.createDropdown( {
                value: { value: row.from, label: row.from },
                options,
                onChange: option => {
                    row.from = option.value;
                    persist();
                    recompute();
                }
            } );

            // Swap from <-> to
            const swap = createDiv();
            swap.className = "uacc-icon-button";
            swap.appendChild( Icons.exchange() );
            swap.addEventListener( "click", () => {
                const swappedAmount = converted ? Number( converted.roundedAmount[0] ) : row.amount;
                const previousFrom = row.from;
                row.from = row.to;
                row.to = previousFrom;
                row.amount = Number.isFinite( swappedAmount ) ? swappedAmount : row.amount;
                persist();
                renderRows();
            } );

            // To currency
            const toCurrency = Input.createDropdown( {
                value: { value: row.to, label: row.to },
                options,
                onChange: option => {
                    row.to = option.value;
                    persist();
                    recompute();
                }
            } );

            rowEl.appendChild( wrapCell( del, "uacc-cell-icon" ) );
            rowEl.appendChild( wrapCell( fromAmount, "uacc-cell-amount" ) );
            rowEl.appendChild( wrapCell( fromCurrency, "uacc-cell-currency" ) );
            rowEl.appendChild( wrapCell( swap, "uacc-cell-icon" ) );
            rowEl.appendChild( wrapCell( toField, "uacc-cell-amount" ) );
            rowEl.appendChild( wrapCell( toCurrency, "uacc-cell-currency" ) );

            recompute();
            return rowEl;
        }

        const addButton = Input.createButton( {
            label: "Add conversion row",
            variant: "ternary",
            onClick: () => {
                rows.push( { from: convertTo.value, to: convertTo.value, amount: 1 } );
                persist();
                renderRows();
            }
        } );

        renderRows();
        container.appendChild( addButton );
        return container;
    }
}
