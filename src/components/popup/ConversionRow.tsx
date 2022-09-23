import * as React from 'react'
import { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { CurrencyAmount } from '../../currencyConverter/Currency'
import { useProvider } from '../../di'
import { MyTheme, ThemeProps } from '../../infrastructure'
import { DeleteIcon, ExchangeIcon } from '../assets'
import { Div, Dropdown, NumberInput, ReadonlyInput } from '../atoms'
import { FieldHeight } from '../atoms/Constants'

export type ConversionRowProps = {
	from: string;
	to: string;
	amount: number;
	onChange: ( data: { from: string; to: string; amount: number } ) => void;
	onDelete: () => void;
};

export function ConversionRow( props: ConversionRowProps ) {
	const {
		backendApi,
		currencyAmount,
	} = useProvider()
	const theme = useTheme() as MyTheme

	const [ from, setFrom ] = useState<string>( props.from )
	const [ to, setTo ] = useState<string>( props.to )
	const [ fromAmount, setFromAmount ] = useState<number>( props.amount )
	const [ toAmount, setToAmount ] = useState<CurrencyAmount>(
		currencyAmount.create( {
			tag: from,
			amount: props.amount,
		} ),
	)
	const [ options, setOptions ] = useState<{ label: string; value: string }[]>(
		[],
	)
	const [ isLoading, setIsLoading ] = useState<boolean>( true )

	async function getSymbols(): Promise<void> {
		const symbols = await backendApi.symbols()
		setOptions(
			Object.entries( symbols )
				.map( ( [ key ] ) => ( {
					label: key,
					value: key,
				} ) ),
		)
		setIsLoading( false )
	}

	useEffect( () => {
		currencyAmount.create( {
			tag: from,
			amount: [ fromAmount ],
		} )
			.convertTo( to )
			.then( ( e ) => e || toAmount )
			.then( ( e ) => setToAmount( e ) )
		props.onChange( {
			from: from,
			to: to,
			amount: fromAmount,
		} )
	}, [ fromAmount, from, to ] )
	useEffect( () => {
		getSymbols()
	}, [] )

	if ( isLoading ) return <></>

	return (
		<Container>
			<IconContainer onClick={ () => props.onDelete() }>
				<DeleteIcon height="20px" width="20px" color={ theme.errorBackground }/>
			</IconContainer>

			<AmountContainer>
				<NumberInput
					center={ false }
					defaultValue={ fromAmount }
					onChange={ ( value ) => setFromAmount( +value ) }
				/>
			</AmountContainer>

			<CurrencyContainer>
				<Dropdown
					options={ options }
					value={ from }
					onChange={ ( value ) => setFrom( value ) }
				/>
			</CurrencyContainer>

			<IconContainer
				onClick={ () => {
					const oldFrom = from
					const oldTo = to
					const oldToAmount = toAmount
					setFrom( oldTo )
					setTo( oldFrom )
					setFromAmount( +oldToAmount.roundedAmount[0] )
				} }
			>
				<ExchangeIcon height="20px" width="20px" color={ theme.normalText }/>
			</IconContainer>

			<AmountContainer>
				<ReadonlyInput center={ false } defaultValue={ toAmount.displayValue[0] }/>
			</AmountContainer>

			<CurrencyContainer>
				<Dropdown
					options={ options }
					value={ to }
					onChange={ ( value ) => setTo( value ) }
				/>
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
  height: ${ () => FieldHeight.pixel }
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
