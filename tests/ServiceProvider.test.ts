import useMockContainer from "./Container.mock";
import {ServiceProvider} from "sharp-dependency-injection/lib";
import {Provider} from "../src/infrastructure";

describe('Dependency Injection', () => {
    it(`Validate container`, () => {
        (useMockContainer() as ServiceProvider<Provider>)._.container.validate();
        expect(true).toBeTruthy();
    });
});