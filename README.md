# Explicit Ownership Syntax

## Status

**Stage:**

**Author:** [JOTSR](https://github.com/JOTSR)

**Champions:**

## Overview / Motivation

JS implicit clone or reference variable depend on thair type in function call. This new syntax essentially uniformize argument call behaviour. Moreover, it add an explicit syntax to change scope variable (eg.: for globals variables used by function of if blocks)
It:
- Prevent hidden behaviour
- Simplify syntax for variable clone (structuredClone)
- Better variable lifetime trace (possible optimisation for implementers)

## Syntax

This syntax introduce 2 new keywords
- move (move permanently a variable from a parent scope to a new child scope)
- clone (clone a variable from a parent scope to a new child scope)

Referenced variable can't be moved to prevent access to released memory space

If function use a key word in the declaration it is mandatory at call

### Notation

Basic usage
```ts
{
    //scope A
    const a = /* any */
    const b = /* any */
    
    foo(move a, clone b) {
        //scope B
        a //can be accessed
        b //can be accessed
    }
    
    a //reference error, a is not referenced
    b //can be accessed

    if (move b !== undefined) {
        foo(move b)
        b //reference error, b is not referenced
    }

    b //reference error, b is not referenced

}
```
Function declaration
```ts
function foo(move arg0, clone arg1, arg2) {
    //
}

const a, b, c = [1, 2, 3]
```

Keyword are mandatory if declared in function arguments

Respecting keywords
```ts
foo(move a, clone b, c) //ok
```

Clone to move "cast"
```ts
foo(clone a, clone b, c) //ok, clone encapsulate move for call
```

Move to clone "cast"
```ts
foo(move a, move b, c) //ok, move equivalent to clone for call
``` 

To keywordless declaration "cast"
```ts
foo(move a, clone b, clone c) //ok
foo(move a, clone b, move c) //ok
``` 

No keyword to move "cast"
```ts
foo(a, clone b, c) //throws, foo require ownership for arg0
``` 

No keyword to clone "cast"
```ts
foo(move a, b, c) //throws, foo require a clone for arg1 (ensure non mutation of b)
``` 

### Rules

```clone a``` is equivalent to ```structuredClone(a)```
```move a``` de-reference a to all the parents scopes

## Examples

### Clone data

```ts
const source = /* any */
const sourceClone = clone source
```

### If block

```ts
let value

if (move value = foo()) {
    //do stuff
}

value //out of scope
```

### Legacy muting methods

```ts
const a = [1, 2, 3]

const b = (clone a).reverse()

//a is unchanged
```

### Ressource access prevent

```ts
const ressource = /* */

function release(move ressource) {
    ressource.release()
}

release(move ressource)

//ressource not accessible anymore
```

## FAQs