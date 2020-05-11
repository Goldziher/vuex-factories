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
        actionName1: [
            commit?: string
            dispatch?: string
            execute?: Function
            value?: Function | any
        ],
        actionName2: [
            commit?: string
            dispatch?: string
            execute?: Function
            value?: Function | any
        ],
        ...
    }
)

```

Each action option **must include** either a commit, dispatch or execute prop. Commit and dispatch are strings of the type used by vuex, i.e. for a mutation it would be usually `module/MUTATION_KEY`, and for an action it would be `module/actionName`, execute is a function that will will receive the action context and payload as its arguments.

Value in turn can take two different forms:

1. value can be a function. In this case, the commit or dispatch in the given option will be passed `value(payload)` as the payload.
2. value can be any other kind of value. In this case it is regarded as a default value, and it will be passed to the commit or dispatch as long as payload is undefined. If payload is provided, it will take precedence over the default value.

| Option   | Use                               | Example                                                         |
| -------- | --------------------------------- | --------------------------------------------------------------- |
| commit   | the name of a mutation to commit  | commit: "SET_USER"                                              |
| dispatch | the name of an action to dispatch | dispatch: "users/getUser", note: root is automatically inferred |
| execute  | a function to be executed         | execute: (context, payload) => { ... }                          |
| value    | a function or default value       | value: (payload: number) => payload / 2 or value: 100           |

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

Please note - if a mutation is called with a payload and the value prop is not a function, the payload will take precedence over the default value.
