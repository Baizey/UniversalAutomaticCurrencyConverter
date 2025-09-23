export enum SemVerPart {
    major = 'major',
    minor = 'minor',
    patch = 'patch',
    none = 'none',
}

export class SemVersion {
    readonly patch: number
    readonly minor: number
    readonly major: number
    readonly asString: string

    private readonly key: number

    constructor( major?: number, minor?: number, patch?: number ) {
        this.patch = patch ?? 0
        this.minor = minor ?? 0
        this.major = major ?? 0
        this.key = this.patch
            + 1_000 * this.minor
            + 1_000_000 * this.major
        this.asString = `${ this.major }.${ this.minor }.${ this.patch }`
    }

    static parse( version: string ): SemVersion {
        const parts = version.split( '.' ).map( e => Number( e ) )
        return new SemVersion( parts[0], parts[1], parts[2] )
    }

    difference( other: SemVersion ): SemVerPart {
        if ( this.major !== other.major ) return SemVerPart.major
        if ( this.minor !== other.minor ) return SemVerPart.minor
        if ( this.patch !== other.patch ) return SemVerPart.patch
        return SemVerPart.none
    }

    isBetween( lower: SemVersion, upper: SemVersion ): boolean {
        return this.key > lower.key && this.key <= upper.key
    }

    toString(): string {
        return this.asString
    }
}