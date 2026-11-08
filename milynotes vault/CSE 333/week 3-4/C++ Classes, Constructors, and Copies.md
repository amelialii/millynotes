---
order: 11
---

in C, a `struct` can only contain data fields
- No methods and all fields are always accessible
In C++, `struct` and class are (nearly) the same
- Both can have methods and member visibility (public/private/protected) 
- Minor difference: members are default public in a `struct` and default private in a class

Common style convention
- Use struct for simple bundles of data 
- Use class for abstractions with data + functions


## Constructors

A constructor (ctor) initializes a newly-instantiated object
- Written with the class name as the method name
- e.g., `Point(const int x, const int y);`
- A class can have multiple constructors that differ in parameters
- A constructor must be invoked when creating a new instance of an object

C++ will automatically create a synthesized default constructor if you have no user-defined constructors
- Synthesized default ctor will fail if you have non-initialized [[C++ References, Const, Classes#const in C++|const]] or [[C++ References, Const, Classes#References|reference]] data members


#### Synthesized Default Constructor Example

```cpp
// SimplePoint.h
class SimplePoint {
 public:
  // no constructors declared!
  int get_x() const { return x_; }     // inline member function
  int get_y() const { return y_; }     // inline member function
  double Distance(const SimplePoint& p) const;
  void SetLocation(int x, int y);

 private:
  int x_;  // data member
  int y_;  // data member
};  // class SimplePoint
```

```cpp
// SimplePoint.cc
#include "SimplePoint.h"

... // definitions for Distance() and SetLocation()

int main(int argc, char* argv[]) {
  SimplePoint x;  // invokes synthesized default constructor
  return EXIT_SUCCESS;
}
```

If you define any constructors, C++ will not add a synthesized default constructor


#### Multiple Constructors (overloading)

```cpp
void Foo () {
	SimplePoint x; // invokes the default constructor SimplePoint
	y(1, 2); // invokes the 2- int - arguments ctor
	SimplePoint a[ 3]; // invokes the default ctor 3 times
}
```


## Copy Constructors

C++ has the notion of a copy constructor (cctor)
- Used to initialize a new object “as a copy” of an existing object
- Initializer lists can also be used in copy constructors (preferred)

```cpp
Point::Point(const int x, const int y) : x_(x), y_(y) { }

// copy constructor
Point::Point(const Point& orig) x_(orig.x_), y_(orig.y_) { }

void Foo() {
  Point a(1, 2);  // invokes the 2-int-arguments constructor

  Point b(a);     // invokes the copy constructor
                  // could also be written as "Point b = a;"
}
```

#### Synthesized Copy Constructor

If you don’t define your own copy constructor, C++ will synthesize one for you
- It will do a shallow copy of all of the fields (i.e., member variables) of your class

```cpp
#include "SimplePoint.h"

... // definitions for Distance() and SetLocation()

int main(int argc, char* argv[]) {
  SimplePoint x;
  SimplePoint y(x);  // invokes synthesized copy constructor
  ...
  return EXIT_SUCCESS;
}
```


The copy constructor is invoked if
- You initialize an object from another object of the same type
	```cpp
	Point x; // default ctor
	Point y(x); // copy ctor
	Point z = y; // copy ctor
	```
- You pass a non-reference object as a value parameter to a function
	```cpp
	void Foo(Point x) { ... }
	Point y; // default ctor
	Foo(y); // copy ctor
	```
- You return a non-reference object value from a function
	```cpp
	Point Foo() {
	  Point y; // default ctor
	  return y; // copy ctor
	}
	```

## Assignment

“ =” is the assignment operator
- Assigns values to an existing, already constructed object

#### Overloading the “=” Operator

```cpp
Point& Point::operator=(const Point& rhs) {
  if (this != &rhs) {  // (1) always check against this
    x_ = rhs.x_;
    y_ = rhs.y_;
  }
  return *this;        // (2) always return *this from op=
}

Point a;       // default constructor
a = b = c;     // works because = return *this
a = (b = c);   // equiv. to above (= is right-associative)
(a = b) = c;   // "works" because = returns a non-const
```

#### Synthesized Assignment Operator

If you don’t define the assignment operator, C++ will synthesize one for you
- It will do a shallow copy of all of the fields

```
#include "SimplePoint.h "
... // definitions for Distance() and SetLocation ()

int main (int argc , char* argv []) {
	SimplePoint x;
	SimplePoint y(x);
	y = x; // invokes synthesized assignment operator
	
	return EXIT_SUCCESS ;
}
```


## Destructors

C++ has the notion of a destructor (dtor)
- Invoked automatically when a class instance is deleted, goes out of scope, etc.
- Place for your cleanup code – free any resources owned by the object
- After destructor body finishes, destruct members in reverse order of declaration

```
Point:: ~Point() {    // destructor
	// Do any cleanup needed when a Point object goes away.
	// Nothing to do here, but what if we had dynamic resources
}
```


#### Destructor Example

```cpp
// FileDescriptor.h
class FileDescriptor {
 public:
  FileDescriptor(char* file) {           // Constructor
    fd_ = open(file, O_RDONLY);
    // Error checking omitted
  }
  ~FileDescriptor() { close(fd_); }      // Destructor
  int get_fd() const { return fd_; }     // inline member function
 private:
  int fd_;  // data member
};  // class FileDescriptor
```

```cpp
// use_fd.cc
#include "FileDescriptor.h"

int main(int argc, char* argv[]) {
  FileDescriptor fd1("foo.txt");
  return EXIT_SUCCESS;
}
```