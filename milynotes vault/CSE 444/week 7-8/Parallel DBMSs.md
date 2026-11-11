---
order: 11
---

OLAP: Query response time
	Online Analytical Processing



## Architecture

#### Shared-Memory Architecture

![[shared memory architecture.png|357]]


- Shared main memory and disks
- Expensive to scale
- Easiest to implement on


#### Shared-Disk Architecture

![[shared disk architecture.png|366]]


- Only shared disks
- No contention for memory and high availability
- Typically 1-10 machines


#### Shared-Nothing Architecture

![[shared nothing architecture.png|368]]


- Uses cheap, commodity hardware
- No contention for memory and high availability
- Theoretically can scale infinitely
- Hardest to implement on



## Shared-Nothing 

Multiple DBMS instances (= processes) also called “nodes” execute on machines in a cluster
- One node plays role of the coordinator
- Other nodes play role of workers 

Workers execute queries
- Typically all workers execute the same plan
- Workers can execute multiple queries at the same time



## Data partitioning

#### Option 1: Unpartitioned Table

- Entire table on just one node in the system
- Will bottleneck any query we need to run in parallel
- We choose partitioning scheme to divide rows among machines


#### Option 2: Block Partitioning

![[block partitioning.png|490]]


Tuples are horizontally (row) partitioned by raw size with no ordering considered


#### Option 3: Range Partitioning

Node contains tuples in chosen attribute ranges

![[range partitioning.png|495]]


#### Option 4: Hash Partitioning

Node contains tuples with chosen attribute hashes

![[hash partioning.png|509]]



## Parallel selection

For a query like:

```
SELECT *
FROM R
WHERE A = 2;
```

If $R$ is block partitioned, every node scans its own chunk and applies the selection locally. The final output is the union of all local outputs.



## Parallel aggregation / Group By

For:

```
SELECT A, sum(B)
FROM R
GROUP BY A;
```

Two cases.

Case 1: $R$ is already partitioned on $A$
Each node can [[GROUP BY|group]] locally

Case 2: $R$ is partitioned on something else 
Then rows with the same $A$ may be spread across many nodes. You need to [[#Shuffle operator|reshuffle]] by $A$, so all rows for the same group end up on the same node.


Naive plan:
1. Shuffle all tuples by $A$
2. Group locally on each node

Better plan:
1. Do local partial aggregation first
2. Shuffle the smaller partial results by $A$
3. Aggregate again



## Shuffle operator

Serves to re-shuffle data between processes 
- Handles data routing, buffering, and flow control

Two parts:
ShuffleProducer and ShuffleConsumer

Producer:
- Pulls data from child operator and sends to n consumers
- Producer acts as driver for operators below it in [[DBMS architecture#Physical Query Plan|query plan]]

Consumer: 
- Buffers input data from n producers and makes it available to operator through getNext() interface



## Partitioned Hash Equijoin

1. Hash shuffle tuples on join attributes
2. Local join


![[Equijoin.png|589]]



## Parallel Join

Step 1
- Every server holding any chunk of $R$ partitions its chunk using a hash function $h(t.A) \mod P$
- Every server holding any chunk of $S$ partitions its chunk using a hash function $h(t.B) \mod P$

Step 2:
- Each server computes the join of its local fragment of $R$ with its local fragment of $S$


#### Optimization for Small Relations

if $|R| >> |S|$
- Leave $R$ where it is
- Replicate entire $S$ relation across nodes

Also called a small join or a broadcast join

