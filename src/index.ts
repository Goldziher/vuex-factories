import { ActionContext, ActionTree, MutationTree } from 'vuex'

export interface BaseOption {
	execute?: Function
	key?: string
	value?: any
}

export interface ActionOption extends BaseOption {
	dispatch?: string
	commit?: string
}

export interface MutationOption extends BaseOption {
	set: string | Function
}

const assignValue = (
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

export const vuexActionFactory = (
	actions: { name: string; options: ActionOption[] }[],
): ActionTree<any, any> => {
	const output: { [k: string]: any } = {}
	actions.forEach(({ name, options }) => {
		output[name] = (context: ActionContext<any, any>, payload?: any): void => {
			for (const { dispatch, commit, execute, key, value } of options) {
				if (execute) {
					if (typeof execute !== 'function') {
						throw new Error(`${execute} is not a function`)
					}
					execute(context, payload)
				} else {
					const action = dispatch ? context.dispatch : context.commit
					const actionTarget = dispatch || commit
					const actionPayload = assignValue({ value, key }, payload)
					if (
						!action ||
						!actionTarget ||
						typeof actionPayload === 'undefined'
					) {
						throw new Error(`action ${name} called with missing parameters`)
					} else {
						action(actionTarget, actionPayload, {
							root: Boolean(actionTarget && actionTarget.match(/\//)),
						})
					}
				}
			}
		}
	})
	return output
}

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
