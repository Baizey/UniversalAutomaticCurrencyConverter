import {MessengerHandlerManager} from "../messengerHandlerManager";
import {BackgroundMessengerQueryDi, BrowserDiTypes} from "../../index";

export class BackgroundMessageHandler extends MessengerHandlerManager {
    constructor(p: BrowserDiTypes & BackgroundMessengerQueryDi) {
        super(p)
        this.add(p.backgroundGetRateQuery)
        this.add(p.backgroundGetSymbolQuery)
        this.add(p.backgroundDetectQuery)
    }
}