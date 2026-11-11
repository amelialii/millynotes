---
order: 7
---

## C Stream Buffering

#### buffering

- By default, C’s [[Linking, File I／O|file functions]] (`fwrite`, `fprintf`, etc.) use a buffer.
- A buffer is a chunk of memory used as a temporary holding spot for data.
- `fwrite()` copies your data into a buffer inside **your program’s memory**. It does NOT send it to the file yet.


#### When the buffer gets flushed

- You call `fflush()` on the stream.
- The buffer fills up
- For `stdout` printing to the terminal, a newline `\n` is printed (“line buffered”).
- You call `fclose()` on the stream.
- Your program exits normally (`return` from `main` or `exit()`).



## POSIX Lower-Level I/O

A standard set of functions that Unix-like systems (Linux, macOS) all support.
Portable Operating System Interface

- open(), read(), write(), close(), lseek()


Same idea as the `f` versions, but:
- **No buffering.** Every call goes straight to the OS, so every call is a [[#System Calls (High-Level View)|system call]].
- **Less convenient.** 


Some things only POSIX can do, like **listing what’s in a folder** and **network stuff**


#### read()

`ssize_t read(int fd, void* buf, size_t count);`
“From file `fd`, read up to `count` bytes and put them in `buf`.”

return a
- positive number: how many bytes it actually read.
- **`0`:** you’re at the end of the file. Nothing left.
- **`-1`:** an error. Check `errno` to see what kind.

It can return **fewer bytes than you asked for**. So have to **loop** until you’ve got everything.


```
char* buf = ...;      // buffer of size n
int bytes_left = n;
int result;

while (bytes_left > 0) {
  result = read(fd, buf + n - bytes_left, bytes_left);
  if (result == -1) {
    if (errno != EINTR) {
      // real error, so give up
    }
    continue;
  }
  bytes_left -= result;
}
```



## System Calls (High-Level View)

#### What’s an OS?

Software that:
- Directly interacts with the hardware
	- OS is trusted to do so; user-level programs are not
	- OS must be ported to new hardware; user-level programs are portable
- Manages (allocates, schedules, protects) hardware resources
	- Decides which programs can access which files, memory locations, pixels on the screen, etc., and when
- Abstracts away messy hardware devices
	- Provides high-level, convenient, portable abstractions (_e.g._, files, disk blocks)


#### Abstraction Provider

The OS is the “layer below”
- A module that your program can call (with system calls)
- Provides a powerful OS API – POSIX, Windows, etc.


![[file-20261017004034225.png|625]]


#### **Protection System**

OS isolates process from each other
- But permits controlled sharing between them
	- Through shared name spaces (_e.g._, file names)

OS isolates itself from processes
- Must prevent processes from accessing the hardware directly

OS is allowed to access the hardware
- User-level processes run with the CPU (processor) in unprivileged mode
- The OS runs with the CPU in privileged mode
- User-level processes invoke system calls to safely enter the OS 


#### System Calls Simplified Overview

If a user process wants to access an OS feature, they must invoke a system call
- A system call involves context switching into the OS/kernel, which has some overhead
- The OS will handle hardware/special functionality directly (in privileged mode) while user processes wait and don’t touch anything themselves
- OS will eventually finish, return result to user process, and context switch back 


#### strace

A useful Linux utility that shows the sequence of system calls that a process makes