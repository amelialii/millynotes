---
order: 6
---

[[Modules, C Preprocessor#C Preprocessor Intro|preprocessor, cpp]], handles everything that starts with `#`
- define $\rightarrow$ replace a name with its text
- include $\rightarrow$ paste in the entire contents of another file (`#include <stdio.h`>)
- `#ifdef` / `#ifndef` $\rightarrow$ keep or delete a chunk of lines



## Visibility of Symbols

If we define a global variable named “counter” in one C file, is it visible in a different C file in the same program?
- Yes, if you use external linkage
	- The name “counter” refers to the same variable in bo
	- The variable is defined in one file and declared in the other(s)
- No, if you use internal linkage
	- The name “counter” refers to a different variable in each file
	- The variable must be defined in each file


#### External Linkage

- extern makes a declaration of something externally-visible

![[file-20261012135301717.png|630]]


#### Internal Linkage

- static (in the global context) restricts a definition to visibility within that file

![[file-20261012135517496.png|639]]


#### Static Confusion

C has a different use for “static”: create a persistent local variable
- The storage for that variable is allocated when the [[Memory, Data, Parameters#Loading|program loads]], in either the .data or .bss segment
- Retains its value across multiple function invocations



## File I/O

C’s `stdio` defines the notion of a stream
- A sequence of characters that flows to and from a device
	- Can be either text or binary; Linux does not distinguish
- Is [[Buffering, POSIX I／O, System Calls#C Stream Buffering|buffered]] by default; `libc` reads ahead of your program
- Three streams provided by default: `stdin`, `stdout`, `stderr`
- C streams are manipulated with a `FILE*` pointer, which is defined in `stdio.h`


- `FILE* fopen(filename, mode);`
- `int fclose(stream);`
- `int fprintf(stream, format, ...);`
- `int fscanf(stream, format, ...);`
- `size_t fwrite(ptr, size, count, stream);`
	- Writes an array of _count_ elements of _size_ bytes from _ptr_ to _stream_
- `size_t fread(ptr, size, count, stream);`
	- Reads an array of _count_ elements of _size_ bytes from _stream_ to _ptr_ 


#### C Stream Error Checking/Handling

`int ferror(stream);`
- Checks if the error indicator associated with the specified stream is set
`void clearerr(stream);`
- Resets error and EOF indicators for the specified stream
`void perror(message);`
- Prints message followed by an error message related to errno to `stderr`



