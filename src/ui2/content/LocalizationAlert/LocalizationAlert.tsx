import { useEffect, useState } from 'preact/compat'
import { useProvider } from '../../../di'
import { ButtonGrid, Div, HeaderText, Pixel, PrimaryButton, Radiobox, Space, Text, WithChildren } from '../../atoms'
import { Size } from '../../atoms/utils/Size'
import { AlertSection } from '../AlertSection'

type Props = { setDismissed: () => void };

const Header = HeaderText

const Currency = Text

type OptionWrapperType = { height: number } & WithChildren;
const OptionWrapper = ( { height, ...props }: OptionWrapperType ) =>
	<Div { ...props } style={ {
		width: '100%',
		height: Pixel.of( height ),
		display: 'flex',
		flexDirection: 'row',
	} }/>

const Option = ( props: WithChildren ) =>
	<Div { ...props } style={ {
		width: '50%',
	} }/>

export function LocalizationAlert( props: Props ) {
	const [ useDetected, setUseDetected ] = useState( true )
	const {
		activeLocalization,
		tabState,
	} = useProvider()

	useEffect( () => {
		activeLocalization.reset( !useDetected )
	}, [ useDetected ] )

	const kroneConflict = activeLocalization.krone.hasConflict()
	const dollarConflict = activeLocalization.dollar.hasConflict()
	const yenConflict = activeLocalization.yen.hasConflict()

	async function updateLocalization( useDetected: boolean ) {
		setUseDetected( useDetected )
		if ( useDetected ) {
			await activeLocalization.overloadWithDetected()
		} else {
			await activeLocalization.overloadWithDefaults()
		}
		await activeLocalization.save()
		await tabState.updateDisplay()
	}


	const onSaveAndDismiss = async () => {
		await activeLocalization.setLocked( true )
		props.setDismissed()
	}
	return (
		<AlertSection onDismiss={ props.setDismissed } title="Localization alert">
			<OptionWrapper height={ Size.field * 3 }>
				<Option>
					<Header>Use detected</Header>
					{ kroneConflict ? (
						<Currency>{ activeLocalization.krone.detectedValue }</Currency>
					) : (
						<></>
					) }
					{ dollarConflict ? (
						<Currency>{ activeLocalization.dollar.detectedValue }</Currency>
					) : (
						<></>
					) }
					{ yenConflict ? (
						<Currency>{ activeLocalization.yen.detectedValue }</Currency>
					) : (
						<></>
					) }
					<Space height={ Pixel.of( 5 ) }/>
					<Radiobox
						value={ useDetected }
						onClick={ () => updateLocalization( true ) }
						onInput={ () => {} }
					/>
				</Option>
				<Option>
					<Header>Use your defaults</Header>
					{ kroneConflict ? (
						<Currency>{ activeLocalization.krone.defaultValue }</Currency>
					) : (
						<></>
					) }
					{ dollarConflict ? (
						<Currency>{ activeLocalization.dollar.defaultValue }</Currency>
					) : (
						<></>
					) }
					{ yenConflict ? (
						<Currency>{ activeLocalization.yen.defaultValue }</Currency>
					) : (
						<></>
					) }
					<Space height={ Pixel.of( 5 ) }/>
					<Radiobox
						value={ !useDetected }
						onClick={ () => updateLocalization( false ) }
						onInput={ () => {} }
					/>
				</Option>
			</OptionWrapper>
			<ButtonGrid>
				<PrimaryButton onClick={ onSaveAndDismiss }>
					Save as site default and dont ask again
				</PrimaryButton>
			</ButtonGrid>
		</AlertSection>
	)
}