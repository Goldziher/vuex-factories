import { Dictionary } from './types'

export const reduceToDict = (inputArr: [string, any][]): Dictionary =>
	inputArr.reduce(
		(obj, [key, value]) => ((obj[key] = value), obj),
		{} as { [k: string]: any },
	)

export function handleValue(option: {
	value?: any
	key?: string | number
	payload?: any
	name: string
}): any {
	if (typeof option.value !== 'undefined') {
		return option.value
	}
	if (option.key && option.payload[option.key] !== 'undefined') {
		return option.payload[option.key]
	}
	if (option.payload !== 'undefined') {
		return option.payload
	}
	throw new Error(
		`empty is false while both value and payload are undefined for option ${option.name}, please specify empty: true to pass an undefined value`,
	)
}
