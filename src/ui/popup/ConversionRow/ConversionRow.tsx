import * as React from 'react'
import { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { useProvider } from '../../../di'
import { MyTheme, ThemeProps } from '../../../infrastructure'
import { DeleteIcon, Div, ExchangeIcon, NumberInput, Pixel, ReadonlyInput, useConfiguration } from '../../atoms'
import { Dropdown, DropdownOption } from '../../molecules'

export type ConversionRowProps = {
	from: string;
	to: string;
	amount: number;
	onChange: ( data: { from: string; to: string; amount: number } ) => void;
	onDelete: () => void;
};

export function ConversionRow( props: ConversionRowProps ) {
	const { currencyAmount } = useProvider()
	const theme = useTheme() as MyTheme

	const { symbols, isLoading } = useConfiguration()
	const options: DropdownOption[] = symbols

	const [ fromAmount, setFromAmount ] = useState( { from: props.from, to: props.to, amount: props.amount } )
	const [ toAmount, setToAmount ] = useState( currencyAmount.create( { tag: props.from, amount: props.amount } ) )

	useEffect( () => {
		const current = currencyAmount.create( { tag: fromAmount.from, amount: [ fromAmount.amount ] } )
		current.convertTo( fromAmount.to )
		       .then( e => e || toAmount )
		       .then( e => setToAmount( e ) )
		props.onChange( {
			from: fromAmount.from,
			to: fromAmount.to,
			amount: fromAmount.amount,
		} )
	}, [ fromAmount ] )

	if ( isLoading ) return <></>

	return (
		<Container>
			<IconContainer onClick={ () => props.onDelete() }>
				<DeleteIcon height={ Pixel.halfField } width={ Pixel.halfField } color={ theme.errorBackground }/>
			</IconContainer>

			<AmountContainer>
				<NumberInput align="right" value={ fromAmount.amount }
				             onChange={ e => setFromAmount( p => ( { ...p, amount: e } ) ) }/>
			</AmountContainer>

			<CurrencyContainer>
				<Dropdown options={ options } initialValue={ fromAmount.from }
				          onSelection={ e => setFromAmount( p => ( { ...p, from: e } ) ) }/>
			</CurrencyContainer>

			<IconContainer
				onClick={ () => setFromAmount( p => ( {
					from: p.to,
					to: p.from,
					amount: +toAmount.roundedAmount[0],
				} ) ) }
			>
				<ExchangeIcon height={ Pixel.halfField } width={ Pixel.halfField } color={ theme.normalText }/>
			</IconContainer>

			<AmountContainer>
				<ReadonlyInput align="right" value={ toAmount.displayValue[0] }/>
			</AmountContainer>

			<CurrencyContainer>
				<Dropdown options={ options } initialValue={ fromAmount.to }
				          onSelection={ e => setFromAmount( p => ( { ...p, to: e } ) ) }/>
			</CurrencyContainer>
		</Container>
	)
}

const AmountContainer = styled( Div )`
  width: 35%;
`

const IconContainer = styled( Div )`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
  cursor: pointer;
  height: ${ () => Pixel.field }
  width: 5%;

  &:hover {
    background-color: ${ ( props: ThemeProps ) => props.theme.formBorderDimFocus };
  }
`

const CurrencyContainer = styled( Div )`
  width: 10%;
`

const Container = styled( Div )`
  display: flex;
  flex-direction: row;
`
