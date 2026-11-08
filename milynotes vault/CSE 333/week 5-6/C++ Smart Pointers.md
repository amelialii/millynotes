---
order: 16
---

## STL Smart Pointers

#### Goals for Smart Pointers

Should automatically handle dynamically-allocated memory to decrease programming overhead of managing memory

Should work similarly to using a normal/“raw” pointer


#### Reference Counting

`shared_ptr` implements reference counting
- Counts the number of references to a piece of heap-allocated data and only deallocates it when the reference count reaches 0
- Managed abstractly through sharing a resource counter
	- Constructors will create the counter
	- Copy constructor and operator= will increment the counter

```
shared_ptr<int> x(new int(5));  // 1
shared_ptr<int> y(x);           // 2
// y dies → 1, x dies → 0 → delete
```


#### `shared_ptr`s and STL Containers

Use `shared_ptr`s inside STL Containers
- avoid extra object copies
- safe to do since copy/assign maintain a shared reference count

unique ownership (`unique_ptr`)
- only one owner, so it always deletes when it dies


#### `unique_ptr`s Cannot Be Copied

```
unique_ptr<int> y(x);  // ✗ compile error
z = x;                 // ✗ compile error
```


#### `unique_ptr`s and STL

```
vec.push_back(unique_ptr<int>(new int(5)));  // ✓ moved in
int z = *vec[0];                              // ✓ just reading
unique_ptr<int> c(vec[0]);                    // ✗ copy
```


#### Passing Ownership

```
unique_ptr<int> y(x.release());   // x → nullptr, y owns it
z.reset(y.release());             // z deletes its old value, takes y's
unique_ptr<int> b = std::move(a); // a → nullptr, b owns it
```


#### Choosing between smart pointers

`unique_ptr`s make ownership very clear
- Generally the default choice due to reduced complexity, owner is responsible for cleaning up the resource
`shared_ptr`s allow for multiple simultaneous owners
- Reference counting allows for “smarter” deallocation but consumes more space and logic and is trickier to get right



## Smart Pointer Limitations

- Can’t tell if pointer is to the heap or not 
- Circumventing ownership rules
- Still possible to leak memory


#### non-heap pointers

```
int x = 5;
shared_ptr<int> p(&x);   // ✗ calls delete on a stack variable
```


#### Circumventing Ownership

```
int* r = new int(5);
shared_ptr<int> a(r), b(r);   // ✗ two separate counts → double delete
unique_ptr<int> q(p1.get());  // ✗ same bug via get()
// fix: never keep the raw pointer
shared_ptr<int> a(new int(5)), b(a);   // ✓
```


#### leaking memory

```
struct N { shared_ptr<N> next, prev; };
A->next = B; B->prev = A;   // each keeps the other's count ≥ 1 → leak ✗
```


#### `weak_ptr`

- points at the data but doesn't count, so it breaks cycles
- can't use * on it directly; call `lock()` first

```
struct N { shared_ptr<N> next; weak_ptr<N> prev; };  // ✓ no leak
shared_ptr<int> s = w.lock();  // nullptr if the data is gone
w.expired();                   // true if count == 0
```
