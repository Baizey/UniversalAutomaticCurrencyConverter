import {IBuiltContainer} from "./Container";

export interface IScopedService<T> {
    readonly instance: T;

    override(input: (container: IBuiltContainer) => T): IScopedService<T>;
}