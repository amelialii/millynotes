---
order: 22
---

#### HTTP Basics

A client establishes one or more [[C++ Casts, Networks Introduction#TCP vs UDP|TCP]] connections to a server
- The client sends a request for a web object over a connection and the server replies with the object’s contents

We formalize the way our web browser asks a web server for data via an application layer protocol


#### Protocols

A protocol is a set of rules governing the format and exchange of messages in a computing system
- What messages can a client exchange with a server? 
	- What are the syntax and semantics of those messages?
	- How are errors conveyed?
- A protocol is (roughly) the network equivalent of an API


#### HTTP

**H**yper**t**ext **T**ransport **P**rotocol
- A request/response protocol
	- A client (web browser) sends a request to a web server
	- The server processes the request and sends a response
- Typically, a request asks a server to retrieve a resource
	- A resource is an object or document, named by a Uniform Resource Identifier (URI)
- A response contains the bytes of that resource


#### HTTP Methods

- GET: “Please send me the named resource”
- POST: “I’d like to submit data to you” (e.g., file upload)
- HEAD: “Send me the headers for the named resource
	- Doesn’t send resource; often to check if cached copy is still valid


#### Client Header

The client can provide one or more request “headers”
- These provide information to the server or modify how the server should process the request

- Host: The [[Sockets, DNS#DNS Lookup|DNS]] name of the server
- User - Agent: An identifying string naming the browser
- Accept: The content types the client prefers or can accept
- Cookie: An HTTP cookie previously set by the server


#### HTTP/1.1 Response

A server parses and sends a response to a user
- Indicate how the server processed the request (accepted or not)
- Send requested resource back to the client

General Form
```markdown
HTTP/[version] [status code] [reason]\r\n
[headerfield1]: [fieldvalue1]\r\n
[headerfield2]: [fieldvalue2]\r\n
[...]
[headerfieldN]: [fieldvalueN]\r\n
\r\n
[request body, if any]
```


#### Status Codes and Reason

Code: numeric outcome of the request – easy for computers to interpret
- A 3-digit integer with the 1st digit indicating a response category
	- 1xx: Informational message
	- 2xx: Success
	- 3xx: Redirect to a different U
	- 4xx: Error in the client’s request
	- 5xx : Error experienced by the server


#### Common Status

HTTP/1.1 200 OK
- The request succeeded and the requested object is sent
HTTP/1.1 404 Not Found
- The requested object was not found
HTTP/1.1 301 Moved Permanently
- The object exists, but its name has changed
HTTP/1.1 500 Server
- The server had some kind of unexpected error


#### Server Headers

The server can provide zero or more response “headers”
- These provide information to the client or modify how the client should process the response

- Server: a string identifying the server software
- Content - Type: the type of the requested object
- Content - Length: size of the requested object
- Last - Modified: a date indicating the last time the requested object was modified
