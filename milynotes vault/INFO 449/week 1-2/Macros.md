---
order: 1
---

_macros_: the ability to write a source-level construct


#### Two kinds of macros

_syntactic_ macros (C, C++ [[Modules, C Preprocessor#C Preprocessor Intro|preprocessor]])
	simple text drop-in replacement
	little to no compiler support
	potentially itself a source of bugs
_semantic_ macros (Lisp, Scheme, etc)
	fully checked and understood by the compiler
	verified correct
	this is Swift's implementation


#### Swift macro types

_freestanding_ macros
	`#`-prefixed
	appear anywhere in code
	almost like source-level function calls
_attached_ macros
`@`-prefixed
	modify a declaration they're "attached" to
	resemble other languages' "custom attributes" or "annotations"


Freestanding macros: "#function" and "#warning"
```
func myFunction() {
    print("Currently running \(#function)")
    #warning("Something's wrong")
}
```
`#function` returns the name of the currently-scoped function
`#warning` issues a warning during compilation


An attached macro: "OptionSet"
```
@OptionSet<Int>
struct SundaeToppings {
    private enum Options: Int {
        case nuts
        case cherry
        case fudge
    }
}
```
This macro sets "nuts", "cherry", and "fudge" to be "bit flags" values (1, 2, 4, ...)