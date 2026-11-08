---
order: 9
---

```
#include <cstdlib>   // for EXIT_SUCCESS
#include <iostream>  // for cout, endl

int main(int argc, char* argv[]) {
  std::cout << "Hello, World!" << std::endl;
  return EXIT_SUCCESS;
}
```



- `cstdlib` is the C standard library’s `stdlib.h`
	- Nearly all C standard library functions are available
- `iostream` is part of the C++ standard library
	- declares stream object instances in the “std” namespace
- `std::cout` is the “cout” object instance declared by iostream, living within the “std” namespace
	- C++’s name for stdout
- C++ distinguishes between objects and primitive types
- “<<” is an operator defined by the C++ language
- `ostream` has many different methods to handle <<
- The `ostream` class’ member functions that handle << return a [[C++ References, Const, Classes#References|reference]] to themselves
- Next, another member function on `std::cout` is invoked to handle << with RHS `std::endl`


#### Namespace

`using` keyword brings a namespace (or part of one) into scope
- Can now refer to `std::<thing>` as `<thing>`


#### types

- primitive types include C's: `char`, `short`, `int`, `long`, `float`, `double`
 - C++ adds `bool`


#### operators overloading

- `<<` is bitshift for integers
- C++ allows classes and functions to overload operators
- `ostream` overloads `<<`: different member functions run when an `ostream` is on the left-hand side of `<<`
- which one runs depends on the type of the right-hand side
- `<<` function returns a reference to the stream itself


#### `std::endl`

- a pointer to a manipulator function
- writes `'\n'` to the stream, then flushes the buffer


#### `std::string`

- `string hello("Hello, World!");`
	- creates a `string` object on the stack
- overloads `<<`: a function, not a member method, invoked when LHS is `ostream` and RHS is `std::string
- overloads `+`: creates and returns a new string concatenating LHS and RHS
- overloads `=`: copies the RHS and replaces the string's contents


#### stream manipulators

- `setw(x)`: sets the width of the next field only
- `hex`, `dec`, `oct`: set the base for integers


#### reading inputs with `cin`

```
int num;
cout << "Type a number: ";
cin >> num;
cout << "You typed: " << num << endl;
```
