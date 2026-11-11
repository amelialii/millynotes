---
order: 15
---

## STL

#### List

a generic doubly-linked list
- elements are not stored in contiguous memory locations
	- no random access: `lst[5]` doesnt work. have to walk with [[C++ Standard Template Library#STL iterator|iterator]]
		```
		auto it = lst.begin();
		++it;      // move one node at a time
		```
- some operations are much more efficient than vectors
	```
	lst.insert(it, 99); // vector would shift everything after it, O(n)
	lst.erase(it);
	```
- has a built-in short member function
	```
	lst.sort();                          // OK
	std::sort(lst.begin(), lst.end());   // ERROR: std::sort needs random access
	```


#### Map

one of C++'s associative containers: a key/value table, implemented as a search tree

properties:
- keys must be unique
- efficient lookup ($O(\log n)$) and insertion ($O(\log n)$)
- elements are type `pair<key_type, value_type>` and are stored in sorted order
	- iterator always goes in key order
- key type must support `<` or won't compile

```
m["a"] = 1;          // insert OR overwrite
m.insert({"a", 2});  // does nothing, "a" already exists
int x = m["zzz"];    // key missing → INSERTS {"zzz", 0}
auto it = m.find("q");          // safe, never inserts
if (it != m.end()) it->second;  // check before using
```


#### Unordered Containers

`unordered_map` , `unordered_set`
- hash table instead of tree $\rightarrow$ $O(1)$ average lookup
- no ordering when iterating
- use `map` if need sorted order or ranges, `unordered_map` if only need lookups



## Smart Pointers

A [[C++ Smart Pointers|smart pointer]] is an object that stores a pointer to a heap-allocated object
- looks and behaves like a regular C++ pointer
	```
	*sp;     // calls operator*, which returns *ptr_
	sp->x;   // calls operator->, which returns ptr_
	```
- [[C++ Classes, Constructors, and Copies#Destructors|destructor]] deletes the object
	```
	  {
	    ToyPtr<Point> p(new Point);
	  }   // p goes out of scope → ~ToyPtr runs → delete ptr_
	```

```
ToyPtr(T* ptr) : ptr_(ptr) { }      // constructor takes the pointer
~ToyPtr() { delete ptr_; }          // destructor deletes it
T& operator*()  { return *ptr_; }   // so *p works
T* operator->() { return ptr_; }    // so p->x works
```
