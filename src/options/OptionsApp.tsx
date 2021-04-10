import styled from "styled-components";
import * as react from 'react'
import Option from './Option'
import OptionsSection from "./OptionsSection";
import OptionRow from "./OptionRow";
import {Checkbox, Dropdown, Input} from "../Atoms";
import Search from "../Atoms/Search";

const React = react;

export default function OptionsApp(): JSX.Element {
    return <Background>
        <Container>
            <OptionsSection title={"Title"}>
                <OptionRow>
                    <Option title={"sub-title"} help={"Help"}>
                        <Checkbox initialValue={true} onChange={() => undefined}/>
                    </Option>
                    <Option title={"sub-title"}>
                        <Dropdown options={[
                            {value: 'DKK', text: 'Krone'},
                            {value: 'USD', text: 'USD'}
                        ]} onChange={() => undefined}/>
                    </Option>
                    <Option title={"sub"}>
                        <Input type={"text"} defaultValue={"lol"} onChange={() => {
                        }}/>
                    </Option>
                </OptionRow>
            </OptionsSection>
            <OptionsSection title={"Title"}>
                <OptionRow>
                    <Option title={"sub-title"}>
                        <Search options={[{value: 'banana', name: 'apple'}]} onChange={(e) => {
                            console.log(e);
                        }}/>
                    </Option>
                    <Option title={"sub-title"}>
                        <Dropdown options={[
                            {value: 'DKK', text: 'Krone'},
                            {value: 'USD', text: 'USD'}
                        ]} onChange={() => undefined}/>
                    </Option>
                    <Option title={"sub-title"}>
                        <Dropdown options={[
                            {value: 'DKK', text: 'Krone'},
                            {value: 'USD', text: 'USD'}
                        ]} onChange={() => undefined}/>
                    </Option>
                </OptionRow>
            </OptionsSection>
        </Container>
    </Background>
}

const Background = styled.div`
  width: 100%;
  height: 100%;
  background-color: #0F171E;
  color: #d0d0d0;
  padding: 0;
  margin: 0;
`;

const Container = styled.div`
  width: 800px;
  margin-left: auto;
  margin-right: auto;
`;