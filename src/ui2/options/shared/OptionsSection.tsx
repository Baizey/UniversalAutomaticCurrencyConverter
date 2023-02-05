import { Div, Title, useTheme, WithChildren } from '../../atoms'

type Props = WithChildren & {
	title?: string;
};

const Container = ( { children }: WithChildren ) => {
	const theme = useTheme()
	return <Div css={ classname => <style jsx>{ `
      .${ classname } {
        padding: 10px;
        background-color: ${ theme.containerBackground };
        display: flex;
        flex-direction: column;
        border-width: 1px;
        border-color: ${ theme.containerBorder };

        // On small screens force column-mode, breakpoint is ~655px but 700px sounds nicer
        @media (max-width: 820px) {
          margin-left: 10px;
          margin-right: 10px;
        }
      }


      .${ classname }:first-child {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }

      .${ classname }:not(:first-child) {
        margin-top: 10px;
      }

      .${ classname }:last-child {
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
      }

      .${ classname }:not(:last-child) {
      }
	` }</style> }>{ children }</Div>
}

export function OptionsSection( { title, children }: Props ) {
	return (
		<Container>
			{ title ? <Title>{ title }</Title> : <></> }
			{ children }
		</Container>
	)
}