export function storybookEnum( someEnum: object ) {
	return {
		options: Object.keys( someEnum ),
		mapping: someEnum,
		control: {
			type: 'select',
			labels: Object.values( someEnum ).filter(
				( value ) => typeof value === 'string',
			),
		},
	}
}