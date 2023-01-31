class MoveError extends ReferenceError {}

const Movable = new Proxy({}, {
    get(target, name) {
        if (!Reflect.has(target, name)) {
            return undefined
        }
		if (Reflect.get(target, name) instanceof MoveError) {
			throw Reflect.get(target, name)
		}
		return Reflect.get(target, name)
    },
    set(target, name, value) {
		if (name === '_delete_') {
			Reflect.set(target, value, new MoveError(`Out of scope access, ${value} as been moved at [?scope.name]`))
			return true
		}
		Reflect.set(target, name, value)
		return true
    }
}) as unknown as Record<string, unknown>

Movable.age = 30
Movable.name = 'John'
console.log({age: Movable.age, name: Movable.name})
Movable._delete_ = 'age'
console.log({name: Movable.name})
Movable.age



;`
let query = undefined
if (move query = await fetch('https://example.com')) {
	const { status } = query
	if (status.ok) process(move query)
	query //should throws
}
query //should throws

function process(move query: Response) {
	const { body } = query
	// process
	//query is release from memory
}
`

;`
Mover.query = undefined
if (Mover.query = await fetch('https://example.com')) {
	const { status } = Mover.query
	if (status.ok) process(Mover)
	Mover.query //should throws
}
Mover.query //should throws

function process(Mover) {
	const { body } = Mover.query
	Mover._delete_ = 'query'
	// process
	//query is release from memory
}
`

;`
const source = 'HEAVY FILE'
const parsed = parse(move source)

function parse(move source: string): Record<string, unknown> {
	// parse file
	return Object.fromEntries(Object.entries(source.split('')))
	// "source" is released without intervention of garbage collector and prevent heap saturation
}
`

;`
const source = 'HEAVY FILE'
const parsed = parse(move source)

function parse(move source: string): Record<string, unknown> {
	// parse file
	return Object.fromEntries(Object.entries(source.split('')))
	// "source" is released without intervention of garbage collector and prevent heap saturation
}
`