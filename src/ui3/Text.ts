export type SubTitleProps = {
    text: string
}

export type TextProps = {
    text: string
}

export type LinkProps = {
    text: string
    href: string
    target?: string
}

export class Section {
    static subtitle( { text }: SubTitleProps ) {
        const div = document.createElement( "div" )
        div.className = "uacc-section-subtitle"
        div.textContent = text
        return div
    }
}

export class Text {
    static title( { text }: TextProps ): HTMLDivElement {
        const div = document.createElement( "div" )
        div.className = "uacc-title"
        div.textContent = text
        return div
    }

    static footer( { text }: TextProps ): HTMLDivElement {
        const div = document.createElement( "div" )
        div.className = "uacc-footer-text"
        div.textContent = text
        return div
    }

    static link( { text, href, target }: LinkProps ): HTMLAnchorElement {
        const a = document.createElement( "a" )
        a.className = "uacc-link"
        a.textContent = text
        a.href = href
        a.target = target ?? "_blank"
        a.rel = "noopener noreferrer"
        return a
    }
}