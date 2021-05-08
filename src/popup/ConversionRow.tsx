import {CurrencyAmount} from '../CurrencyConverter/Currency/CurrencyAmount';
import {useProvider} from '../Infrastructure';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Dropdown, Input, ReadonlyInput} from '../Atoms';
import styled from 'styled-components';
import {StyleTheme} from '../Atoms/StyleTheme';

type Props = {
    from: string,
    to: string,
    amount: number,
    onChange: (data: { from: string, to: string, amount: number }) => void
    onDelete: () => void
}

export function ConversionRow(props: Props) {
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

    console.log(toAmount)
    return <Container>
        <IconContainer>

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

        <IconContainer>
            <ExchangeIcon onClick={() => {
                const oldFrom = from;
                const oldTo = to;
                const oldToAmount = toAmount;
                setFrom(oldTo);
                setTo(oldFrom);
                setFromAmount(+oldToAmount.roundedAmount[0])
            }}/>
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

const ExchangeIcon = styled.div`
  font-family: "grupoico", serif;
  cursor: pointer;
  border: solid 0px transparent;
  height: 100%;
  width: 100%;
  text-align: center;

  &:before {
    line-height: 34px;
    color: ${(props: StyleTheme) => props.theme.normalText};
    font-family: "grupoico", serif;
    content: '\\e896';
  }

  &:hover {
    background-color: ${(props: StyleTheme) => props.theme.borderDimFocus};
  }
`

const AmountContainer = styled.div`
  width: 25%;
`

const IconContainer = styled.div`
  width: 8.33333333333333333%;
`

const CurrencyContainer = styled.div`
  width: 16.666666666666666%;
`

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`