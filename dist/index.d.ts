import { ActionTree, MutationTree } from 'vuex'
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
export declare const vuexActionFactory: (
	actions: {
		name: string
		options: ActionOption[]
	}[],
) => ActionTree<any, any>
export declare const vuexMutationFactory: (
	mutations: {
		name: string
		options: MutationOption[]
	}[],
) => MutationTree<any>
