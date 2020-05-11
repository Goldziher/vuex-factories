export interface Dictionary<T = any> {
	[k: string]: T
}

export interface ActionOption {
	value?: any
	execute?: Function
	dispatch?: string
	commit?: string
}
