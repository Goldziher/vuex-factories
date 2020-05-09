export interface Dictionary<T = any> {
	[k: string]: T
}

interface BaseOption {
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
