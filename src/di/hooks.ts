import {ProviderMock, ServiceCollection} from '@baizey/dependency-injection'
import {providable, Providable} from '../provideable'


export type Mockable = ProviderMock<Providable>

let _services: ServiceCollection<Providable> | undefined

let _proxy: Providable | undefined

export const useServices = (): ServiceCollection<Providable> => _services ?? (_services = new ServiceCollection(providable))

export const setMockProvider = (mock?: Mockable): Providable => _proxy = useServices().buildMock(mock).proxy

export const useProvider = (): Providable => _proxy ?? (_proxy = useServices().build().proxy)

export const handleError = (error: Error, message?: string): void => useProvider().logger.error(error, message)

export const log = {
    info: (msg: string) => useProvider().logger.info(msg),
    debug: (msg: string) => useProvider().logger.debug(msg),
    warn: (msg: string) => useProvider().logger.warn(msg),
    error: (error: Error, msg?: string) => useProvider().logger.error(error, msg),
}