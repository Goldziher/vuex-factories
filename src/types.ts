interface BaseOption {
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
