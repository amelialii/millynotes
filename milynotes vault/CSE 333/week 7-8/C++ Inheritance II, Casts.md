---
order: 18
---

## C++ Inheritance

#### Abstract Classes

A class containing any pure virtual methods is **abstract**
- Can't create instances of an abstract class
- Extended abstract classes and override methods to use them

A class containing only pure methods is the same as a Java interface


#### Static Dispatch

```cpp
double Stock::GetMarketValue() const;
double Stock::GetProfit() const;
```

```cpp
DividendStock dividend;
DividendStock* ds = &dividend;
Stock* s = &dividend;

ds->GetMarketValue(); // DividendStock::GetMarketValue()
s->GetMarketValue(); // Stock::GetMarketValue() (declared type is Stock*)

s->GetProfit(); // Stock::GetProfit() → calls Stock::GetMarketValue()
ds->GetProfit(); // Stock::GetProfit() (inherited) → still calls Stock::GetMarketValue()
```


why not always use virtual
- efficiency
	- non-virtual function calls are a tiny bit faster
	- a class with no virtual functions has objects without a `vptr` field
- control
	- if `F()` calls `G()` in class X and G is not virtualm we're guaraanteed to call `X::G()` and not `G()` in some derived class


mixed dispatch
- which function is called is a mix of (1) compile-time and runtime decisions, and (2) how you call the function

![[file-20261113174248012.png|647]]


#### Constructors and Destructors

A derived object contains "subobjects" corresponding to the data members inherited from each base class

A derived class does not inherit the base class' constructor
- The derived class must have its own constructor
- A synthesized default constructor for the derived class first invokes the default constructor of the base class and then initializes the derived class' member variables
- The base class constructor is invoked before the constructor of the derived class

Destructor of a derived class:
- First runs body of the dtor
- Then invokes of the dtor of the base class


#### Assignment

C++ allows you to assign the value of a derived class to an instance of a base class
- Known as object slicing



## C++ Casting

#### Explicit casting in C

`lhs = (new_type) rhs;`

Used to:
- Convert between pointers of arbitrary type
- Forcibly convert a primitive type to another

C++ provides an alternative casting style:
- static_cast<to_type> (expression)
- dynamic_cast<to_type> (expression)
- const_cast<to_type> (expression)
- reinterpret_cast<to_type> (expression)
