export interface Dictionary<T = any> {
	[k: string]: T
}

interface BaseOption {
	value?: any
}

export interface ActionOption extends BaseOption {
	execute?: Function
	dispatch?: string
	commit?: string
}

export interface MutationOption extends BaseOption {
	key: string
}
