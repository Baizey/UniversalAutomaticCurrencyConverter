import {Configuration} from "../Infrastructure";
import {IActiveLocalization} from "./Localization";
import {ITextDetector} from "./Detection";
import {IBuiltContainer} from "../Infrastructure/DependencyInjection/Container";

export class Startup {
    private localization: IActiveLocalization;
    private config: Configuration;
    private detector: ITextDetector;

    constructor({configuration, activeLocalization, textDetector}: IBuiltContainer) {
        this.config = configuration
        this.localization = activeLocalization
        this.detector = textDetector;
    }

    async load(): Promise<void> {
        await this.config.load();
        await this.localization.load();
    }
}