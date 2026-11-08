---
order: 0
---

**File layout**

- Top comment has copyright, name, and CSE or UW email
- Copyright, name, etc. go above the first line of code
- Code follows the layout of a C program (no misplaced #define or #include)
- Include order: related header (the module this file implements or tests), then system headers, then other project headers
- No unused or unnecessary #include
- All functions are declared at the top of the file, before any function definitions
- Static helpers you write: declaration at the top, definition at the bottom of the file (or next to a related function)
- Files with `main`: function definitions go below `main`

**Header files**

- Every .h you write has a correct header guard
- Never modify provided headers or interfaces
- Prototypes include names for parameters

**Comments**

- Function description comments are generally with the function prototype declaration; a static helper’s comment goes with its declaration at the top
- Function comments cover behavior, inputs, return values, and error handling
- `main`’s comment goes directly above it
- Every helper function has a comment
- Meaningful comments overall
- Sufficient comments on important/complicated parts of code
- Each case in a multi-branch function gets a one-line comment (e.g. empty list, single element, general case)
- No excessive comments
- No commented-out code in the final submission
- Comments are up to date and accurate; don’t assume all provided comments can be left as-is
- `STEP X` markers are kept
- Internal data types, constants, or functions you add to a provided .c are documented, with why you added them

**Functions and modularity**

- Function names match the spec exactly, including capitalization
- Code is factored into logical modules or functions that perform significant operations (no poor factorization)
- No redundancies that can be removed
- No repetitive definition of a function or struct
- No unused code or unnecessary code in the final submission
- Helper functions you add are private (`static`)
- Provided interfaces are never changed

**Legibility and code style**

- Follow the Google Style Guide naming conventions (types, variables, functions)
- Follow the Google Style Guide indentation conventions
- Descriptive variable names
- Consistent pointer declarations
- IF statements with ELSE have braces
- Naming, capitalization, commenting style, indentation, data types, and error checking match the provided code

**Constants, types, format specifiers**

- No magic numbers; use predefined constants or `#define`
- Return or `exit()` with `EXIT_SUCCESS` on success and `EXIT_FAILURE` on failure
- `main` has a return at the end
- Use `sizeof` for portability
- Use the data types the provided code uses (e.g. `size_t`, `ssize_t`, `off_t`)
- Use the correct format specifiers (e.g. `PRIx8` from `<inttypes.h>`) to avoid implicit casts
- Pointers print with `%p`

**Errors, memory, robustness**

- Every return value is checked, including the project’s own functions (e.g. `LinkedList_Pop`, `LLSlice`) and your own helpers; if failure “can’t happen,” wrap the call in `Verify333(...)` instead of discarding the result
- Print an error message before exiting on failure
- Error messages go to `stderr`
- Error messages are correct for the error that happened
- Every allocation is checked (use `Verify333` where the starter does)
- No [[Structs, Heap#Memory Leaks|memory leaks]] or memory errors under valgrind `--leak-check=full`
- System resources are cleaned up on every execution path
- Library call errors are handled: retry on `EAGAIN` / `EINTR`, return an error status for non-recoverable errors
- Code deals with hard-to-handle/edge cases and bogus user input gracefully
- Your decision for handling each kind of unexpected input is documented in the code
- Client data is freed with the free function the API is given; your own internal structs use `free`

**Build and lint**

- Provided code you’re told not to change stays exactly as given
- `cpplint.py --clint` has no complaints
- Compiles without errors or warnings on CSE Linux
- Compiles with the original, provided [[Makefiles, C++ Preview#Makefile Basics|Makefile]]

**Git**

- Regular commits of project parts spread over the duration of the project
- No single giant commit at the end, and no bunch of small ones all made at the same time
- Commit messages are brief but descriptive enough that someone else gets a general sense of the changes (“Part A Done” is not enough)
- Files are in the exact required directory, including capitalization
- Submission tag is created and pushed; bonus work gets its own tag
