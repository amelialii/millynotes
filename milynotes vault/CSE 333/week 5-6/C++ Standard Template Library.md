---
order: 14
---

#### C++’s Standard Library

C++’s Standard Library consists of four major pieces:
- The entire C standard library
- C++’s input/output stream library
	- `std::cin` , `std::cout`, `stringstreams`, `fstreams`, etc.
- C++’s standard template library
- C++’s miscellaneous library


#### STL Containers

A container is an object that stores (in memory) a collection of other objects (elements)
- Implemented as class templates, so hugely flexible

Several different classes of container
- Sequence containers
	- index by number
	- vector, deque, list, array, etc.
- Associative containers
	- index by key
	- set, map, multiset, multimap, bitset, etc.

STL containers store by value, not by [[C++ References, Const, Classes#References|reference]]
- When you insert an object, the container makes a copy
- If the container needs to rearrange objects, it makes copies

#### Tracer Class

Wrapper class for an unsigned int value
Useful for tracing behaviors of containers


#### STL vector

A generic, dynamically resizable array
- Elements are store in contiguous memory location
- Adding/removing from the end is cheap
- Inserting/deleting from the middle or start is expensive


#### STL iterator

Each container class has an associated iterator class used to iterate through elements of the container

Iterator range is from begin up to end , i.e., $[$begin , end)
- end is one past the last container element

Some container iterators support more operations than others


#### Type Inference (C++11)

The auto keyword can be used to infer types


#### auto and Iterators

![[file-20261030140451861.png]]


#### STL Algorithms

A set of functions to be used on ranges of elements
- General form: `algorithm(begin, end, ...)`
Algorithms operate directly on range elements rather than the containers they live in
- Make use of elements’ [[C++ Classes, Constructors, and Copies#Copy Constructors|copy ctor]], = , == , != , <