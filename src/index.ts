import { Dictionary, MutationOption, ActionOption } from './types'
import { Mutation, ActionContext, ActionHandler } from 'vuex'
import { handleValue, reduceToDict } from './util'

export function actionFactory<S = any, R = any>(
	actions: { name: string; options: ActionOption[] }[],
): Dictionary<ActionHandler<S, R>> {
	return reduceToDict(
		actions.map(({ name, options }) => [
			name,
			(context: ActionContext<any, any>, payload?: any): void => {
				options.forEach((option) => {
					if (typeof option.execute === 'function') {
						option.execute(context, payload)
					} else {
						const actionPayload = option.empty
							? undefined
							: handleValue({
									payload,
									name,
									...option,
							  })
						const action = option.dispatch ? context.dispatch : context.commit
						const actionTarget = option.dispatch ?? option.commit

						if (!actionTarget) throw new Error()

						action(actionTarget, actionPayload, {
							root: Boolean(actionTarget && /\//.exec(actionTarget)),
						})
					}
				})
			},
		]),
	)
}

export function mutationFactory<S = any>(
	mutations: { name: string; options: MutationOption[] }[],
): Dictionary<Mutation<S>> {
	return reduceToDict(
		mutations.map(({ name, options }) => [
			name,
			(state: any, payload?: any): void => {
				options.forEach((option) => {
					const mutationPayload = option.empty
						? undefined
						: handleValue({ ...option, name, payload })
					state = {
						...state,
						[option.set]: option.execute
							? option.execute(state, mutationPayload)
							: mutationPayload,
					}
				})
			},
		]),
	)
}
