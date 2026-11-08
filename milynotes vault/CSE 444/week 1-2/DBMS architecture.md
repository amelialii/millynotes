---
order: 2
---

User Query $\rightarrow$ Query Processor $\rightarrow$ Storage Manager $\rightarrow$ Disk


## Query Processor


understands and plans your query


- Step 1: Parser
	- Parses query into an internal format
	- Performs various checks using catalog
- Step 2: Query rewrite
	- View rewriting, flattening, etc. (removes abstractions like [[Views & Temp Tables#Views|views]])
- Step 3: [[Query Optimization|Optimizer]]
	- Find an efficient query plan for executing the query
		- should we scan the whole table?
		- which table should be read first?
		- what [[Query execution and operator algorithms#Join algorithms|join algorithm]] should be used?
	- A query plan is
		- Logical: An extended [[Relational Model Review#Relational Algebra|relational algebra]] tree
			- what operations to perform
		- Physical: With additional annotations at each node 
			- Access method to use for each relation 
			- Implementation to use for each relational operator
- Step 4: Executor
	- Actually executes the physical plan
		- scan table
		- filter rows
		- [[JOINs|join]] tables
		- output results


### Physical Query Plan

- Logical query plan with extra annotations
- **Implementation choice** for each operator
- Access path selection for each relation
	- Bottom of tree = read from disk
	- Use a file scan or use an [[Indexing|index]]


### Query Executor

`Tuple.java` describes a row object in SimpleDB
- rows are the objects passed through the database
- in the same way we conceptualize RA and a series of transformations to rows, so does it work in database


### Pull-Based Execution


Parent operator asks the child:
"Give me the next row"

Example call chain:
```
Project.next()
	-> Join.next()
		-> SeqScan.next()
```


`open()`: prepare operator
`next()`: return the next tuple (row)
`close()`: cleanup

![[query-execution.png|505]]



## Storage Manager


handles:
- disk storage
- memory caching
- reading data efficiently

### Access Methods

- Operators: Process data
- [[Indexing|Access methods]]: Organize data to support fast access to desired subsets of records
- [[Storage#Buffer Manager|Buffer manager]]: Caches data in memory. Reads/writes data to/from disk as needed
- Disk-space manager: Allocates space on disk for files/access methods


![[access-methods.png|381]]



```
SeqScan wants row
      ↓
HeapFile finds page
      ↓
BufferPool checks if page cached in memory
      ↓
Disk read if needed
```


- A DBMS stores data on disk by breaking it into pages
	- A page is the size of a disk block
	- A page is the unit of disk IO
- **Buffer manager** caches these pages in memory
	- keeps track of which pages are dirty
		- a dirty page has changes not reflected on disk
		- Implementation: Each page includes a dirty bit
- **Access methods** do the following:
	- They organize pages into collections called DB files
	- They organize data inside pages
	- They provide an API for operators to access data in these files


### Disk Storage

- Can only read 1 block per read operation
	- Usually 512B to 4kB
- One blocks contains some Tuples
- Sequential disk reads are faster than random ones
- Cost ~1-2% random scan = full sequential scan

