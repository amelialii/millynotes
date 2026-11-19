---
order: 20
---

## Sockets API

#### Networks and Sockets

```
// FILE
int fd = open("notes.txt", O_RDONLY);

// NETWORK
int fd = socket(AF_INET, SOCK_STREAM, 0);
connect(fd, addr, addrlen);
```


#### File Descriptor Table

![[file-20261118142916212.png|561]]


#### Types of Sockets

Stream sockets
- for connection-oriented, point-to-point, reliable byte streams
	- using [[C++ Casts, Networks Introduction#TCP vs UDP|TCP]], SCTP, or other stream transports

datagram sockets
- for connection-less, one-to-many, unreliable packets

raw sockets
- for layer-3 communication (raw IP packet manipulation)


#### Stream sockets

typically used for client-server communications

![[file-20261118162345102.png]]


#### Datagram sockets

Often used as a building block 
- No flow control, ordering, or reliability, so used less frequently

![[file-20261118162433383.png|504]]


#### Client TCP Connection

five steps:
1) Figure out the IP address and port to which to connect
2) Create a socket
3) Connect the socket to the remote server 
4) `read()` and `write()` data using the socket 
5) Close the socket


Step 1: Figure Out IP Address and Port
- network addresses
- data structures for address info
- DNS - finding IP address



## Network Addresses

#### IPv4 Network Addresses

An IPv4 address is a **4-byte** tuple
- For humans, written in “dotted-decimal notation”
	- e.g., 128.95.4.1 (80:5f:04:01 in hex)
- special address 127.0.0.1 is the IPv4 loopback address


#### IPv6 Network Addresses

An IPv6 address is a **16-byte** tuple
- Typically written in “hextets” (groups of 4 hex digits)
- Special address ::1 is the IPv6 loopback address (“local host”)
- Transition is still ongoing
	- IPv4-mapped IPv6 addresses


#### Linux Socket Addresses

- Structs, constants, and functions via `#include <arpa/inet.h>`
- Addresses stored in network byte order ([[Pointers#Endianness|big endian]])
- Converting between host and network byte orders for portability
    ```cpp
    uint16_t p = htons(80);    // host → network, short (16-bit, for ports)
    uint32_t a = htonl(ip);    // host → network, long (32-bit, for IPv4 addrs)
    uint16_t back = ntohs(p);  // network → host, to read it back
    ```


#### IPv4 Address Structures

![[file-20261118165634316.png|529]]


#### IPv6 Address Structures

![[file-20261118165729081.png|530]]


#### Address Conversion

`int inet_pton(int af, const char* src, void* dst);`
- Converts human-readable string representation (“presentation”) to network byte ordered address
- Returns 1 (success), 0 (bad `src`), or - 1 (error)

`const char* inet_ntop(int af, const void* src, char* dst, socklen_t size);`
- Converts network addr in `src` into buffer `dst` of size `size`
- Returns `dst` on success; NULL on


## DNS Lookup


#### Domain Name System

People tend to use DNS names, not IP addresses
- The Sockets API lets you convert between the two
- Complicated
	- A given DNS name can have many IP addresses
	- Many different IP addresses can map to the same DNS name


#### DNS Hierarchy

![[file-20261118170119696.png|507]]


#### Resolving DNS Names

`getaddrinfo()`
- A complicated system call found in `#include <netdb.h>`
- `int getaddrinfo(const char* hostname, const char* service, const struct addrinfo* hints, struct addrinfo** res)`
	- Tell `getaddrinfo()` which host and port you want resolved
	- `getaddrinfo()` gives you a list of results packed into an “addrinfo ” structure/linked list
		- Returns 0 on success; returns negative number on failure

`getaddrinfo()` arguments
- hostname – domain name or IP address string
- service – port # (e.g., "80"), service name (e.g., "http"), or NULL /nullptr
- hints – filter result


#### DNS Lookup Procedure

1) Create a struct addrinfo hints
2) Zero out hints for “defaults"
3) Set specific fields of hints as desired
4) Call `getaddrinfo()` using &hints
5) Resulting linked list `*res` will have all fields appropriately set
