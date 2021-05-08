import {ConversionRow} from './ConversionRow';
import {Button} from '../Atoms';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {useTheme} from 'styled-components';
import {MyTheme} from '../Atoms/StyleTheme';
import {useSettings} from '../Infrastructure/DependencyInjection';

export function Converter() {
    const theme = useTheme() as MyTheme
    const {miniConverterRows, convertTo} = useSettings()
    const [rows, setRows] = useState(miniConverterRows.value);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        miniConverterRows.loadSetting()
            .then(() => setRows(miniConverterRows.value))
            .finally(() => setIsLoading(false))
    }, [])

    return <>
        {rows.map((row, i) => <ConversionRow
            key={`conversion_row_${i}_${row.from}_${row.to}_${row.amount}`}
            onDelete={() => setRows(rows.filter((e, j) => j !== i))}
            onChange={async data => {
                rows[i] = data
                if(await miniConverterRows.setAndSaveValue(rows))
                    setRows(rows)
            }}
            from={row.from}
            to={row.to} amount={row.amount}/>)}
        <Button color={theme.success}
                onClick={async () => {
                    if(isLoading) return;
                    const newRows = rows.concat([{from: convertTo.value, to: convertTo.value, amount: 1}])
                    if(await miniConverterRows.setAndSaveValue(newRows))
                        setRows(newRows)
                }}
                connect={{up: true}}>
            Add conversion row
        </Button>
    </>
}