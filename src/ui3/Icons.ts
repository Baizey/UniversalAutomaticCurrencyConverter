const SVG_NS = "http://www.w3.org/2000/svg";

type SvgChild = { tag: string; attrs: Record<string, string> };

function createSvg( children: SvgChild[] ): SVGSVGElement {
    const svg = document.createElementNS( SVG_NS, "svg" );
    svg.setAttribute( "viewBox", "0 0 24 24" );
    svg.setAttribute( "fill", "none" );
    svg.setAttribute( "stroke", "currentColor" );
    svg.setAttribute( "stroke-width", "2" );
    svg.setAttribute( "stroke-linecap", "round" );
    svg.setAttribute( "stroke-linejoin", "round" );
    svg.classList.add( "uacc-icon-svg" );
    children.forEach( ( { tag, attrs } ) => {
        const el = document.createElementNS( SVG_NS, tag );
        Object.entries( attrs ).forEach( ( [ key, value ] ) => el.setAttribute( key, value ) );
        svg.appendChild( el );
    } );
    return svg;
}

export class Icons {
    static remove(): SVGSVGElement {
        return createSvg( [
            { tag: "polyline", attrs: { points: "3 6 5 6 21 6" } },
            { tag: "path", attrs: { d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" } },
            { tag: "line", attrs: { x1: "10", y1: "11", x2: "10", y2: "17" } },
            { tag: "line", attrs: { x1: "14", y1: "11", x2: "14", y2: "17" } },
        ] );
    }

    static exchange(): SVGSVGElement {
        return createSvg( [
            { tag: "polyline", attrs: { points: "17 1 21 5 17 9" } },
            { tag: "path", attrs: { d: "M3 11V9a4 4 0 0 1 4-4h14" } },
            { tag: "polyline", attrs: { points: "7 23 3 19 7 15" } },
            { tag: "path", attrs: { d: "M21 13v2a4 4 0 0 1-4 4H3" } },
        ] );
    }

    static close(): SVGSVGElement {
        return createSvg( [
            { tag: "line", attrs: { x1: "18", y1: "6", x2: "6", y2: "18" } },
            { tag: "line", attrs: { x1: "6", y1: "6", x2: "18", y2: "18" } },
        ] );
    }
}
