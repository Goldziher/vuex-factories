import { ActionTree, MutationTree } from 'vuex'
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
export declare const actionFactory: (
	actions: {
		name: string
		options: ActionOption[]
	}[],
) => ActionTree<any, any>
export declare const mutationFactory: (
	mutations: {
		name: string
		options: MutationOption[]
	}[],
) => MutationTree<any>
