import {CurrencyAmount} from '../CurrencyConverter/Currency/CurrencyAmount';
import {useProvider} from '../Infrastructure';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Dropdown, Input, ReadonlyInput} from '../Atoms';
import styled, {useTheme} from 'styled-components';
import {MyTheme, ThemeProps} from '../Atoms/ThemeProps';
import {DeleteIcon, ExchangeIcon} from '../assets'

type Props = {
    from: string,
    to: string,
    amount: number,
    onChange: (data: { from: string, to: string, amount: number }) => void
    onDelete: () => void
}

export function ConversionRow(props: Props) {
    const theme = useTheme() as MyTheme
    const {backendApi, provider} = useProvider();

    const [from, setFrom] = useState<string>(props.from)
    const [to, setTo] = useState<string>(props.to)
    const [fromAmount, setFromAmount] = useState<number>(props.amount)
    const [toAmount, setToAmount] = useState<CurrencyAmount>(new CurrencyAmount(provider, from, props.amount))
    const [options, setOptions] = useState<{ label: string, value: string }[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function getSymbols(): Promise<void> {
        const symbols = await backendApi.symbols()
        setOptions(Object.entries(symbols).map(([key]) => ({label: key, value: key})))
        setIsLoading(false)
    }

    useEffect(() => {
            new CurrencyAmount(provider, from, [fromAmount])
                .convertTo(to)
                .then(e => e || toAmount)
                .then(e => setToAmount(e))
            props.onChange({from: from, to: to, amount: fromAmount})
        },
        [fromAmount, from, to])
    useEffect(() => {getSymbols()}, [])

    if(isLoading) return <></>

    return <Container>
        <IconContainer onClick={() => props.onDelete()}>
            <DeleteIcon height="20px" width="20px" color={theme.error}/>
        </IconContainer>

        <AmountContainer>
            <Input key={`conversion_row_from_amount_${fromAmount}`}
                   center={false} type={'number'}
                   value={fromAmount}
                   onChange={value => setFromAmount(+value)}/>
        </AmountContainer>

        <CurrencyContainer>
            <Dropdown key={`conversion_row_from_${from}`}
                      options={options}
                      value={from}
                      onChange={value => setFrom(value)}/>
        </CurrencyContainer>

        <IconContainer onClick={() => {
            const oldFrom = from;
            const oldTo = to;
            const oldToAmount = toAmount;
            setFrom(oldTo);
            setTo(oldFrom);
            setFromAmount(+oldToAmount.roundedAmount[0])
        }}>
            <ExchangeIcon height="20px" width="20px" color={theme.normalText}/>
        </IconContainer>

        <AmountContainer>
            <ReadonlyInput center={false} value={toAmount.displayValue[0]}/>
        </AmountContainer>

        <CurrencyContainer>
            <Dropdown key={`conversion_row_to_${to}`}
                      options={options}
                      value={to}
                      onChange={value => setTo(value)}/>
        </CurrencyContainer>
    </Container>
}

const AmountContainer = styled.div`
  width: 30%;
`

const IconContainer = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
  cursor: pointer;
  height: 34px;
  width: 5%;

  &:hover {
    background-color: ${(props: ThemeProps) => props.theme.borderDimFocus};
  }
`

const CurrencyContainer = styled.div`
  width: 15%;
`

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`