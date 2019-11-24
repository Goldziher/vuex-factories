import { ActionOption, MutationOption } from './types'

export const assignValue = (
	{ value, key }: ActionOption | MutationOption,
	payload?: any,
): any => {
	if (typeof value !== 'undefined') {
		return value
	} else if (key && payload[key] !== 'undefined') {
		return payload[key]
	} else if (payload !== 'undefined') {
		return payload
	}
	return undefined
}
