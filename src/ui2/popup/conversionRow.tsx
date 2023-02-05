import { effect, useSignal } from '@preact/signals'
import { useEffect } from 'preact/compat'
import { useProvider } from '../../di'
import {
	DeleteIcon,
	Div,
	ExchangeIcon,
	Fun,
	NumberInput,
	Percent,
	Pixel,
	ReadonlyInput,
	useSymbols,
	useTheme,
	WithActions,
	WithChildren,
} from '../atoms'
import { useIsLoading } from '../atoms/contexts/ConfigurationProvider'
import { Dropdown } from '../molecules'

const AmountContainer = ( { children }: WithChildren ) =>
	<Div style={ { width: Percent.of( 35 ) } }>{ children }</Div>

const IconContainer = ( { children, ...props }: WithActions ) =>
	<Div { ...props }
	     css={ ( classname ) => <style jsx>{ `
           .${ classname }:hover {
             background-color: ${ useTheme().formBorderDimFocus };
           }
	     ` }</style> }
	     style={ {
		     display: 'flex',
		     alignItems: 'center',
		     alignContent: 'center',
		     justifyContent: 'center',
		     justifyItems: 'center',
		     cursor: 'pointer',
		     height: Pixel.field,
		     width: '5%',
	     } }>{ children }</Div>

const CurrencyContainer = ( { children }: WithChildren ) =>
	<Div style={ {
		width: Percent.of( 10 ),
	} }>{ children }</Div>

const Container = ( { children }: WithChildren ) =>
	<Div style={ {
		flexDirection: 'row',
		display: 'flex',
	} }>{ children }</Div>


type Props = {
	from: string,
	to: string,
	amount: number,
	onDelete: () => void
	onInput: ( data: { from: string; to: string; amount: number } ) => void;
}


export const ConversionRow: Fun = ( props: Props ) => {
	const { currencyAmount } = useProvider()
	const theme = useTheme()

	const symbols = useSymbols().map( e => ( { ...e, text: e.key } ) )
	const fromAmount = useSignal( { from: props.from, to: props.to, amount: props.amount } )
	const toAmount = useSignal( currencyAmount.create( { tag: props.from, amount: props.amount } ) )

	effect( () => {props.onInput( fromAmount.value )} )

	useEffect( () => {
		const fromAmount2 = fromAmount.value
		const current = currencyAmount.create( { tag: fromAmount2.from, amount: [ fromAmount2.amount ] } )
		current.convertTo( fromAmount2.to )
		       .then( e => e || toAmount.value )
		       .then( e => toAmount.value = e )
	}, [ fromAmount.value.from, fromAmount.value.to, fromAmount.value.amount ] )

	if ( useIsLoading() ) return <></>

	return (
		<Container>
			<IconContainer onClick={ () => props.onDelete() }>
				<DeleteIcon height={ Pixel.halfField } width={ Pixel.halfField } color={ theme.errorBackground }/>
			</IconContainer>

			<AmountContainer>
				<NumberInput align="right" value={ fromAmount.value.amount }
				             onInput={ e => fromAmount.value = ( ( { ...fromAmount.value, amount: e } ) ) }/>
			</AmountContainer>

			<CurrencyContainer>
				<Dropdown options={ symbols } initialValue={ fromAmount.value.from }
				          onSelection={ e => fromAmount.value = { ...fromAmount.value, from: e } }/>
			</CurrencyContainer>

			<IconContainer
				onClick={ () => fromAmount.value = ( ( {
					from: fromAmount.value.to,
					to: fromAmount.value.from,
					amount: +toAmount.value.roundedAmount[0],
				} ) ) }
			>
				<ExchangeIcon height={ Pixel.halfField } width={ Pixel.halfField } color={ theme.normalText }/>
			</IconContainer>

			<AmountContainer>
				<ReadonlyInput align="right" value={ toAmount.value.displayValue[0] }/>
			</AmountContainer>

			<CurrencyContainer>
				<Dropdown options={ symbols }
				          initialValue={ fromAmount.value.to }
				          onSelection={ e => fromAmount.value = { ...fromAmount.value, to: e } }/>
			</CurrencyContainer>
		</Container>
	)
}