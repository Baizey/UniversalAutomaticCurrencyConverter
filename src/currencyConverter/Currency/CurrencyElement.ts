import { ElementSnapshot } from "./ElementSnapshot";
import { ITextDetector } from "../Detection";
import { IBackendApi } from "../BackendApi";
import { CurrencyAmount } from "./CurrencyAmount";
import { IActiveLocalization } from "../Localization";
import { ILogger, Provider, useProvider } from "../../infrastructure";

type CurrencyInfo = {
  original: CurrencyAmount,
  converted: CurrencyAmount | null,
  left: { start: number, end: number }
  center: { start: number, end: number }
  right: { start: number, end: number }
}

export class CurrencyElement {
  private static nextId: number = 1;

  isHovered: boolean = false;
  readonly id: number;

  readonly element: HTMLElement;
  private readonly detector: ITextDetector;
  private readonly backendApi: IBackendApi;

  private original: ElementSnapshot;
  private converted: ElementSnapshot;
  private conversionTo: string;
  private localization: IActiveLocalization;
  private readonly provider: Provider;
  private logger: ILogger;

  constructor(provider: Provider,
              element: HTMLElement) {
    const {
      backendApi,
      textDetector,
      activeLocalization,
      logger
    } = provider;
    this.logger = logger;
    this.id = ++CurrencyElement.nextId;
    this.provider = provider;

    this.element = element;

    this.localization = activeLocalization;
    this.backendApi = backendApi;
    this.detector = textDetector;

    this.original = new ElementSnapshot(element);
    this.converted = this.original.clone();

    this._isShowingConversion = false;
    this.conversionTo = "";
  }

  private _isShowingConversion: boolean;

  get isShowingConversion(): boolean {
    return this._isShowingConversion;
  }

  async convertTo(currency: string): Promise<void> {
    this.conversionTo = currency;
    await this.updateDisplay();
  }

  show(): Promise<boolean> {
    const { tabState } = useProvider();
    if (tabState.isPaused)
      return this.showOriginal();

    return tabState.isShowingConversions
      ? this.showConverted()
      : this.showOriginal();
  }

  async showConverted(): Promise<boolean> {
    this._isShowingConversion = true;
    if (this.hasUpToDateSnapshots()) {
      this.converted.display();
      return false;
    }
    await this.updateDisplay();
    return true;
  }

  async showOriginal(): Promise<boolean> {
    this._isShowingConversion = false;
    if (this.hasUpToDateSnapshots()) {
      this.original.display();
      return false;
    }
    await this.updateDisplay();
    return true;
  }

  async flipDisplay(): Promise<void> {
    if (this._isShowingConversion) {
      const updated = await this.showOriginal();
      if (updated) await this.showConverted();
    } else await this.showConverted();
  }

  async updateDisplay(): Promise<void> {
    this.updateSnapshots();
    await this.convert();
    if (this._isShowingConversion) this.converted.display();
    else this.original.display();
  }

  setupListener(): void {
    const self = this;
    this.element.classList.add("uacc-clickable");

    const convertOnClick = this.provider.usingLeftClickFlipConversion.value;
    const convertOnHover = this.provider.usingHoverFlipConversion.value;
    const shortcutHover = this.provider.convertHoverShortcut.value;

    if (convertOnClick)
      this.element.addEventListener("click", () => self.flipDisplay());

    if (shortcutHover) {
      this.element.addEventListener("mouseover", () => this.isHovered = true);
      this.element.addEventListener("mouseout", () => this.isHovered = false);
    }

    if (convertOnHover) {
      this.element.addEventListener("mouseover", () => self.flipDisplay());
      this.element.addEventListener("mouseout", () => self.flipDisplay());
    }
  }

  async convert(): Promise<void> {
    if (!this.conversionTo) return;
    this.converted = this.original.clone();

    const texts = this.converted.texts;
    const indexes = texts.map(e => e.length);
    for (let i = 0; i < indexes.length; i++) indexes[i] = (indexes[i - 1] || 0) + (texts[i - 1]?.length || 0) + (i && 1);

    const text = texts.join(" ");

    const result = this.detector.find(text);

    const currencyInfo: CurrencyInfo[] = await Promise.all(result.map(async r => {
      const currency = this.localization.parseCurrency(r.currencies[0]) || this.localization.parseCurrency(r.currencies[1]) || "";
      const numbers = r.amounts.map(e => Number(`${e.neg + e.integer}.${e.decimal}`));
      const amount = new CurrencyAmount(this.provider, currency, numbers);

      let left, right;
      if (this.localization.parseCurrency(r.currencies[0])) {
        left = r.indexes[0];
        right = r.indexes[4];
      } else {
        left = r.indexes[1];
        right = r.indexes[5];
      }
      return {
        original: amount,
        converted: await amount.convertTo(this.conversionTo),
        left: { start: left, end: r.indexes[2] },
        center: { start: r.indexes[2], end: r.indexes[3] },
        right: { start: r.indexes[3], end: right }
      };
    }));
    let node = texts.length - 1;

    function replace(start: number, end: number, replacement?: string): any {
      if (start === end) return;
      // Move through nodes until we find contact
      while (indexes[node] >= end) node--;
      if (node < 0) return;

      // If replacing, expect to only be within 1 node
      if (replacement) {
        return texts[node] =
          texts[node].substr(0, start - indexes[node]) +
          replacement +
          texts[node].substr(end - indexes[node]);
      }

      // If both start end end is within same node
      if (start >= indexes[node])
        return texts[node] =
          texts[node].substr(0, start - indexes[node]) +
          texts[node].substr(end - indexes[node]);

      // Handle if we need to remove text in multiple nodes

      texts[node] = texts[node].substr(end - indexes[node]);
      while (start <= indexes[node]) texts[node--] = "";
      texts[node] = texts[node].substr(0, start - indexes[node]);
    }

    currencyInfo.reverse().forEach(info => {
      if (!info.converted) return;
      const text = this.provider.showConversionInBrackets.value
        ? `${info.original.amount.join(" - ")} ${info.original.tag} (${info.converted.toString()})`
        : info.converted.toString();

      replace(info.right.start, info.right.end);
      replace(info.center.start, info.center.end, text);
      replace(info.left.start, info.left.end);
    });
  }

  hasUpToDateSnapshots(): boolean {
    const snapshot = new ElementSnapshot(this.element);
    if (snapshot.isEqual(this.original)) return true;
    return snapshot.isEqual(this.converted);

  }

  updateSnapshots(): void {
    if (this.hasUpToDateSnapshots()) return;
    const snapshot = new ElementSnapshot(this.element);
    this.original = snapshot;
    this.converted = snapshot.clone();
  }

  highlight() {
    if (!this.provider.usingConversionHighlighting.value) return;
    const color = this.provider.highlightColor.value;
    const duration = this.provider.highlightDuration.value;
    const oldColor = this.element.style.textShadow;
    this.element.style.textShadow = `${color}  2px 0px 2px, ${color} -2px 0px 2px, ${color}  4px 0px 4px, ${color} -4px 0px 4px, ${color}  6px 0px 6px, ${color} -6px 0px 6px`;
    setTimeout(() => this.element.style.textShadow = oldColor, Math.max(1, duration));
  }
}

