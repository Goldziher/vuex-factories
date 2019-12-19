import { ActionContext, ActionTree, MutationTree } from 'vuex'

export interface BaseOption {
	execute?: Function
	key?: string
	value?: any
	empty?: boolean
}

export interface ActionOption extends BaseOption {
	dispatch?: string
	commit?: string
}

export interface MutationOption extends BaseOption {
	set: string
}

const assignValue = ({
	value,
	key,
	payload,
	empty,
	name,
}: {
	value?: any
	key?: string | number
	payload?: any
	empty: boolean
	name: string
}): any | void => {
	if (empty) {
		return undefined
	} else if (typeof value !== 'undefined') {
		return value
	} else if (key && payload[key] !== 'undefined') {
		return payload[key]
	} else if (payload !== 'undefined') {
		return payload
	} else {
		throw new Error(
			`empty is false while both value and payload are undefined for option ${name}, please specify empty: true to pass an undefined value`,
		)
	}
}

export const actionFactory = (
	actions: { name: string; options: ActionOption[] }[],
): ActionTree<any, any> => {
	const output: { [k: string]: any } = {}
	actions.forEach(({ name, options }) => {
		output[name] = (context: ActionContext<any, any>, payload?: any): void => {
			for (const {
				dispatch,
				commit,
				execute,
				key,
				value,
				empty = false,
			} of options) {
				if (execute) {
					if (typeof execute !== 'function') {
						throw new Error(`${execute} is not a function`)
					}
					execute(context, payload)
				} else {
					const action = dispatch ? context.dispatch : context.commit
					const actionTarget = dispatch || commit
					const actionPayload = assignValue({
						value,
						key,
						payload,
						empty,
						name,
					})
					if (!action || !actionTarget) {
						throw new Error(`action ${name} called with missing parameters`)
					} else {
						action(actionTarget, actionPayload, {
							root: Boolean(actionTarget && /\//.exec(actionTarget)),
						})
					}
				}
			}
		}
	})
	return output
}

export const mutationFactory = (
	mutations: { name: string; options: MutationOption[] }[],
): MutationTree<any> => {
	const output: { [k: string]: any } = {}
	mutations.forEach(({ name, options }) => {
		output[name] = (state: any, payload?: any): void => {
			for (const { set, execute, key, value, empty = false } of options) {
				const mutationPayload = assignValue({
					value,
					key,
					payload,
					empty,
					name,
				})
				state = {
					...state,
					[set]: execute ? execute(state, mutationPayload) : mutationPayload,
				}
			}
		}
	})

	return output
}
