export {}

const ClonablePrimitives = ['string', 'number', 'bigint', 'undefined']

class CloneError extends TypeError {}

declare global {
	interface SymbolConstructor {
		cloner: symbol
	}
}

Symbol.cloner = Symbol('cloner')

Object.prototype[Symbol.cloner] = function () {
	//Copy primitives and null except Symbol
	if (ClonablePrimitives.includes(typeof this) || this === null) {
		return this
	}

	//Throw if not a literal object
	if (Object.getPrototypeOf(this).constructor.name !== 'Object') {
		throw new CloneError(`${this} does not implement [Symbol.cloner]`)
	}

	const clone = {}

	for (const [property, descriptor] of Object.entries(
		Object.getOwnPropertyDescriptors(this)
	)) {
		try {
			//Recursive clone, not suited for circular references
			clone[property] = descriptor.value[Symbol.cloner]()
		} catch (e) {
			//@ts-ignore cause in Error
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
