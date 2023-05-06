export interface PseudoNode {
    readonly id: number
    readonly watched: boolean
    readonly children: (string | PseudoNode)[]
    readonly tagName: string
}