import { useProvider } from '../../../di'
import {
	ButtonGrid,
	Div,
	FooterText,
	Link,
	Percent,
	Pixel,
	PrimaryButton,
	SecondaryButton,
	Space,
	Title,
	WithChildren,
} from '../../atoms'
import { useIsLoading } from '../../atoms/contexts/ConfigurationProvider'
import { Converter } from '../converter'

const Container = ( { children }: WithChildren ) =>
	<Div css={ ( classname ) => <style jsx>{ `
      .${ classname } {
        max-width: calc(${ Percent.all } - ${ Pixel.of( 20 ) });
        width: ${ Pixel.of( 600 ) };
        height: fit-content;
        padding: ${ Pixel.of( 20 ) };
        border-width: ${ Pixel.one };
      }
	` }</style> }>{ children }</Div>

export function PopupApp() {
	if ( useIsLoading() ) return <Title text="Loading..."/>
	const { browser, tabMessenger } = useProvider()

	return <Container>
		<Title text="Universal Automatic Currency Converter"/>
		<Converter/>
		<Space height={ Pixel.halfField }/>
		<ButtonGrid isRow={ false }>
			<SecondaryButton onClick={ () => tabMessenger.openContextMenu() }
			                 text="Open context menu"/>
			<PrimaryButton onClick={ () => window.open( './options.html', '_blank' ) }
			               text="Go to settings"/>
		</ButtonGrid>
		<FooterText text="Like or hate this extension?"/>
		<FooterText><Link text="Leave a review" href={ browser.reviewLink } target="_blank"/></FooterText>
		<FooterText text={ `Version ${ browser.extensionVersion } created by ${ browser.author }` }/>
	</Container>
}