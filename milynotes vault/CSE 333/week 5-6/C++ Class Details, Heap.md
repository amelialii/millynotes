---
order: 12
---

## Class Details

#### Rule of Three

If you define any of the
	(1) [[C++ Classes, Constructors, and Copies#Destructors|destructor]]
	(2) [[C++ Classes, Constructors, and Copies#Copy Constructors|copy constructor]], or
	(3) assignment (operator= ),
then you should normally define all three

C++11 gives two shortcuts:
- `= default` explicitly asks for the generated version.
- `= delete` forbids it. The style guide likes deleting copy and assignment so you can’t accidentally trigger expensive or buggy copies.

#### Access Control

Access modifiers for members
- public : accessible to all parts of the program
- private : accessible to the member functions of the class
	- Private to class, not object instances
- protected : accessible to member functions of the class and any derived classes (subclasses)

`class` members default to `private`, and `struct` members default to `public`

#### Nonmember Functions

“Nonmember functions” are just normal functions that happen to use some class
- Called like a regular function instead of as a member of a class object instance

#### `friend` Nonmember Functions

A class can give a nonmember function (or class) access to its non-public members by declaring it as a friend within its definition
- Not a class member, but has access privileges as if it were

```cpp
class Complex {
  ...
  friend std::istream& operator>>(std::istream& in, Complex& a);
  ...
};  // class Complex
```

```cpp
std::istream& operator>>(std::istream& in, Complex& a) {
  ...
}
```

#### When to use Nonmember and friend

Member functions:
- Operators that modify the object being called on (e.g., operator= )
- “Core” non-operator functionality that is part of the class interface

Nonmember functions (only grant `friend` if you absolutely need to):
- Commutative operators
- Operations with class on the right-hand side
- Returning a “new” object and not modifying an existing one

#### Namespace

Each namespace is a separate scope
Namespace definition has unusual syntax and style:
```
namespace nsp_name {
	// declarations go here
} // namespace nsp_name
```

- Use a lowercase name.
- Don’t indent the contents.
- End with `} // namespace name` and no semicolon.


## Using the Heap

#### nullptr

- C and C++ have long used [[Structs, Heap#NULL|NULL]] as a pointer value that references nothing
- C++11 introduced a new literal for this: `nullptr`

`NULL` is secretly the integer 0, which causes overload confusion. `nullptr` is a real pointer literal

#### new/delete Behavior

look like Java’s `new`, but there’s no garbage collector, every `new` needs a matching `delete`

new behavior:
- When allocating you can specify a constructor or initial value
- If no initialization specified, it will use default constructor for objects and uninitialized (“mystery”) data for primitives

delete behavior:
- If you `delete` already `delete`d memory, then you will get undefined behavior (same as when you double `free` in C)

```
int main() {
  Point* x = AllocatePoint(1, 2);
  int* y = AllocateInt(3);

  cout << "x's x_ coord: " << x->get_x() << endl;
  cout << "y: " << y << ", *y: " << *y << endl;

  delete x;
  delete y;
  return EXIT_SUCCESS;
}
```

#### Dynamically Allocated Arrays

To dynamically allocate an array:
- Default initialize: `type* name = new type[size];`

To dynamically deallocate an array:
- Use `delete[] name;`

#### malloc vs. new

![[file-20261026141441678.png|595]]