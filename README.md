# Explicit Ownership Syntax

## Status

**Stage:**

**Author:** [JOTSR](https://github.com/JOTSR)

**Champions:**

## Overview / Motivation

JS implicit copy or reference variable depend on thair type in function call. This new syntax essentially uniformize argument call behaviour. Moreover, it add an explicit syntax to change scope variable (eg.: for globals variables used by function of if blocks)
It:
- Prevent hidden behaviour
- Simplify syntax for varaible copy (structuredClone)
- Better variable lifetime trace (possible optimisation for implementers)

## Syntax

This syntax introduce 2 new keywords
- move (move permanently a variable from a parent scope to a new child scope)
- copy (copy a variable from a parent scope to a new child scope)

Referenced variable can't be moved to prevent access to released memory space

If function use a key word in the declaration it is mandatory at call

### Notation

Basic usage
```ts
{
    //scope A
    const a = /* any */
    const b = /* any */
    
    foo(move a, copy b) {
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
function foo(move arg0, copy arg1, arg2) {
    //
}

const a, b, c = [1, 2, 3]
```

Keyword are mandatory if declared in function arguments

Respecting keywords
```ts
foo(move a, copy b, c) //ok
```

Copy to move "cast"
```ts
foo(copy a, copy b, c) //ok, copy encapsulate move for call
```

Move to copy "cast"
```ts
foo(move a, move b, c) //ok, move equivalent to copy for call
``` 

To keywordless declaration "cast"
```ts
foo(move a, copy b, copy c) //ok
foo(move a, copy b, move c) //ok
``` 

No keyword to move "cast"
```ts
foo(a, copy b, c) //throws, foo require ownership for arg0
``` 

No keyword to copy "cast"
```ts
foo(move a, b, c) //throws, foo require a copy for arg1 (ensure non mutation of b)
``` 

### Rules

```copy a``` is equivalent to ```structuredClone(a)```
```move a``` de-reference a to all the parents scopes

## Examples

### Copy data

```ts
const source = /* any */
const sourceCopy = copy source
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

const b = (copy a).reverse()

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