import { FooterText, HeaderText, Link, Text, Title } from './Text'

const defaultProps = {
	text: 'lorem ipsum',
}
type Props = typeof defaultProps

export default {
	title: 'Atoms/Texts',
	component: Text,
	args: defaultProps,
}

export const text = ( props: Props ) => <Text { ...props }/>
export const link = ( props: Props ) => <Link { ...props } href="" target=""/>
export const title = ( props: Props ) => <Title { ...props }/>
export const header = ( props: Props ) => <HeaderText { ...props }/>
export const footer = ( props: Props ) => <FooterText { ...props }/>