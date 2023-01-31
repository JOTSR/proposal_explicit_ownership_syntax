export {}

class MoveError extends ReferenceError {}

declare global {
	interface SymbolConstructor {
		readonly mover: unique symbol
	}

	interface Object {
		[Symbol.mover]: () => void
	}
}

Object.assign(Symbol, { mover: Symbol('mover') })

Object.prototype[Symbol.mover] = function () {
	this = new Error('')
}

const nb = new Proxy(new Number(1), {
    get(target, name) {
        console.log(target, name)
        if (!Reflect.has(target, name)) {
            return undefined
        }
		if (Reflect.get(target, name) instanceof MoveError) {
			throw Reflect.get(target, name)
		}
		return Reflect.get(target, name)
    },
    set(target, name, value) {
        console.log(target, name)
		if (name === 'delete') {
			Reflect.set(target, value, new MoveError(`Out of scope access, ${value} as been moved at [?scope.name]`))
			return true
		}
		Reflect.set(target, name, value)
		return true
    }
}) as unknown as Record<string, unknown>

Object.prototype.constructor