import {BuiltContainer} from "./Container";

export interface IScopedService<T> {
    readonly instance: T;

    override(input: (container: BuiltContainer) => T): IScopedService<T>;
}