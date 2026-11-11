---
order: 4
---

## Index structures

- index: separate file with mast access by "search key" value
- contains pairs of the form (key, [[Storage#RID|RID]])

- indexes are [[DBMS architecture#Access Methods|access methods]]

![[index.png]]


search key = an attribute or set of attributes
 - not a key

index = collection of data entries

data entry for key k can be:
- (k, RID)
- (k, list-of-RIDs)
- record with key k; "clustered" or "primary" index


#### Primary/Clustered Index

the data itself is stored in the same order as the index


#### Dense Index

there is an index entry for every record


#### Sparse Index

only some records have index entires



## Hash-based indexes

key → hash function → bucket → (key, RID) → actual data

Good for point queries but not range queries


 Query:
```
WHERE age = 21
```

Step 1: hash
```
h(21) → Bucket 1
```

 Step 2: look inside bucket
```
Bucket 1 → [(21, RID7), (21, RID12)]`
```

Step 3: follow RID
```
RID7 → Page 42 → actual row  
RID12 → Page 99 → actual row
```



## B+ Trees

**Default index structure on most DBMSs**


- search trees
- idea in B Trees
	- make 1 node = 1 page ( = 1 block)
	- maximize number of children per node
	- ideal is to keep height as small as possible
- idea in B+ Trees
	- keys are stored on the leaves (not internal nodes)
	- leaves are linked in a list, for range queries


![[b+tree.png]]


[[Query Optimization|Optimizer]] decides use the B+ tree index
Executor does:
1. Read B+ tree root node from disk → "go right, key is > 60"
2. Read an internal node from disk → "go left, key is < 200"
3. Read a leaf node from disk → "sid 12345 is at page 47, slot 3"
4. Read page 47 from disk → return that one record



- for each node except the root, maintain 50% occupancy of keys
- insert and delete must rebalance to maintain constraints


parameter $d$ = the degree
each node has $d \le m \le 2d$ keys (except root) 
each node also has $m + 1$ pointers

![[b+nodes.png]]
each leaf has $d \le m \le 2d$ keys
![[b+leaf.png]]


#### Insertion in a B+ Tree

1. fine the right leaf, insert the key there
2. if the leaf now has $\le 2d$ keys $\rightarrow$ done
3. if it has $2d + 1$ keys $\rightarrow$ split: divide into two nodes, push the middle key up to the parent
	- for leaves: keep the middle key in the right node AND push a copy up
		- with $2d+1$ keys, middle one is the $d+1$th key
	- for internal nodes: the middle key moves up and is removed from below
4. repeat upward if the parent also overflows
5. if the root splits, a new root is created with just 1 key

![[b+insert.png|560]]

![[b+split.png|585]]


#### Deletion in a B+ Tree

1. Find the leaf, delete the key
2. If the leaf still has $\ge d$ keys $\rightarrow$ done
- If it's now underfull, check an adjacent sibling:
    - If the sibling has **extra keys** $\rightarrow$ **rotate** one over (borrow), update the parent key
    - If the sibling is exactly at d keys $\rightarrow$ **merge** (with left preferred) the two nodes into one, which removes a key from the parent
- Repeat upward if the parent is now underfull
- If the root ends up with 0 keys, it's deleted and its only child becomes the new root


![[b+delete1.png|605]]


![[b+delete2.png|586]]


![[b+delete3.png|601]]


![[b+delete4.png|602]]


![[b+delete5.png|591]]


#### Searching a B+ Tree

![[b+serach.png|510]]



## Practical Numbers

- Typical $d = 100$, nodes $\approx 66\%$ full
- height 3 tree $\rightarrow$ ~2.3 million records
- height 4 tree $\rightarrow$ ~313 million records