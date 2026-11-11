---
order: 13
---

Goal: Better use distributed memory in a cluster



## RDDs

Resilient Distributed Datasets
RDD properties 
- Parallel data structure
- Can be persisted in memory
- Fault-tolerant
- Users can manipulate RDDs with rich set of operators

RDD details
- An RDD is a partitioned collection of records
	- RDD’s are typed: RDD[Int] is an RDD of integers
- An RDD is read only
	- This means no updates to individual records
	- This is to contrast with in-memory key-value stores
- To create an RDD:
	- Execute a deterministic operation on another RDD
	- Or on data in stable storage
	- Example operations: map, filter, and join



## Materialization

Users control persistence and partitioning
- Persistence
	- Should we materialize this RDD in memory?
- Partitioning
	- Users can specify key for partitioning an RDD


#### Spark Programming Interface

- RDDs implemented in new Spark system
- Spark exposes RDDs though a languageintegrated API similar to DryadLINQ but in Scala
- Later Spark was extended with SQL


#### Transformations vs. actions

Programmer first defines RDDs through transformations on data in stable storage
- map, filter, etc.

Then, can use RDDs in actions
- Action returns a value to app or exports to storage
- count, collect, save



## Query Execution Detail

- Lazy evaluation
	- RDDs are not evaluated until an action is called
- In memory caching
	- Spark workers are long-lived processes
	- RDDs can be materialized in memory in workers
	- Base data is not cached in memory
