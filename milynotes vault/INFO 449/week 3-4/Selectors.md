---
order: 6
---

### Selectors

necessary for Objective-C compatibility/use
	but also useful in their own right, to add nominative binding capabilities
references to methods by name
	with some amount of compiler checking
selectors can be used to invoke methods
	permitting a degree of flexibility in setup/invocation
used extensively in Cocoa and iOS to match-by-capabilities


#### restrictions

class must inherit from NSObject
	necessary for the Obj-C plumbing "underneath"
members must be annotated with @objc
	optional name describes the Obj-C name
usable on methods and property methods


#### Syntax

`#selector` obtains method at compile-time
parameter is method with names separated by colons
use `getter:` or `setter:` to obtain property getter/setter methods


```
class SomeClass: NSObject {
  @objc let property: String

  @objc(doSomethingWithInt:)
  func doSomething(_ x: Int) { }

  init(property: String) { self.property = property }
}
let selectorForMethod = #selector(SomeClass.doSomething(_:))
let selectorForPropertyGetter = #selector(getter: SomeClass.property)
```