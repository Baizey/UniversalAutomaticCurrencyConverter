import { DeleteIcon, Div, Title, useTheme, WithActions, WithChildren } from '../../atoms'

export type AlertSectionProps = WithChildren & {
	title?: string;
	onDismiss: () => void;
};

const a = ( props: WithChildren ) => <Div { ...props } css={ classname => <style jsx>{ `
  .${ classname } {

  }
` }</style> }/>


const DismissWrapper = ( props: WithActions ) => <Div { ...props } css={ classname => <style jsx>{ `
  .${ classname } {
    width: 30px;
    height: 30px;
    position: absolute;
    margin-top: 5px;
    right: 5px;
    cursor: pointer;
  }

  .${ classname }:hover * {
    filter: brightness(85%);
  }
` }</style> }/>

const InnerWrapper = ( props: WithChildren ) => <Div { ...props } css={ classname => <style jsx>{ `
  .${ classname } {
    width: calc(100% - 10px);
    padding: 5px;
    height: fit-content;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
  }
` }</style> }/>

const Container = ( props: WithChildren ) => <Div { ...props } css={ classname => <style jsx>{ `
  .${ classname } {
    width: 100%;
    height: fit-content;
    margin: 0;
    background-color: ${ useTheme().containerBackground };
  }
` }</style> }/>

export function AlertSection( { title, children, onDismiss }: AlertSectionProps ) {
	const theme = useTheme()
	return (
		<Container>
			<DismissWrapper onClick={ onDismiss }>
				<DeleteIcon
					width={ '30px' }
					height={ '30px' }
					color={ theme.errorBackground }
				/>
			</DismissWrapper>
			<InnerWrapper>
				{ title ? <Title text={ title }/> : <></> }
				{ children }
			</InnerWrapper>
		</Container>
	)
}