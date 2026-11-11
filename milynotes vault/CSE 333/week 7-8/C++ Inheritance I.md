---
order: 17
---

## Inheritance Motivation & C++ Syntax

a parent-child "is-a" relationship between classes
- java: a subclass extends a superclass
- c++ a derived class extends a base class


#### Inheritance benefits

code reuse
- children can automatically inherit code from parents

polymorphism
- ability to redefine existing behavior but preserve the interface
- children can override the behavior of the parent
- others can make calls on objects without knowing which part of the inheritance tree it is on

extensibility
- children can add behavior


#### Access modifiers

- public: visible to all other classes
- protected: visible to current class and its derived classes
- private: visible only to the current classes


#### Class derivation list

comma separated list of classes to inherit from:
```
#include "BaseClass.h"

class Name : public BaseClass {
	...
};
```

any member that is non-private in the base class is the same in the derived class; both interface and implementation inheritance
- except that constructors, destructors, copy constructor, and assignment operator are never inherited


a derived class:
- inherits the behavior and state (specification) of the base class
- overrides some of the base class' member functions
- extends the base class with new member functions, variables



## Polymorphism & Dynamic Dispatch

#### Polymorphism in C++

`PromisedType * var_p = new ActualType ();`
- `var_p` is a pointer to an object of `ActualType` on the Heap
- `ActualType` must be the same or a derived class of `PromisedType`
- `PromisedType` defines the interface, but `ActualType` may determine which version gets invoked


#### Dynamic Dispatch

Usually, when a derived function is available for an object, we want the derived function to be invoked
- requires a runtime decision of what code to invoke


#### Requesting Dynamic Dispatch

Prefix the member function declaration with the `virtual` keyword
- Derived/child functions don’t need to repeat `virtual`
- You almost always want functions to be virtual
`override` keyword
- Tells compiler this method should be overriding an inherited virtual function – always use if available



## Virtual Tables & Virtual Table Pointers

#### vtables and the vptr

If a class contains any virtual methods, the compiler emits:
- A (single) virtual function table (vtable) for the class
	- Contains a function pointer for each virtual method in the class
- A virtual table pointer (vptr) for each object instance
	- A pointer to a virtual table as a “hidden” member variable
