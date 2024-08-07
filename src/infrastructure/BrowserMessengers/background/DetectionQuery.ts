import {Query} from "../messengerHandlerManager";
import {BackgroundMessageType} from "./BackgroundMessageType";
import {PseudoNode} from "../../../currencyConverter/Detection/pseudoTypes";
import {Providable} from "../../../provideable";

export type DetectionBackgroundMessage = {
    type: BackgroundMessageType.detect
    root: PseudoNode
}
export type DetectionResponse = number[]

export class DetectionQuery implements Query<DetectionBackgroundMessage, DetectionResponse> {
    readonly key = BackgroundMessageType.detect
    private readonly provider: Providable;

    constructor(provider: {}) {
        this.provider = provider as Providable
    }

    async handle({root}: DetectionBackgroundMessage) {
        const {pseudoFlat} = this.provider
        return pseudoFlat.find(root)
    }
}