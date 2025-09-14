export type SubTitleProps = {
    text: string
}

export class Section {
    static subtitle( { text }: SubTitleProps ) {
        const div = document.createElement( "div" )
        div.className = "uacc-section-subtitle"
        div.textContent = text
        return div
    }
}