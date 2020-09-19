/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ActionContext, ActionHandler, Mutation } from 'vuex'
import { ActionOption, Dictionary } from './types'
import { reduceToDict } from './util'
import Vue from 'vue'

export function actionFactory<S = any, R = any>(
	actions: Dictionary<ActionOption[]>,
): Dictionary<ActionHandler<S, R>> {
	return reduceToDict(
		Object.entries(actions).map(([name, options]) => [
			name,
			(context: ActionContext<S, R>, payload?: any): void => {
				if (!options.length)
					throw new Error(
						`[vuex-factories] options array is empty for action ${name}`,
					)
				options.forEach(({ value, execute, dispatch, commit }) => {
					if (typeof execute === 'function') {
						execute(context, payload)
					} else {
						const actionPayload =
							typeof value === 'function'
								? value(context, payload)
								: typeof value !== 'undefined'
								? value
								: payload
						if (typeof dispatch === 'string' && dispatch.trim()) {
							context.dispatch(dispatch, actionPayload, {
								root: Boolean(/\//.exec(dispatch)),
							})
						} else if (typeof commit === 'string' && commit.trim()) {
							context.commit(commit, actionPayload, {
								root: Boolean(/\//.exec(commit)),
							})
						} else {
							throw new Error(
								`[vuex-factories] neither execute, commit nor dispatch are defined for action ${name}, one of these must be defined`,
							)
						}
					}
				})
			},
		]),
	)
}

export function mutationFactory<S = any>(mutations: {
	[k: string]: { key: S extends object ? keyof S : string; value?: any }[]
}): Dictionary<Mutation<S>> {
	return reduceToDict(
		Object.entries(mutations).map(([name, options]) => [
			name,
			(state: S extends object ? S : object, payload?: any): void => {
				if (!options.length)
					throw new Error(
						`[vuex-factories] options array is empty for mutation ${name}`,
					)
				options.forEach(({ value, key }) => {
					if (typeof key !== 'string') {
						throw new Error(
							`[vuex-factories] expected key to be string received ${typeof key}`,
						)
					}

					Vue.set(
						state,
						key,
						typeof value === 'function'
							? value(state, payload)
							: typeof value !== 'undefined'
							? value
							: payload,
					)
				})
			},
		]),
	)
}
