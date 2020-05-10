# Vuex Factories

[![Build Status](https://travis-ci.org/Goldziher/vuex-factories.svg?branch=master)](https://travis-ci.org/Goldziher/vuex-factories) [![Coverage Status](https://coveralls.io/repos/github/Goldziher/vuex-factories/badge.svg?branch=master)](https://coveralls.io/github/Goldziher/vuex-factories?branch=master)

This tiny package offers two factory functions - a vuex action factory and a vuex mutation factory, which help remove some of the redundancies tied to writing vuex modules.

## Installation

```sh
npm install vuex-factories
```

or

```sh
yarn add vuex-factories
```

## Usage

Both factory functions expect an array of objects as their parameter. The structure of the objects is as follows:

### action factory

```typescript
actionFactory(
    [{
        name: string
        options: [
            commit?: string
            dispatch?: string
            empty?: boolean
            execute?: Function
            key?: string
            value?: any
        ]
    }]
)

```

Each action option **must include** either a commit, dispatch or execute parameter. Commit and dispatch are, respectively, the names of mutations or actions to be committed / dispatched. Execute on the other hand is a function that is passed to the action. This function will receive **_the action context and payload_** as its two parameters.

If value is defined, it takes precedence over whatever payload may be passed in to the action - so make sure not to define value for a given option if you want the payload or a part of it to be passed to the action option. If a key is specified, the given option will be passed **payload[key]**, otherwise the payload in its entirety will be passed. If you explicitly want to pass **undefined** as the value for a given operation, you should specify empty: true.

| Option   | Use                                        | Example                                                                 |
| -------- | ------------------------------------------ | ----------------------------------------------------------------------- |
| commit   | the name of a mutation to commit           | commit: "SET_USER"                                                      |
| dispatch | the name of an action to dispatch          | dispatch: "users/getUser", note: root is automatically inferred         |
| empty    | pass undefined instead of value or payload | empty: true                                                             |
| execute  | a function to be executed                  | execute: (context, payload) => { ... }                                  |
| key      | a key or index to access in the payload    | key: "userId", will result in the option being passed payload["userId"] |
| value    | a value predefined value                   | value: 1                                                                |

### mutation factory

```typescript
mutationFactory(
    [{
        name: string
        options: [
            empty?: boolean
            execute?: Function
            key?: string
            set: string
            value?: any
        ]
    }]
)

```

Each mutation option **must include** a set param, which represents a state key, e.g. "users".

If value is defined, it takes precedence over whatever payload may be passed in to the mutation - so make sure not to define value for a given option if you want the payload or a part of it to be passed to the mutation option. If you explicitly want to pass **undefined** as the value for a given operation, you should specify empty: true.

Normally a mutation option just sets a given state key to the value, payload or payload[key], but sometimes a more complex operation is required. In such cases you can pass a function in execute, which will receive **_the sub-state specified in set and the payload_** as parameters and is expected to return the value that is to be set for a given state key.

So, for example, you might have a state object with a "users" property. The value stored under the users property is an array of user objects. Upon deleting a user, you also need to remove it from the users array, which requires some sort of splicing or filtering opertion to take place. You can achieve this with the following code:

```typescript
mutationFactory(
    [{
        name: "DELETE_USER",
        options: [
            execute: (usersState, payload) => usersState.filter(user => user.id !== payload.id),
            set: "users"
        ]
    }]
)

```

Or, given that this is a generic operation that can occur in multiple places in your store, you might wish to move this to a generic helper function and then just add it here. For example:

```typescript
const filterById = (arr: any[], payload: any): any[] => arr.filter((e) => e.id !== payload.id)


mutationFactory(
    [{
        name: "DELETE_USER",
        options: [
            execute: filterById,
            set: "users"
        ]
    }]
)

```

| Option  | Use                                          | Example                                                                                                       |
| ------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| empty   | pass undefined instead of value or payload   | empty: true                                                                                                   |
| execute | a function to be executed when setting state | execute: (state, payload) => { ... }, must return a value to be set, otherwise undefined will be set in state |
| key     | a key or index to access in the payload      | key: "userId", will result in the option being passed payload["userId"]                                       |
| set     | the key for a sub-state to be set            | set: "users", will result in the mutation option setting the users property of the state object               |
| value   | a value predefined value                     | value: 1                                                                                                      |

## Examples

```javascript
// inside a vuex module declaration
import { actionFactory, mutationFactory } from "vuex-factories"
import actions from "./actions"
import mutations from "./mutations"
import getters from "./getters"

const state = {
    ....
}

export default {
    namespaced: true,
    state,
    actions: {
        ...actions,
        ...actionFactory([
            {
                name: "factoryGeneratedAction", options: [
                    { commit: "SET_USER", value: null },
                    { dispatch: "GET_USER", key: "userId" },
                ]
            },
            {
                name: "anotherFactoryGeneratedAction", options: [
                    { commit: "DELETE_USER" },
                    { dispatch: "settings/GET_SETTINGS" }
                ]
            },
        ])
        /* the above results in the following actions:

        factoryGeneratedAction(context, payload) {
            commit("SET_USER", null)
            dispatch(GET_USER, payload["userId"])
        },
        anotherFactoryGeneratedAction(context, payload) {
            commit("DELETE_USER")
            dispatch("settings/GET_SETTINGS", undefined, { root: true })
        }
        */
    },
    mutations: {
        ...mutations,
        ...mutationFactory([
            {
                name: "SET_USER", options: [
                    { set: "user" }
                ]
            },
            {
                name: "DELETE_USER", options: [
                    { set: "user", value: null }
                    { set: "posts", value: null }
                    { set: "users", execute: (usersState, payload) => userState.filter((user) => user.id !== payload.id)) }
                ]
            },
            /* the above results in the following mutations:
            SET_USER(state, payload) {
                state.user = payload
            }
            DELETE_USER(state, payload) {
                state.user = null
                state.posts = null
                state.users = state.users.filter((user) => user.id !== payload.id)
            }
            */
        ])
    }
    getters
}

```
