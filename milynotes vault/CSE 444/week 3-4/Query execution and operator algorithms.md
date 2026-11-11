---
order: 5
---

**execution strategies** for:

**1. Accessing data**
- Table scan
- Index-based selection

**2. Combining data ([[JOINs|joins]])**
- Nested loop
- Hash join
- Merge join
- Index nested loop

**3. Handling large data**
- External merge sort
- Partitioned hash join



## Memory Management

each operator:
	- Pre-allocates heap space for input/output tuples
		- Option 1, BP-tuples: pointers to data in [[Storage#Buffer Manager|buffer pool]]
		- Option 2, M-tuples: new tuples on the heap
	- Allocates memory for its internal state
		- on heap

DBMS limits how much memory each operator, or each query can use



## Join operator algorithms

cost = total number of I/Os
parameters:
- $B(R)$ = # of blocks for relation $R$
- $T(R)$ = # of tuples in relation $R$
- $V(R, a)$ = # of distinct values of attribute $a$
	- where $a$ is a key, $V(R, a) = T(R)$
	- when $a$ is not a key, $V(R, a)$ ca be anything $\le T(R)$

cost = the cost of reading operands



## Join algorithms

### Hash Join

1. scan $R$, build buckets in main memory
2. then scan $S$ and join
3. cost: $B(R) + B(S)$
4. one-pass algorithm when $B(R) \le M$

Hash table holds the entire first table
Input buffer holds just one page of 2nd table at a time
Output buffer holds results before writing them out

![[hashjoin1.png|510]]
![[hashjoin2.png|522]]


### Nested loop join

for each tuple $t_1$ in $R$ do
	for each tuple $t_2$ in $S$ do
		if $t_1$ and $t_2$ join then output $(t_1, t_2)$

$B(R) + T(R)B(S)$


#### Page-at-a-time refinement

for each page of tuples $r$ in $R$ do
	for each page of tuples $s$ in $S$ do
		for all pairs of tuples $t_1$ in $r$, $t_2$ in $s$
			if $t_1$ and $t_2$ join then output $(t_1, t_2)$

$B(R) + B(R)B(S)$


#### Block-Memory Refinement

for each group of $M-1$ pagers $r$ in $R$ do
	for each page of tuples $s$ in $S$ d
		for all pages of tuples $t_1$ in $r$, $t_2$ in $s$
			if $t_1$ and $t_2$ join then output $(t_1, t_2)$


cost: $B(R) + \frac{B(R) \cdot B(S)}{M - 1}$


### Sort-merge join

scan $R$ and sort in main memory
scan $S$ and sort in main memory
merge $R$ and $S$

cost: $B(R) + B(S)$

```
pointer r = start of R
pointer s = start of S

while r and s:
  if r.a < s.a: advance r
  if r.a > s.a: advance s
  if equal: output matches, advance appropriately
	  (consume the whole matching block on both sides, then move both pointers forward)
```


### Index Nested Loop Join Cost

If index on S is [[Indexing|clustered]]: $B(R) + \frac{T(R)B(S)}{V(S,a)}$
If index on S is unclustered: $B(R) + \frac{T(R)T(S)}{V(S,a)}$


### External Merge-Sort

Sort a relation **too large to fit in memory**
- Data size = $B(R)$ pages
- Memory size = $M$ pages

Break data into chunks → sort each chunk → merge them

**Phase 1: Create Initial Runs**
- Read **M pages** into memory
- Sort in memory (like quicksort)
- Write sorted chunk back to disk
Repeat until all data processed

**Phase 2: Merge Runs**
- Merge **up to $M−1$** runs at once
    - (need 1 buffer for output)
- Produce larger sorted runs
Repeat until one fully sorted file remains

general cost: $O(B(R)log_M B(R))$


2-pass sort works if:  
$B(R) ≤ M^2$


### Partitioned Hash Join (GRACE JOIN)

If data doesn’t fit → **break into smaller chunks that do**

**Step 1: Partition S**
- hash into $M−1$ buckets
- write buckets to disk

**Step 2: Partition R**
- same hash function
- matching keys go to same bucket

**Step 3: Join each pair of buckets**
- load one bucket into memory
- build hash table
- probe with matching bucket

key condition: $B(R) \le M^2$
cost: $3B(R) + 3B(S)$



## Access Methods (Selection)

### Index-Based Selection

Use an **[[Indexing|index]]** to avoid scanning the entire table for a selection
  
Given:  
- B(R): # of pages  
- T(R): # of tuples  
- V(R, a): # distinct values of attribute a  
  
Goal: find tuples where a = v


[[Indexing#Primary/Clustered Index|clustered index]] cost: $\frac{B(R)}{V(R, a)}$
unclustered index: $\frac{T(R)}{V(R, a)}$

