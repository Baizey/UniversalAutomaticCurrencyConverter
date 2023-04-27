import {DeleteIcon, Title, useTheme} from '../../atoms'
import {PropsWithChildren} from "preact/compat";
import {css, Div, DivProps} from "@baizey/styled-preact";

export type AlertSectionProps = PropsWithChildren & {
    title?: string;
    onDismiss: () => void;
};

const DismissWrapper = (props: DivProps) => <Div {...props} styling={css`
  
    width: 30px;
    height: 30px;
    position: absolute;
    margin-top: 5px;
    right: 5px;
    cursor: pointer;

  &:hover * {
    filter: brightness(85%);
  }
`}/>

const InnerWrapper = (props: PropsWithChildren) => <Div {...props} styling={css`
  
    width: calc(100% - 10px);
    padding: 5px;
    height: fit-content;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
  
`}/>

const Container = (props: PropsWithChildren) => <Div {...props} styling={css`
  
    width: 100%;
    height: fit-content;
    margin: 0;
    background-color: ${useTheme().containerBackground};
  
`}/>

export function AlertSection({title, children, onDismiss}: AlertSectionProps) {
    const theme = useTheme()
    return (
        <Container>
            <DismissWrapper onClick={onDismiss}>
                <DeleteIcon
                    width={'30px'}
                    height={'30px'}
                    color={theme.errorBackground}
                />
            </DismissWrapper>
            <InnerWrapper>
                {title ? <Title text={title}/> : <></>}
                {children}
            </InnerWrapper>
        </Container>
    )
}