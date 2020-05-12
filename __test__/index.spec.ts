import { actionFactory, mutationFactory } from '../src'
import Vue from 'vue'
import Vuex, { ActionContext } from 'vuex'

Vue.use(Vuex)

describe('actionFactory tests', () => {
	const execute = jest.fn((...args) => [...args])
	const mockAction = jest.fn((ctx: ActionContext<any, any>, payload: any) => {
		return payload
	})
	const MOCK_MUTATION = jest.fn((state: any, payload: string) => {
		state.stringVal = payload
	})
	const createStore = (actions: any) =>
		new Vuex.Store({
			modules: {
				test: {
					namespaced: true,
					actions,
				},
				standard: {
					namespaced: true,
					state: {
						stringVal: '',
					},
					actions: {
						mockAction,
					},
					mutations: {
						MOCK_MUTATION,
					},
				},
			},
		})

	let store = createStore(actionFactory({ test: [{ execute }] }))

	it('executes function when provided', () => {
		store.dispatch('test/test')
		expect(execute).toBeCalled
	})
	it('passes context and payload to execute when provided', () => {
		store.dispatch('test/test', '123')
		expect(execute).toHaveBeenCalledWith<[ActionContext<any, any>, string]>(
			expect.any(Object),
			'123',
		)
	})

	it('dispatches action', () => {
		store = createStore(
			actionFactory({ test: [{ dispatch: 'standard/mockAction' }] }),
		)
		store.dispatch('test/test')
		expect(mockAction).toBeCalled()
	})
	it('dispatches action with function value', () => {
		const value = jest.fn((_, arr: number[]) => arr.reverse())
		const payload = [1, 2, 3]
		store = createStore(
			actionFactory({
				test: [{ dispatch: 'standard/mockAction', value }],
			}),
		)
		store.dispatch('test/test', payload)
		expect(value).toBeCalledWith(expect.any(Object), payload)
		expect(value).toReturnWith(payload.reverse())
		expect(mockAction).toBeCalledWith<[ActionContext<any, any>, number[]]>(
			expect.any(Object),
			payload.reverse(),
		)
	})
	it('dispatches action with preset value', () => {
		store = createStore(
			actionFactory({
				test: [{ dispatch: 'standard/mockAction', value: null }],
			}),
		)
		store.dispatch('test/test')
		expect(mockAction).toBeCalledWith<[ActionContext<any, any>, null]>(
			expect.any(Object),
			null,
		)
	})
	it('dispatches action with payload when no value is provided', () => {
		store = createStore(
			actionFactory({
				test: [{ dispatch: 'standard/mockAction' }],
			}),
		)
		store.dispatch('test/test', '123')
		expect(mockAction).toBeCalledWith<[ActionContext<any, any>, string]>(
			expect.any(Object),
			'123',
		)
	})
	it('commits mutation with function value', () => {
		const value = jest.fn((_, arr: number[]) => arr.reverse())
		const payload = [1, 2, 3]
		store = createStore(
			actionFactory({
				test: [{ commit: 'standard/MOCK_MUTATION', value }],
			}),
		)
		store.dispatch('test/test', payload)
		expect(value).toBeCalledWith(expect.any(Object), payload)
		expect(value).toReturnWith(payload.reverse())
		expect(MOCK_MUTATION).toBeCalledWith<[any, number[]]>(
			expect.any(Object),
			payload.reverse(),
		)
	})
	it('commits mutation with preset value', () => {
		store = createStore(
			actionFactory({
				test: [{ commit: 'standard/MOCK_MUTATION', value: null }],
			}),
		)
		store.dispatch('test/test')
		expect(MOCK_MUTATION).toBeCalledWith<[any, null]>(expect.any(Object), null)
	})
	it('commits mutation with payload when no value is provided', () => {
		store = createStore(
			actionFactory({
				test: [{ commit: 'standard/MOCK_MUTATION' }],
			}),
		)
		store.dispatch('test/test', '123')
		expect(MOCK_MUTATION).toBeCalledWith<[any, string]>(
			expect.any(Object),
			'123',
		)
	})
	it('throws error when neither execute, commit nor dispatch are provided', () => {
		store = createStore(
			actionFactory({
				test: [{ value: '' }],
			}),
		)
		expect(() => store.dispatch('test/test')).toThrow()
	})
	it('throws error when options have no length', () => {
		store = createStore(
			actionFactory({
				test: [],
			}),
		)
		expect(() => store.dispatch('test/test')).toThrow()
	})
})

describe('mutationFactory tests', () => {
	const execute = jest.fn((...args) => [...args])

	const createStore = (mutations: any) =>
		new Vuex.Store({
			modules: {
				test: {
					namespaced: true,
					state: {
						test: [],
					},
					mutations,
				},
			},
		})
	let store = createStore(
		mutationFactory({
			TEST: [],
		}),
	)
	it('throws error when options have no length', () => {
		expect(() => store.commit('test/TEST')).toThrow()
	})
	it('throws error when no key is provided', () => {
		let store = createStore(
			mutationFactory({
				// @ts-ignore
				TEST: [{ value: '' }],
			}),
		)
		expect(() => store.commit('test/TEST')).toThrow()
	})
	it('sets state key with value(payload) when value is a function', () => {
		const value = jest.fn((_, arr: number[]) => arr.reverse())
		const payload = [1, 2, 3]
		let store = createStore(
			mutationFactory({
				TEST: [{ value, key: 'test' }],
			}),
		)
		store.commit('test/TEST', payload)
		expect(value).toBeCalledWith(expect.any(Object), payload)
		// @ts-ignore
		expect(store.state.test.test).toEqual(payload.reverse())
	})
	it('it sets state with payload when it is provided', () => {
		const payload = [1, 2, 3]
		let store = createStore(
			mutationFactory({
				TEST: [{ key: 'test' }],
			}),
		)
		store.commit('test/TEST', payload)
		// @ts-ignore
		expect(store.state.test.test).toEqual(payload)
	})
	it('it sets state with value when it is provided', () => {
		const payload = [1, 2, 3]
		let store = createStore(
			mutationFactory({
				TEST: [{ key: 'test', value: payload }],
			}),
		)
		store.commit('test/TEST')
		// @ts-ignore
		expect(store.state.test.test).toEqual(payload)
	})
})
