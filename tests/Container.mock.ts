import { addDependencies, IBrowser, Provider } from "../src/infrastructure";
import { BrowserMock } from "./Browser.mock";
import { Container, WeakProvider } from "../src/infrastructure/DependencyInjection/Provider";
import { ServiceCollection, ServiceProvider } from "sharp-dependency-injection/lib";

function addNodeIfNotExisting() {
  if (!global.Node) {
    // @ts-ignore
    global.Node = {
      TEXT_NODE: 3
    };
  }
}

function mockContainer(): ServiceProvider<Provider> {
  const services = addDependencies(new ServiceCollection(WeakProvider));
  services.replaceSingleton<IBrowser>({ dependency: BrowserMock, selector: p => p.browser });
  Container.getOrCreate(() => services);
  return services.build();
}

export default function useMockContainer(): ServiceProvider<Provider> {
  addNodeIfNotExisting();
  return mockContainer();
}