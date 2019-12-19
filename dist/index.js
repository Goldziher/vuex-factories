var __assign =
	(this && this.__assign) ||
	function() {
		__assign =
			Object.assign ||
			function(t) {
				for (var s, i = 1, n = arguments.length; i < n; i++) {
					s = arguments[i]
					for (var p in s)
						if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
				}
				return t
			}
		return __assign.apply(this, arguments)
	}
var assignValue = function(_a) {
	var value = _a.value,
		key = _a.key,
		payload = _a.payload,
		empty = _a.empty,
		name = _a.name
	if (empty) {
		return undefined
	} else if (typeof value !== 'undefined') {
		return value
	} else if (key && payload[key] !== 'undefined') {
		return payload[key]
	} else if (payload !== 'undefined') {
		return payload
	} else {
		throw new Error(
			'empty is false while both value and payload are undefined for option ' +
				name +
				', please specify empty: true to pass an undefined value',
		)
	}
}
export var actionFactory = function(actions) {
	var output = {}
	actions.forEach(function(_a) {
		var name = _a.name,
			options = _a.options
		output[name] = function(context, payload) {
			for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
				var _a = options_1[_i],
					dispatch = _a.dispatch,
					commit = _a.commit,
					execute = _a.execute,
					key = _a.key,
					value = _a.value,
					_b = _a.empty,
					empty = _b === void 0 ? false : _b
				if (execute) {
					if (typeof execute !== 'function') {
						throw new Error(execute + ' is not a function')
					}
					execute(context, payload)
				} else {
					var action = dispatch ? context.dispatch : context.commit
					var actionTarget = dispatch || commit
					var actionPayload = assignValue({
						value: value,
						key: key,
						payload: payload,
						empty: empty,
						name: name,
					})
					if (!action || !actionTarget) {
						throw new Error(
							'action ' + name + ' called with missing parameters',
						)
					} else {
						action(actionTarget, actionPayload, {
							root: Boolean(actionTarget && /\//.exec(actionTarget)),
						})
					}
				}
			}
		}
	})
	return output
}
export var mutationFactory = function(mutations) {
	var output = {}
	mutations.forEach(function(_a) {
		var name = _a.name,
			options = _a.options
		output[name] = function(state, payload) {
			var _a
			for (var _i = 0, options_2 = options; _i < options_2.length; _i++) {
				var _b = options_2[_i],
					set = _b.set,
					execute = _b.execute,
					key = _b.key,
					value = _b.value,
					_c = _b.empty,
					empty = _c === void 0 ? false : _c
				var mutationPayload = assignValue({
					value: value,
					key: key,
					payload: payload,
					empty: empty,
					name: name,
				})
				state = __assign(
					__assign({}, state),
					((_a = {}),
					(_a[set] = execute
						? execute(state, mutationPayload)
						: mutationPayload),
					_a),
				)
			}
		}
	})
	return output
}
