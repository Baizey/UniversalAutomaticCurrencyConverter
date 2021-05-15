import {ConversionRow} from './ConversionRow';
import {Button} from '../Atoms';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {useProvider} from '../Infrastructure';

export function Converter() {
    const {miniConverter, convertTo, theme} = useProvider()
    const [rows, setRows] = useState(miniConverter.value);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        miniConverter.loadSetting()
            .then(() => setRows(miniConverter.value))
            .finally(() => setIsLoading(false))
    }, [])

    return <>
        {rows.map((row, i) => <ConversionRow
            key={`conversion_row_${i}_${row.from}_${row.to}_${row.amount}`}
            onDelete={() => setRows(rows.filter((e, j) => j !== i))}
            onChange={async data => {
                rows[i] = data
                if (await miniConverter.setAndSaveValue(rows))
                    setRows(rows)
            }}
            from={row.from}
            to={row.to} amount={row.amount}/>)}
        <Button
            color={theme.success}
            onClick={async () => {
                if (isLoading) return;
                const newRows = rows.concat([{from: convertTo.value, to: convertTo.value, amount: 1}])
                if (await miniConverter.setAndSaveValue(newRows))
                    setRows(newRows)
            }}
            connect={{up: true}}>
            Add conversion row
        </Button>
    </>
}