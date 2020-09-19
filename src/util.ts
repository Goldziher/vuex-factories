/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Dictionary } from './types'

export const reduceToDict = (inputArr: [string, any][]): Dictionary =>
	inputArr.reduce(
		(obj, [key, value]) => ((obj[key] = value), obj),
		{} as { [k: string]: any },
	)
