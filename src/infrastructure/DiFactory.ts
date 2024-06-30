import {DependencyInformation, singleton} from "@baizey/dependency-injection";

export type FactoryDi<P, T> = { create: (props: P) => T }

type FactoryConstructor<P, T> = {
    new(providable: any, props: P): T
}

export function factory<P, T>(Constructor: FactoryConstructor<P, T>): DependencyInformation<FactoryDi<P, T>, any> {
    return singleton<FactoryDi<P, T>, any>({
        factory: (providable: any) => ({
            create: (props: P) => new Constructor(providable, props)
        })
    })
}