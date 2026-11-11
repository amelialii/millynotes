---
order: 4
---

## structs and typedef

A struct is a C datatype that contains a set of fields
- Similar to a Java class, but with no methods or constructors
- Useful for defining new structured types of data
- Behave similarly to primitive variables


![[file-20261007134355940.png|496]]



Use “.” to refer to a field in a struct
Use “->” to refer to a field from a struct [[Pointers|pointer]]
- Dereferences pointer first, then accesses field


![[file-20261007135630329.png|548]]


#### Typedef

Generic format: `typedef type name;`
Allows you to define new data type names/synonyms 
- Both type and name are usable and refer to the same type 


#### Structs as Arguments

Structs are [[Memory, Data, Parameters#Reference vs. Value|passed by value]], like everything else in C
- Entire struct is copied
- To manipulate a struct argument, [[Pointers#Pointers as Parameters|pass a pointer]] instead



## Heap-allocated Memory

Situations where static and automatic allocation aren’t sufficient:
- We need memory that persists across multiple function calls but not for the whole lifetime of the program
- We need more memory than can fit on the [[Memory, Data, Parameters#Review: The Stack|Stack]]
- We need memory whose size is not known in advance


#### Dynamic Allocation

- Your program explicitly requests a new block of memory
	- The language allocates it at runtime, perhaps with help from OS 
- Dynamically-allocated memory persists until either:
	- Your code deallocates it (manual/explicit memory management)
	- A garbage collector collects it (automatic/implicit memory management)

C requires you to manually manage memory
- Gives you more control, but causes headaches


#### NULL

NULL is a memory location that is guaranteed to be invalid
Useful as an indicator of an uninitialized (or currently unused) pointer or allocation error


#### malloc ()

General usage: var = `(type*) malloc(size in bytes)`
allocates an uninitialized block of heap memory of at least the requested size
- Returns a pointer to the first byte of that memory; returns NULL if the memory allocation failed
- Stylistically, want to (1) use `sizeof` in your argument, (2) cast the return value, and (3) error check the return value


#### free()

Usage: `free(pointer);`
Deallocates the memory pointed-to by the pointer
- Pointer must point to the first byte of heap-allocated memory (i.e., something previously returned by malloc or calloc)
- Freed memory becomes eligible for future allocation
- Freeing NULL has no effect
- The bits stored in the pointer are not changed by calling free
	- Defensive programming: can set pointer to NULL after freeing it


#### Memory Leaks

A memory leak occurs when code fails to deallocate dynamically-allocated memory that is no longer used
- e.g., forget to free malloc-ed block, lose/change pointer to malloc-ed block