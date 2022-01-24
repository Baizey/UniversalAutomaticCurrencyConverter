import { IActiveLocalization } from "../Localization";
import { CurrencyRegex, RegexResult } from "./CurrencyRegex";
import { IBackendApi } from "../BackendApi";
import { Provider } from "../../infrastructure/DependencyInjection";

export interface ITextDetector {
  detect(text: string): boolean;

  find(text: string): RegexResult[];
}

export class TextDetector implements ITextDetector {
  private readonly backendApi: IBackendApi;
  private localization: IActiveLocalization;

  constructor({ backendApi, activeLocalization }: Provider) {
    this.localization = activeLocalization;
    this.backendApi = backendApi;
  }

  find(text: string): RegexResult[] {
    const result: RegexResult[] = [];
    const regex = new CurrencyRegex(text);
    while (true) {
      const r = regex.next();
      if (!r) return result;
      if (this.isCurrency(r))
        result.push(r);
    }
  }

  detect(text: string) {
    const regex = new CurrencyRegex(text);

    if (!regex.test()) return false;

    while (true) {
      const result = regex.next();

      if (!result) return false;

      if (this.isCurrency(result))
        return true;
    }
  }

  private isCurrency(data: { currencies: string[] }): boolean {
    const currencies = data.currencies.map(e => this.localization.parseCurrency(e));
    const currency = currencies.filter(e => e)[0];
    return !!currency;
  }

}