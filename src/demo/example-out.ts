import './polyfill/clone.ts'
import { Cloneable } from './polyfill/clone.ts';

class CustomCloneable {
    #id: number
    name: string
    age: number
    constructor(name: string, age: number) {
        this.name = name
        this.age = age
        this.#id = Date.now()
    }

    sayHello() {
        return `Hello from ${this.name}`
    }

    set id(value: number) {
        this.#id = value
    }

    [Symbol.cloner]() {
        const clone = new CustomCloneable(this.name, this.age)
        clone.id = this.#id
        return clone
    }

    toString() {
        return `CustomCloneable { name: "${this.name}", age: ${this.age}, #id: ${this.#id} }`
    }
}

function noDangerous(object: Record<string, unknown>) {
    object.prop = null
    return object
}

const noDangerousArrow = <T>(object: Record<string, unknown>, value: Cloneable) => {
    object.prop = value
    return object
}

const object = { prop: 'important' }
console.log(noDangerous(((object)?.[Symbol.cloner]() ?? object)), noDangerousArrow(((object)?.[Symbol.cloner]() ?? object), ((1)?.[Symbol.cloner]() ?? 1)), object)

const a = {b: 1}

const b = ((a)?.[Symbol.cloner]() ?? a)

const c = 1
const d = ((c)?.[Symbol.cloner]() ?? c)

const e = [1, 2, '3', a, b, c, d, null, undefined]
const f = ((e)?.[Symbol.cloner]() ?? e)

console.log(a, b)
console.log(c, d)
console.log(e, f)

const c1 = new CustomCloneable('John', 34)
const c2 = ((c1)?.[Symbol.cloner]() ?? c1)
console.log(`${c1}, ${c2}`)

const circular = { ref: {} }
circular.ref = circular
const circular2 = ((circular)?.[Symbol.cloner]() ?? circular)
console.log(circular, circular2)
