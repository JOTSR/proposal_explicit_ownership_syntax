const source = await Deno.readTextFile('./example-in.ts')

//Transpile clone syntax
const cloneSyntax = source
    //Transpile assignments and expressions
    .replaceAll(/(=|\+|-|!)\s?(clone)\s?(\S+)/g, (_, identifer, __, expression) => {
        return `${identifer} (${expression})[Symbol.cloner]()`
    })
    //Transpile function declarations
    .replaceAll(/function\s?(\w*)\s?\((.+)\)/g, (_, name: string, args: string) => {
        const transpiledArgs = args.replaceAll(/(clone)\s(\w+)/g, (_, __, arg: string) => {
            return arg
        })
        return `function ${name}(${transpiledArgs})`
    })
    //Transpile arrow function declarations
    .replaceAll(/\((.*)\)\s?=>/g, (_, args: string) => {
        const transpiledArgs = args.replaceAll(/(clone)\s(\w+)/g, (_, __, arg: string) => {
            return arg
        })
        return `(${transpiledArgs}) =>`
    })
    //Transpile function calls
    .replaceAll(/\((.*)\)/g, (_, args: string) => {
        const transpiledArgs = args.replaceAll(/(clone)\s(\w+)/g, (_, __, arg: string) => {
            return `(${arg})[Symbol.cloner]()`
        })
        return `(${transpiledArgs})`
    })

await Deno.writeTextFile('./example-out.ts', cloneSyntax)