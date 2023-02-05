import { useSignal } from '@preact/signals'
import { useEffect } from 'preact/compat'
import { useProvider } from '../../di'
import { ButtonGrid, Fun, SuccessButton } from '../atoms'
import { ConversionRow } from './conversionRow'

export const Converter: Fun = () => {
	const {
		metaConfig: { miniConverter },
		currencyTagConfig: { convertTo },
	} = useProvider()
	const rowData = useSignal( miniConverter.value ?? [] )
	const isLoading = useSignal( true )
	let rows = useSignal<any[]>( [] )

	useEffect( () => {
		const data = rowData.value
		rows.value = data.map( ( row, i ) => (
			<ConversionRow
				onDelete={ async () => {
					const newRows = rowData.value = ( data.filter( ( e, j ) => j !== i ) )
					if ( await miniConverter.setAndSaveValue( newRows ) ) rowData.value = newRows
				}
				}
				onInput={ async ( d ) => {
					data[i] = d
					await miniConverter.setAndSaveValue( data )
				} }
				from={ row.from }
				to={ row.to }
				amount={ row.amount }
			/>
		) )
	}, [ rowData.value.length ] )

	useEffect( () => {
		miniConverter
			.loadSetting()
			.finally( () => {
				rowData.value = miniConverter.value
				isLoading.value = false
			} )
	}, [] )

	const onAddButton = async () => {
		if ( isLoading.value ) return
		const newRows = rowData.value.concat( [
			{
				from: convertTo.value,
				to: convertTo.value,
				amount: 1,
			},
		] )
		if ( await miniConverter.setAndSaveValue( newRows ) ) rowData.value = newRows

	}

	return <ButtonGrid>
		{ rows.value }
		<SuccessButton onClick={ onAddButton }>
			Add conversion row
		</SuccessButton>
	</ButtonGrid>

}
