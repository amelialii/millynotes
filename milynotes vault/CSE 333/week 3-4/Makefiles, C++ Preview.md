---
order: 8
---

## Make and Build Tools


`make` was the first coordinated software **build system** – a program for controlling what gets (re)compiled and how

`make` has tons of fancy features, but only two basic ideas:
1) Be a **centralized space** that holds the commands used to compile our project
2) Express **dependencies** for those commands so they only run when the source code they process changes (avoid unnecessary work)


#### The steps of building C

```
foo.c  ──(compile)──→  foo.o  ─┐
bar.c  ──(compile)──→  bar.o  ─┼──(link)──→  bar   (the runnable program)
                      libZ.a  ─┘
```

- **`.c` → `.o` (compiling):** each `.c` file gets turned into machine code separately. A `.o` file (“object file”) is **one piece** of the program, not runnable by itself yet.
- **`.o` files → executable ([[Linking, File I／O|linking]]):** all the pieces get glued together into one program you can run.
- **`.a` (library/archive):** a bundle of `.o` files someone packaged up. It gets glued in too.



## Makefile Basics


A makefile contains a bunch of triples:
```
target: sources
	command
```
- Colon after target is _required_
- Command lines must start with a **TAB**, NOT SPACES
- Multiple commands for same target are executed _in order
	- Can split commands over multiple lines by ending lines with ‘\’

i.e.
```
foo.o: foo.c foo.h bar.h
	gcc -Wall -o foo.o -c foo.c
```


#### Using make

`make -f <makefileName> target`
- Defaults:
	- If no -f specified, use the file Makefile in current directory
	- If no target specified, will use the first one in the file
	- Will interpret commands in your default shell unless you set SHELL variable in makefile 
- Target execution performed by checking each source in the source list:
	- If the source is a target in the makefile, then process it recursively
	- If some source does not exist, then error
	- If any source is newer than the target (or target does not exist), run command (presumably to update the target) 


#### “Phony” targets

A make target whose command does not create a file with the target’s name

**`clean`**: deletes everything that was built, so you can start fresh.
```
clean: rm -f talk *.o
```

Run with `make clean`. Since no file called `clean` ever gets created, the command runs every time you ask.


#### make variables

You can define variables in a makefile
-   All values are strings of text, no “types”
-   Variable names are case-sensitive and can’t contain ‘:’, ‘#’, ‘=’, or whitespace

```
CC = gcc
CFLAGS = -Wall -std=c17

foo.o: foo.c foo.h
	$(CC) $(CFLAGS) -c foo.c
```


#### Writing a Makefile Example

From the `#include` lines:
- `main.c` includes `speak.h`, `shout.h`
- `speak.c` includes `speak.h`
- `shout.c` includes `speak.h`, `shout.h`

**Step 1: draw the dependencies** (the slide says always do this first):

```
main.o  ← main.c  speak.h  shout.h
speak.o ← speak.c speak.h
shout.o ← shout.c speak.h  shout.h
talk    ← main.o  speak.o  shout.o
```

**Step 2: turn each line into a rule:**

```make
talk: main.o speak.o shout.o
	gcc -Wall -o talk main.o speak.o shout.o

main.o: main.c speak.h shout.h
	gcc -Wall -c main.c

speak.o: speak.c speak.h
	gcc -Wall -c speak.c

shout.o: shout.c speak.h shout.h
	gcc -Wall -c shout.c

clean:
	rm -f talk *.o
```


#### **Funny Characters**

- `$@` = the target name
- `$^` = all the sources
- `$<` = the first source



## C++ Preview

- **C++ = C plus extra features.** Everything you know from C still works.
- **Classes and objects:** like Java’s. Private/public, methods, inheritance.
- **[[C++ intro#Namespace|Namespaces]]:** so two things can share a name without clashing, like `LL::Iterator` vs `HT::Iterator`.
- **[[C++ Templates|Templates]]:** like Java generics. `vector<int>` instead of messy `void*` tricks.
- **A standard library:** ready-made `string`, `vector`, `map`, sort, and more. Less writing everything yourself.
- **Still no garbage collector**, so can still [[Structs, Heap#Memory Leaks|leak memory]] and segfault. [[C++ Smart Pointers|Smart pointers]] help.