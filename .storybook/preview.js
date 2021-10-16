import styled, {ThemeProvider} from "styled-components";
import {lightTheme} from "../src/infrastructure/Theme/LightTheme";
import {darkTheme} from "../src/infrastructure/Theme/DarkTheme";
import useMockContainer from "../tests/Container.mock";
import {Container, mapToTheme} from "../src/infrastructure";
import {Provider} from "../src/infrastructure/DependencyInjection";

export const parameters = {
    backgrounds: {
        default: 'lightTheme',
        values: [
            {
                name: 'darkTheme',
                value: darkTheme.wrapperBackground,
            },
            {
                name: 'lightTheme',
                value: lightTheme.wrapperBackground,
            },
        ],
    },
    actions: {argTypesRegex: "^on[A-Z].*"},
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
}

export const globalTypes = {
    theme: {
        name: 'Theme',
        description: 'Global theme for components',
        defaultValue: 'lightTheme',
        toolbar: {
            icon: 'circlehollow',
            items: ['darkTheme', 'lightTheme'],
        },
    },
    width: {
        name: 'Width',
        description: 'Global width for components',
        defaultValue: 'options',
        toolbar: {
            icon: 'zoom',
            items: ['content', 'options', 'popup'],
        },
    }
};


const Wrapper = styled.div(props => ({
    width: '100%',
    height: '100%',
    backgroundColor: props.theme.wrapperBackground,
    margin: 0,
    padding: 0,
}));

const InnerWrapperPopup = styled.div`
  width: 600px;
  height: fit-content;
  padding: 20px;
  border-width: 1px;
  margin: auto;
`

const InnerWrapperOptions = styled.div`
  max-width: 800px;
  margin: auto;
  border: 0;
`

const InnerWrapperContent = styled.div`
  width: 450px;
  height: fit-content;
  z-index: 99999;
  right: 10px;
  top: 10px;
  position: fixed;
`

export const decorators = [
    (Story, context) => {
        const container = useMockContainer();
        const provider = Container.getOrCreate<Provider>(() => container);
        provider.colorTheme.setValue(context.globals.theme);

        function create(Inner) {
            return <ThemeProvider theme={mapToTheme(provider.colorTheme.value)}>
                <Wrapper>
                    <Inner>
                        <Story/>
                    </Inner>
                </Wrapper>
            </ThemeProvider>
        }

        switch (context.globals.width.toLowerCase()) {
            case 'content':
                return create(InnerWrapperContent)
            default:
            case 'options':
                return create(InnerWrapperOptions)
            case 'popup':
                return create(InnerWrapperPopup)

        }
    },
];