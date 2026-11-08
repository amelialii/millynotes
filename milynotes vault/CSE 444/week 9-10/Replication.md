---
order: 15
---

## Goals of Replication

1. Consistency
		always read latest update
2. availability
		every request $\rightarrow$ a response
3. performance
		fast read/writes



## Synchronous Replication

also called eager replication
all updates are applied to all replicas (or to a majority) as part of a single [[Concurrency Control#Transaction|transaction]] (need [[Two-Phase Commit|2PC]]
transactions must acquire global lock
main goal: as if there was only one copy
- maintain consistency
- maintain one-copy [[Concurrency Control#Serializability|serializability]]

![[synchronousreplication.png|538]]


### Synchronous Master Replication

- One master for each object holds primary copy
	- The “Master” is also called “Primary” 
	- To update object, transaction must acquire a lock at the master 
	- Lock at the master is global lock
- Master propagates updates to replicas synchronously
	- Updates propagate as part of the same distributed transaction
	- Need to run 2PC at the end

![[syncmasterrep.png|534]]


## Crash Failures


What happens when a secondary crashes?
- Nothing happens
- When secondary recovers, it catches up

What happens when the master/primary fails?
- Blocking would hurt availability
- Must chose a new primary: run election


## Network Failures

Secondaries think that primary failed
Secondaries elect a new primary
But primary can still be running
Now have two primaries


### Synchronous Group Replication

Master-less
- Any node can initiate a transaction
- Need to gather a number of nodes that agree on a particular transaction
- Each copy has its own lock

With $n$ copies
- Exclusive lock on $x$ copies is global exclusive lock
- Shared lock on $s$ copies is global shared lock
- Must have:$x > \frac n2$ and $s + x > n$
- Version numbers serve to identify current copy

![[syncgrouprep.png|471]]


Majority locking
- $s = x = \lceil \frac{n+1}{2} \rceil$
- usually not attractive because reads are slowed down

Read-locks-one, write-locks-all
- $s=1$ and $x = n$, high read performance
- Reads are very fast



## Synchronous Replication Properties

Favours consistency over availability
- Only majority partition can process requests
- There appears to be a single copy of the db

High runtime overhead
- Must lock and update at least majority of replicas
- Two-phase commit
- Runs at pace of slowest replica in quorum
- So overall system is now slower
- Higher [[Concurrency Control#2PL Deadlocks|deadlock]] rate (transactions take longer)



## Asynchronous Replication

Also called lazy replication, optimistic replication

Main goals: availability and performance

Approach
- One replica updated by original transaction
- Updates propagate asynchronously to other replicas

![[asyncrep.png|498]]


One master holds primary copy
- Transactions update primary copy
- Master asynchronously propagates updates to replicas, which process them in same order E.g. through [[Transactions Recovery|log]] shipping 
- Ensures single-copy serializability

What happens when master/primary fails?
- Can lose most recent transactions when primary fails
- After electing a new primary, secondaries must agree who is most up-to-date


### Asynchronous Group Replication

Also called multi-master
Best scheme for availability
Cannot guarantee one-copy serializability
Instead guarantee convergence
- Db state does not reflect any serial execution
- But all replicas have the same state
Called “Eventual Consistency” = if the DB stops operations, then eventually all copies are equal
Detect conflicts and reconcile replica states
Reconciliation techniques:
- Most recent timestamp wins
- Site A wins over site B
- But also: user-defined rules, or even manual


![[conflicttimestamp.png|529]]
