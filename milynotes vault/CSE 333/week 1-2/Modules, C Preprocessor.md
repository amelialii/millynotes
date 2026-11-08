---
order: 5
---

## Generic Data Structures in C

#### simple linked list in C

each mode in a linear, singly-linked list contains:
- Some element as its payload
- A [[Pointers|pointer]] to the next node in the linked list
	- The last node’s pointer is [[Structs, Heap#NULL|NULL]] (or some other special value)

![[file-20261009134055922.png|536]]



```
typedef struct node_st {
	void* element;
	node_st* next;
} Node;
```


**`Push`** adds a new box to the _front_ of the list:
1. `malloc` a new box on the [[Structs, Heap#Heap-allocated Memory|heap]].
2. Put the data in it.
3. Point its `next` at the old front of the list.
4. Return the new box, which is now the new front.



## Modules & Interfaces

A module is a self-contained piece of an overall program
- Has externally visible functions that customers can invoke
- Has externally visible [[Structs, Heap#Typedef|typedefs]], and perhaps global variables, that customers can use
- May have internal functions, typedefs, or global variables that customers should not look at

The module’s interface is its set of public functions, typedefs, and global variables


every name.c is intended to be a module that has a name.h


#### C Module Conventions

File contents:
- .h files only contain declarations, never definitions
- .c files never contain prototype declarations for functions that are intended to be exported through the module interface
- Public-facing functions are ModuleName_FunctionName() and take a pointer to “this” as their first argument

Including:
- NEVER \#include a .c file; only \#include .h file
- \#include all of headers you reference, even if another header (transitively) includes some of them

Compiling:
- Any .c file with an associated .h file should be able to be compiled (together via \#include) into a [[Makefiles, C++ Preview#The steps of building C|.o file]]

Commenting:
- If a function is declared in a header file (.h) and defined in a C file (.c), the header needs full documentation because it is the public specification



## C Preprocessor Intro

The C preprocessor (cpp) is a sequential and stateful search-and-replace text-processor that transforms your source code before the compiler runs
- Run automatically on your behalf by gcc during compilation
- The input is a C file (text) and the output is still a C file (text)
- It processes the directives it finds in your code (#directive)


