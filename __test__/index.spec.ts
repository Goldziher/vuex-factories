import { actionFactory } from '../src'
import Vue from 'vue'
import Vuex, { ActionContext } from 'vuex'

Vue.use(Vuex)

describe('actionFactory tests', () => {
	const createStore = (actions: any) =>
		new Vuex.Store({
			modules: {
				test: {
					namespaced: true,
					actions,
				},
			},
		})
	describe('test execute', () => {
		const execute = jest.fn((...args) => [...args])
		const store = createStore(
			actionFactory([{ name: 'test', options: [{ execute }] }]),
		)
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
	})
})
