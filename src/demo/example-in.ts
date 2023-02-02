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

function noDangerous(clone object: Record<string, unknown>) {
    object.prop = null
    return object
}

const noDangerousArrow = <T>(clone object: Record<string, unknown>, clone value: Cloneable) => {
    object.prop = value
    return object
}

const object = { prop: 'important' }
console.log(noDangerous(clone object), noDangerousArrow(clone object, clone 1), object)

const a = {b: 1}

const b = clone a

const c = 1
const d = clone c

const e = [1, 2, '3', a, b, c, d, null, undefined]
const f = clone e

console.log(a, b)
console.log(c, d)
console.log(e, f)

const c1 = new CustomCloneable('John', 34)
const c2 = clone c1
console.log(`${c1}, ${c2}`)

const circular = { ref: {} }
circular.ref = circular
const circular2 = clone circular
console.log(circular, circular2)
