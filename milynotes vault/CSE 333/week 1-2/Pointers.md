---
order: 3
---

## Pointer Basics

Variables that store addresses
- It points to somewhere in the process’ [[Memory, Data, Parameters#Processes and Virtual Memory|virtual address space]]
- `&foo` produces the virtual address of `foo`

Generic definition: `type* name;` or `type *name;`
- Recommended: do not define multiple pointers on same line:

Dereference a pointer using the unary `*` operator



## Pointer Arithmetic

Pointers are typed
Pointer arithmetic is scaled by `sizeof(*p)`
Valid pointer arithmetic:
- Add/subtract an integer to/from a pointer
- Subtract two pointers (within stack frame or [[Structs, Heap#malloc ()|malloc]] block)
- Compare pointers (<, <=, == , !=, >, >=), including NULL


#### Endianness

Determines what ordering that multi-byte data gets read and stored in memory
- Big-endian: Least significant byte has highest/biggest address
- Little-endian: Least significant byte has lowest/littlest address

4-byte data 0xa1b2c3d4 at address 0x100:
![[file-20261005195440958.png]]



## Pointers as Parameters

```
void Swap(int* a, int* b) {
	int tmp = *a;
	*a = *b;
	*b = tmp;
}

int main(int argc, char* argv[]) {
	int a = 42, b = -7;
	Swap(&a, &b);
	...
```


#### Output Parameters

A pointer parameter used to store (via dereference) a function output outside of the function’s stack frame

Setup and usage:
1) Caller creates space for the data (e.g., type var;)
2) Caller passes in a pointer to Callee (e.g., &var)
3) Callee takes in output parameter (e.g., type* outparam)
4) Callee uses parameter to set output (e.g., *outparam = value;)
5) Caller accesses output via modified data (e.g., var)



## Function Pointers

```
#define LEN 4

int Negate(int num) {return -num;}
int Square(int num) {return num * num;}

// perform operation pointed to on each array element
void Map(int a[], int len, int (* op)(int n)) {
	for (int i = 0; i < len; i++) {
		a[i] = op(a[i]); // dereference function pointer
	}
}

int main(int argc, char* argv[]) {
	int arr[LEN] = {-1, 0, 1, 2};
	Map(arr, LEN, Square);
}
```