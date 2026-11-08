---
order: 1
---

## Generic C Program Layout

```
#include
#include "local_files"

#define macro_name macro_expr

/* declare functions */
/* declare external variables & structs */

int main(int argc, char* argv[]) {
	/* the innards */
}

/* define other functions */
```


### C Syntax: main

To get command-line arguments in main, use:
`int main(int argc, char* argv[])`


- argc contains the number of strings on the command line (the executable name counts as one, plus one for each argument)
- argv is an array containing [[Pointers|pointers]] to the arguments as strings, “null-terminated” with a [[Structs, Heap#NULL|NULL]] pointer (in modern C standards)




