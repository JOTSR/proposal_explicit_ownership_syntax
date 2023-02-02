export {}

type ClonablePrimitivesTypes = string | number | bigint | undefined
const ClonablePrimitives = ['string', 'number', 'bigint', 'undefined']

class CloneError extends TypeError {}

declare global {
	interface SymbolConstructor {
		readonly cloner: unique symbol
	}

	interface Object {
		[Symbol.cloner]: () => ThisType<Object>
	}
}

Object.assign(Symbol, { cloner: Symbol('cloner') })

Object.prototype[Symbol.cloner] = function () {
	//Copy primitives except Symbol
	if (ClonablePrimitives.includes(typeof this)) {
		return this
	}

	//Throw if not a literal object
	if (Object.getPrototypeOf(this).constructor.name !== 'Object') {
		throw new CloneError(`${this} does not implement [Symbol.cloner]`)
	}

	const clone: Record<string, unknown> = {}

	for (const [property, descriptor] of Object.entries(
		Object.getOwnPropertyDescriptors(this)
	)) {
		try {
			//Recursive clone, not suited for circular references
			clone[property] = descriptor.value[Symbol.cloner]()
		} catch (e) {
			throw new CloneError(`property [${property}] is not cloneable`, {
				cause: e,
			})
		}
	}

	return clone as unknown as typeof this
}

Array.prototype[Symbol.cloner] = function () {
	return this.map((value) =>
		value === null || value === undefined ? value : value[Symbol.cloner]()
	)
}

Date.prototype[Symbol.cloner] = function () {
	return new Date(this)
}

Map.prototype[Symbol.cloner] = function () {
	const clone = new Map()
	for (const [key, value] of this.entries()) {
		clone.set(key[Symbol.cloner](), value[Symbol.cloner]())
	}
	return clone
}

Set.prototype[Symbol.cloner] = function () {
	const clone = new Set()
	for (const [value] of this.entries()) {
		clone.add(value[Symbol.cloner]())
	}
	return clone
}

export type Cloneable<T = unknown> =
	| {
			[Symbol.cloner]: () => T
	  }
	| Record<string, ClonablePrimitivesTypes | null>
	| (ClonablePrimitivesTypes | null)[]
