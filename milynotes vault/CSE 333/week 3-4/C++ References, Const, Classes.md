---
order: 10
---

## C++ References

#### References

A reference is an alias for another variable
- Alias: another name that is bound to the aliased variable

```
int main ( int argc , char* argv []) {
	int x = 5, y = 10 ;
	int& z = x;
	z += 1;
	x += 1;
	z = y;
	z += 1;
	
	return EXIT_SUCCESS ;
}
```

x, z: 11, y: 10


#### Pass-By-Reference

C++ allows you to use real [[Memory, Data, Parameters#Reference vs. Value|pass-by-reference]]
- Client passes in an argument with normal syntax
	- Function uses reference parameters with normal syntax
	- Modifying a reference parameter modifies the caller’s argument


## const in C++

const : this cannot be changed/mutated
- Signal of intent to compiler; meaningless at hardware level

```
void BrokenPrintSquare ( const int & i ) {
	i = i *i ; // compiler error here!
	std :: cout << i << std :: endl ;
}
```

#### const and Pointers

[[Pointers|Pointers]] can change data in two different contexts:
1) You can change the value of the pointer (i.e., address stored)
2) You can change the thing the pointer points to (via dereference)

const can be used to prevent either/both of these behaviors

const next to pointer name means you can’t change the value of the pointer
- e.g., `int* const p;`
const next to data type pointed to means you can’t use this pointer to change the thing being pointed to
- e.g., `const int* p;`

#### const Parameters

A `const` parameter cannot be mutated inside the function
A non-const parameter may be mutated inside the function
- Compiler won’t let you pass in const parameters


#### When to Use References

A stylistic choice, not mandated by the C++ language

Google C++ Style Guide suggests:
- Input parameters:
	- Values for primitive types like `int` or small structs/objects 
	- `const` references for complex struct/object instances
- [[Pointers#Output Parameters|Output parameters]]:
	- Use `const` pointers (unchangeable pointers referencing changeable data)


## C++ Classes Intro

Class definition syntax (in a .h file):
- Members can be functions (methods) or data (variables)

```
class Name {
	public :
	// public member definitions & declarations go here
	
	private :
	// private member definitions & declarations go here
}; // class Name
```

Class member function definition syntax (in a .cc file):
- (1) define within the class definition or (2) declare within the class definition and then define elsewhere

```
retType Name:: MethodName ( type1 param1, …, typeN paramN ) {
	// body statements
}
```


#### const & Classes

objects can be declared as const
- Once a const object has been constructed, its member variables can’t be changed
- Can only invoke member functions that are labeled `const`

You can declare a member function of a class as const
- This means that if cannot modify the object it was called on


 Point.h

```
#ifndef POINT_H_
#define POINT_H_

class Point {
 public:
  Point(const int x, const int y);                // constructor
  int get_x() const { return x_; }                // inline member function
  int get_y() const { return y_; }                // inline member function
  double Distance(const Point& p) const;          // member function
  void SetLocation(const int x, const int y);     // member function

 private:
  int x_;  // data member
  int y_;  // data member
};  // class Point

#endif  // POINT_H_
```


Point.cc

```cpp
#include "Point.h"
#include <cmath>

Point::Point(const int x, const int y) {
  // BAD STYLE to mix-and-match "this->var_" and "var_"
  x_ = x;
  this->y_ = y;  // "this->" is optional unless name conflicts
}

double Point::Distance(const Point& p) const {
  // In a member function of the same class, can access p's x_
  // and y_ members directly or using the get_x()/get_y()
  // accessor functions (BAD STYLE to mix-and-match, though).
  double distance = (x_ - p.get_x()) * (x_ - p.get_x());
  distance += (y_ - p.y_) * (y_ - p.y_);
  return sqrt(distance);
}

void Point::SetLocation(const int x, const int y) {
  x_ = x;
  y_ = y;
}
```


usepoint.cc

```cpp
#include "Point.h"

#include <iostream>
#include <cstdlib>

using std::cout;
using std::endl;

int main(int argc, char* argv[]) {
  Point p1(1, 2);  // allocate a new Point on the Stack
  Point p2(4, 6);  // allocate a new Point on the Stack

  cout << "p1 is: (" << p1.get_x() << ", ";
  cout << p1.get_y() << ")" << endl;

  cout << "p2 is: (" << p2.get_x() << ", ";
  cout << p2.get_y() << ")" << endl;

  cout << "dist : " << p1.Distance(p2) << endl;
  return EXIT_SUCCESS;
}
```