import { ActionOption } from './types'
import { ActionContext, ActionTree } from 'vuex'
import { assignValue } from './util'

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
							root: Boolean(actionTarget && actionTarget.includes('/')),
						})
					}
				}
			}
		}
	})
	return output
}
