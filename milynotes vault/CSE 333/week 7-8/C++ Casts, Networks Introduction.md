---
order: 19
---

## C++ Casts

#### `static_cast`

`static_cast` can convert:
- pointers to classes of related type
	- dangerous to cast down a class hierarchy
- casting between `void*` and `T*`
- non-pointer conversion
	- `float` to `int`


#### `dynamic_cast`

can convert:
- pointers to classes of related type
- references to classes of related type

is checked at both compile time and run time
- cast between unrelated classes fail at compile time


#### `const_cast`

adds or strips const-ness
- typically used to interface with legacy code lacking cost-correctness


#### `reinterpret_cast`

casts between incompatible types
- low-level reinterpretation of the bit pattern
- e.g. storing a pointer in an `int` or vice-versa
- use any other C++ cast if can



## C++ Conversions

#### Implicit Conversion

The compiler tries to infer some kind of conversions
- When types are not equal and you don't specify an explicit cast, the compiler looks for an acceptable implicit conversion

```cpp
void Bar ( std::string x);

void Foo () {
	Bar("hi"); // conversion, (const char*) - > string
}
```


#### Sneaky Implicit Conversion

if a class has a constructor with a single parameter, the compiler will exploit it to perform implicit conversions



## Networks Introduction

#### Big picture

- To send data, a program packs it into **packets** and asks the **OS** to deliver them.
- Each packet has a **header** (metadata) for each layer, so the next machine knows what to do with it.
- A **protocol** is the standard for a header's format and how software reads it.


#### OSI layers

to: next stop (MAC) | to: Google (IP) | port 80, chunk #1 | GET /
     data link          network            transport        application

| Layer | Adds | Job | Changes during trip? |
|---|---|---|---|
| 7 Application | the message (`GET /`) | what you're asking | no |
| 5–6 Session / Presentation | — | mostly missing in practice | — |
| 4 Transport (TCP) | port + chunk # | which program; reorder and resend pieces | no |
| 3 Network (IP) | IP address | final destination | no |
| 2 Data link | MAC address | next stop (router) | yes, every stop |
| 1 Physical | — | sends bits as signals (wifi, cable, fiber) | — |

- DNS turns `google.com` into an IP before any of this


#### Encapsulation

Each layer wraps the one above it as its payload:

```
[ ethernet hdr | IP hdr | TCP hdr | HTTP hdr | HTTP payload ]
```

- Routers take the IP packet out of the Ethernet frame and put it into a **new** frame for the next network. The IP part stays the same; the link-layer frame gets replaced.
- One TCP stream can be split across **many** IP packets, which are put back in order using sequence numbers.


#### TCP vs UDP

|          | TCP                                                        | UDP                       |
| -------- | ---------------------------------------------------------- | ------------------------- |
| Delivery | Reliable, ordered                                          | Unreliable                |
| How      | Sequence numbers, resends lost packets, congestion control | A thin layer on top of IP |
| Model    | Byte stream                                                | Datagrams                 |

- **Port** = like an apartment number at the IP's street address. It's 16 bits, so up to 65,535 ports per host.
- **Sockets API** (OS system calls):
    - client: `connect()`
    - server: `listen()` + `accept()`
    - both: `read()` / `write()`


#### Application protocols

- **DNS** turns a domain name into an IP address (`www.google.com` → `74.125.197.106`), using a hierarchy of DNS servers.
- **HTTP** is how browsers and web servers talk. It runs on top of TCP.
- **SMTP / IMAP / POP**: email.
- **SSH**: secure remote login.
- **BitTorrent**: peer-to-peer file sharing.


#### "Narrow waist"

- Most of the internet's machinery only deals with **IP, TCP and UDP** (together, "TCP/IP").
- The link layer is handled by drivers, and everything above is the app's problem.


#### What affects speed (latency)

- **Material**: fiber has lower latency and more bandwidth than copper.
- **Distance**: within a datacenter is much faster than across continents.
- **Topology**: how well a place connects to the backbone. One example is the 2006 Hengchun earthquake, which cut off much of Asia for about a month.
