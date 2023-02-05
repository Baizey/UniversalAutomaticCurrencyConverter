import { WithChildren } from '../core'
import { createClassName, Pixel } from '../utils'

type ContainerProps = { isRow?: boolean } & WithChildren

const radius = Pixel.of( 5 )
export const ButtonGrid = ( { isRow, children }: ContainerProps ) => {
	const classname = createClassName()
	return <div
		className={ classname }
		style={ {
			display: 'flex',
			width: '100%',
			flexFlow: isRow ? 'row' : 'column',
		} }
	>
		<style jsx>{ `
          .${ classname } > button {
            border-radius: 0;
            border-top-width: ${ isRow ? Pixel.one : 0 };
            border-right-width: ${ isRow ? 0 : Pixel.one };
          }

          .${ classname } > button:nth-child(2) {
            border-top-left-radius: ${ radius };
            border-bottom-left-radius: ${ isRow ? radius : 0 };
            border-top-right-radius: ${ isRow ? 0 : radius };
            border-bottom-right-radius: 0;
            border-top-width: ${ Pixel.one };
          }

          .${ classname } > button:last-child {
            border-bottom-right-radius: ${ radius };
            border-top-right-radius: ${ isRow ? radius : 0 };
            border-bottom-left-radius: ${ isRow ? 0 : radius };
            border-top-left-radius: 0;
            border-right-width: ${ Pixel.one };
          }

          .${ classname } > button:only-child {
            border-radius: ${ radius };
          }
		` }</style>
		{ children }
	</div>
}