import * as React from 'react'
import { ReactNode, useEffect, useState } from 'react'
import { useProvider } from '../../di'
import { SuccessButton } from '../atoms'
import { ConversionRow } from './ConversionRow'

export function Converter() {
	const {
		metaConfig: { miniConverter },
		currencyTagConfig: { convertTo },
	} = useProvider()
	const [ rowsData, setRowsData ] = useState( miniConverter.value )
	const [ isLoading, setIsLoading ] = useState( true )
	const [ rows, setRows ] = useState<ReactNode[]>( [] )

	useEffect( () => {
		setRows(
			rowsData.map( ( row, i ) => (
				<ConversionRow
					key={ `conversion_row_${ i }_${ row.from }_${ row.to }` }
					onDelete={ () => setRowsData( rowsData.filter( ( e, j ) => j !== i ) ) }
					onChange={ async ( data ) => {
						rowsData[i] = data
						await miniConverter.setAndSaveValue( rowsData )
					} }
					from={ row.from }
					to={ row.to }
					amount={ row.amount }
				/>
			) ),
		)
	}, [ rowsData.length ] )

	useEffect( () => {
		miniConverter
			.loadSetting()
			.then( () => setRowsData( miniConverter.value ) )
			.finally( () => setIsLoading( false ) )
	}, [] )

	return (
		<>
			{ rows }
			<SuccessButton
				onClick={ async () => {
					if ( isLoading ) return
					const newRows = rowsData.concat( [
						{
							from: convertTo.value,
							to: convertTo.value,
							amount: 1,
						},
					] )
					if ( await miniConverter.setAndSaveValue( newRows ) ) {
						setRowsData( newRows )
					}
				} }
				connect={ { up: true } }
			>
				Add conversion row
			</SuccessButton>
		</>
	)
}
