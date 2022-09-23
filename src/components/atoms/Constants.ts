interface StyleSize<V extends number> {
	value: number;
	pixel: `${ V }px`;
}

const create = <V extends number>( value: V ): StyleSize<V> => ( {
	value: value,
	pixel: `${ value }px`,
} )

export const TitleSize = create( 20 )
export const TextSize = create( 15 )
export const SmallTextSize = create( 12 )

export const FieldHeight = create( 40 )
export const HalfFieldHeight = create( 20 )
export const HalfBorderFieldHeight = create( 39 )
