---
order: 21
---

## Socket API: Client TCP Connection

five steps:
1) Figure out the IP address and port to connect to
2) Create a socket 
3) Connect the socket to the remote server 
4) .read () and write () data using the socket 
5) Close the socket


#### Step 2: Creating a Socket

`int socket (int domain, int type, int protocol);`
- Creating a socket doesn’t bind it to a local address or port yet
- Returns [[Sockets, DNS#File Descriptor Table|file descriptor]] or -1 on error

```cpp
#include <arpa/inet.h>
#include <unistd.h>

#include <cstdlib>
#include <cstring>
#include <iostream>

int main(int argc, char* argv[]) {
  int socket_fd = socket(AF_INET, SOCK_STREAM, 0);
  if (socket_fd == -1) {
    std::cerr << strerror(errno) << std::endl;
    return EXIT_FAILURE;
  }
  close(socket_fd);
  return EXIT_SUCCESS;
}
```


#### Step 3: Connect to the Server

`connect()` system call establishes a connection to a remote host
- `int connect(int sockfd, const struct sockaddr* addr, socklen_t addrlen);`
- Returns 0 on success and - 1 on err

`connect()` may take some time to return
- It is a blocking call by default
- The network stack within the OS will communicate with the remote host to establish a TCP connection to it


#### Step 4: read()

If there is data that has already been received by the network stack, then read will return immediately with it
- `read()` might return with less data than you asked for

If there is no data waiting for you, by default `read()` will block until something arrives


#### Step 4: write()

`write()` queues your data in a send buffer in the OS and then returns
- The OS transmits the data over the network in the background
- When `write()` returns, the receiver probably has not yet received the data

If there is no more space left in the send buffer, by default `write()` will block


#### Step 5: close()

`int close(int fd);`
- Shuts down the socket and frees resources and file descriptors associated with it on both ends of the connection



## Socket API: Server TCP Connection

1) Figure out the IP address and port on which to listen
2) Create a socket
3) bind() the socket to the address(es) and port
4) Tell the socket to listen() for incoming clients
5) accept() a client connection
6) .read() and write () to that connection
7) close() the client socket


#### Servers

Servers can have multiple IP addresses (“multihoming”)
- Usually have at least one externally-visible IP address, as well as a local-only address

The goals of a server socket are different than a client socket
- Want to bind the socket to a particular port of one or more IP addresses of the server
- Want to allow multiple clients to connect to the same port
	- OS uses client IP address and port numbers to direct I/O to the correct server file descriptor


#### Step 1: Figure out IP address(es) & Port

`getaddrinfo()` invocation may or may not be needed (but we’ll use it)
- Do you know your IP address(es) already?
	- Static vs. dynamic IP address allocation
	- Even if the machine has a static IP address, don’t wire it into the code – either look it up dynamically or use a configuration file
- Can request listen on all local IP addresses by passing NULL as hostname and setting AI_PASSIVE in hints.ai_flags


#### Step 2: Creating a Socket

`socket()` call is same as before
- returns a file descriptor – IP address and port are not associated with socket yet


#### Step 3: Bind the socket

`int bind(int sockfd, const struct sockaddr* addr, socklen_t addrlen);`
- Looks nearly identical to `connect()`
- Returns 0 on success, -1 on error


#### Step 4: Listen for Incoming Clients

`int listen(int sockfd, int backlog);`
- Tells the OS that the socket is a listening socket that clients can connect to
- backlog: maximum length of connection queue
- Returns 0 on success, -1 on error

Clients can start connecting to the socket as soon as `listen()` returns


#### Step 5: Accept a Client Connection

`int accept(int sockfd, struct sockaddr* addr, socklen_t* addrlen);`
- Returns an active, ready-to-use socket file descriptor connected to a client (or -1 on error)
	- `sockfd` must have been created, bound, and listening
	- Pulls a queued connection or waits for an incoming one
- `addr` and `addrlen` are [[Pointers#Output Parameters|output parameters]]
	- `*addrlen` should initially be set to `sizeof(*addr)`, gets overwritten with the size of the client address
	- Address information of client is written into `*addr`
