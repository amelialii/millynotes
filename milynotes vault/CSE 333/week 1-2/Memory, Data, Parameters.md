---
order: 2
---

## C Compilation Workflow

![[file-20261003013253101.png|448]]

#### Compiling Multi-file Programs

The **[[Linking, File I／O|linker]]** combines multiple object files plus statically-linked libraries to produce an executable


## Memory Management

#### Processes and Virtual Memory

The OS gives each process the illusion of its own private memory
- Called the process’ address space
- Contains the process’ virtual memory, visible only to it (via translation)
- $2^{64}$ bytes on a 64-bit machine

#### Loading

When the OS loads a program it:
1. Creates an address space
2. Inspects the executable file to see what’s in it
3. (Lazily) copies regions of the file into the right place in the address space
4. Does any final linking, relocation, or other needed preparation



![[file-20261002134939845.png|614]]



#### Review: The Stack

Used to store data associated with function calls
- Compiler-inserted code manages stack frames for you


Stack frame (x86-64) includes:
- Address to return to
- Saved registers
	- Based on calling conventions
- Local variables
- Argument build
	- Only if > 6 used


#### Address Space Layout Randomization

Linux uses address space layout randomization (ASLR) for added security
- Randomizes:
	- Base of stack
	- Shared library (mmap) location
- Makes Stack-based buffer overflow attacks tougher
- Makes debugging tougher
- Can be disabled (gdb does this by default)



## C Data Considerations

#### C Primitive Types and Memory

![[file-20261003165108574.png|540]]


#### C99 Extended Integer Types

integer types with a guaranteed exact size

![[file-20261003165533023.png|523]]


```
u  int  32  _t
│   │    │    └─ "_t" = it's a type (just naming style, ignore)
│   │    └────── number of bits
│   └─────────── integer
└─────────────── "u" = unsigned (optional)
```

#### Arrays

`type name[size]`; allocates size\*size of (type)
- By default, array values are “mystery” data (i.e., uninitialized)


size of an array
- not stored anywhere – array does not know its own size
	- `sizeof(array)` only works in the variable scope of array definition


Initialization: `type name[size] = {val0,…,valN};`
- {} initialization can only be used at time of definition
- If no size supplied, infers from length of array initializer

Generic 2D format: `type name[rows][cols] = {{values},…,{values}};`
- Still allocates a single, contiguous chunk of memory


#### Structs

The size and layout of a [[Structs, Heap|struct]] instance is completely determined by (1) the field ordering and (2) alignment requirements



## Parameters

#### Reference vs. Value

There are two fundamental parameter-passing schemes in programming languages

- Call-by-value
	- Parameter is a local variable initialized with a copy of the calling argument when the function is called; manipulating the parameter only changes the copy, not the calling argument
	- C, Java, C++ (most things)
- Call-by-reference
	- Parameter is an alias for the supplied argument; manipulating the parameter manipulates the calling argument
	- C++ [[C++ References, Const, Classes#References|references]]


#### Arrays as Parameters

Arrays do not know their own size
- Solution 1: Declare Array Size
	int SumAll(int a[5])
- Solution 2: Pass Size as Parameter
	int SumAll(int a[], int size)


a `T[]` array parameter is “promoted” to a [[Pointers|pointer]] of type `T*`, and the pointer is passed by value
- So it acts like a call-by-reference array – caller’s array can be changed if callee modifies the array parameter elements
- But it’s really a call-by-value pointer – the callee’s pointer parameter can be changed without affecting the caller’s array


Array parameters are actually passed as pointers to the first array element


#### Returning an Array

Create the “returned” array in the caller
- Pass it as an [[Pointers#Output Parameters|output parameter]] to CopyArray()
	- A pointer parameter that allows the called function to store values that the caller can use


```
void CopyArray(int src[], int dst[], int size) {	
	for (int i = 0; i < size; ++i) {
		dst[i] = src[i];
	}
}
```


