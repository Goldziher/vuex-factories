import { MutationOption } from './types'
import { MutationTree } from 'vuex'
import { assignValue } from './util'

export const vuexMutationFactory = (
	mutations: { name: string; options: MutationOption[] }[],
): MutationTree<any> => {
	const output: { [k: string]: any } = {}
	mutations.forEach(({ name, options }) => {
		output[name] = (state: any, payload?: any): void => {
			for (const { set, execute, key, value } of options) {
				const mutationPayload = assignValue({ value, key }, payload)
				if (typeof set === 'string') {
					state = {
						...state,
						[set]: execute ? execute(mutationPayload) : mutationPayload,
					}
				} else {
					set(state, mutationPayload)
				}
			}
		}
	})

	return output
}
