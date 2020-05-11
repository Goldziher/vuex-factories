# Vuex Factories

[![npm version](https://badge.fury.io/js/vuex-factories.svg)](https://badge.fury.io/js/vuex-factories) [![Build Status](https://travis-ci.org/Goldziher/vuex-factories.svg?branch=master)](https://travis-ci.org/Goldziher/vuex-factories) [![Coverage Status](https://coveralls.io/repos/github/Goldziher/vuex-factories/badge.svg?branch=master)](https://coveralls.io/github/Goldziher/vuex-factories?branch=master) [![Maintainability](https://api.codeclimate.com/v1/badges/bd2f46045503d6e836aa/maintainability)](https://codeclimate.com/github/Goldziher/vuex-factories/maintainability)

This package offers an action factory and a mutation factory meant to reduce some of the boilerplate of writing vuex modules.

## Installation

Install the package using your package manage of choice

`npm i vuex-factories` or `yarn add vuex-factories`

## Usage

Both factory functions expect an object with the keys being the name of the action/mutation and the value being an array of options.

### action factory

```typescript
actionFactory({
        actionName1: [{
            commit?: string
            dispatch?: string
            execute?: Function
            value?: Function | any
        }],
        ...
    }
)

```

Each action option **must include** either a commit, dispatch or execute prop.

Commit and dispatch are strings of the type used by vuex, i.e. for a mutation it would be usually `module/MUTATION_KEY`, and for an action it would be `module/actionName`, execute is a function that will will receive the action context and payload as its arguments. _note: root is automatically inferred_

Value in turn can take two different forms:

1. value can be a function. In this case, the commit or dispatch in the given option will be passed `value(payload)` as the payload.
2. value can be any other kind of value. _note: if specified value for a given option will take precedence over a payload, even if payload is passed to the action_

| Option   | Use                               | Example                                                        |
| -------- | --------------------------------- | -------------------------------------------------------------- |
| commit   | the name of a mutation to commit  | commit: "SET_USER"                                             |
| dispatch | the name of an action to dispatch | dispatch: "users/getUser"                                      |
| execute  | a function to be executed         | execute: (context, payload) => { ... }                         |
| value    | a function or default value       | value: (payload: number) => payload / 2 **OR** value: 100 etc. |

The use case for using the actionFactory is to reduce boilterpate actions that do not require complex typing of async operations, e.g. UI related actions. For example, given an actions.js file that looks like so:

```javascript

async function getUserById(ctx, id) {
    try {
        response = await api.get(...)
        ctx.commit("SET_CURRENT_USER", response.data)
    } catch(error) {
        ...
    }
}

async function updateUser(ctx, payload) {
    try {
        response = await api.patch(...)
        ctx.commit("SET_CURRENT_USER", response.data)
    } catch(error) {
        ...
    }
}

function openEditUserDrawer(ctx) {
    ctx.commit("SET_DRAWER_PAYLOAD", ctx.state.currentUser)
}

function closeEditUserDrawer(ctx, payload) {
    ctx.commit("SET_DRAWER_PAYLOAD", null)
    ctx.dispatch("updateUser", payload)
}

export default {
    getUserById,
    updateUser,
    openEditUserDrawer,
    closeEditUserDrawer,
}
```

Here the two UI actions - openCreateEditUserDrawer and closeCreateEditUserDrawer neither perform async operations nor require error handling, as such they are primary candidates to be converted to the actionFactory:

```javascript
import {actionFactory} from 'vuex-factories'

async function getUserById(ctx, id) {
    try {
        response = await api.get(...)
        ctx.commit("SET_CURRENT_USER", response.data)
    } catch(error) {
        ...
    }
}

async function updateUser(ctx, payload) {
    try {
        response = await api.patch(...)
        ctx.commit("SET_CURRENT_USER", response.data)
    } catch(error) {
        ...
    }
}

export default {
    getUserById,
    updateUser,
    ...actionFactory({
        openEditUserDrawer: [{
            commit: "SET_DRAWER_PAYLOAD",
            value: ({state}) => state.currentUser
        }],
        closeEditUserDrawer: [
            {
                commit: "SET_DRAWER_PAYLOAD",
                value: null
            },
            {
                dispatch: "updateUser"
            }
        ],
    })
}
```

### mutation factory

```typescript
mutationFactory({
        name: string
        options: [
            key: string
            value?: Function | any
        ]
    }
)

```

Each mutation option **must include** a key prop, which represents a state key, e.g. "users". It can also include a value prop. The value prop here acts exactly like it does for actionFactory, that is - it can be either a function, in which case it will be called with the payload as its parameter, or it can be a default value.

The use case for the mutation factory follows similar logic - reducing unnecessary boilerplate. For example:

```javascript
function SET_CURRENT_USER(state, payload) {
	state.c = payload
}

export default {
	SET_CURRENT_USER,
}
```

Can be refactored into:

```javascript
import { mutationFactory } from 'vuex-factories'

export default mutationFactory({
	SET_CURRENT_USER: [{ key: 'SET_CURRENT_USER' }],
})
```

## Typescript Support

Both factory functions support typescript.

In the case of the actionFactory this has somewhat reduced efficacy because vuex itself is not able to check typings using the dispatch and commit callers. To type the actionFactory you can pass two generics to it representing State and RootState, just like you would the regular vuex interfaces: `actionFactory<State,RootState>({...})`.

For the mutationFactory typescript offers validation of the state keys, which is quite useful. To do use this feature simply pass the typing of your state as a generic to the mutationFactory: `mutationFactory<State>({...})`
