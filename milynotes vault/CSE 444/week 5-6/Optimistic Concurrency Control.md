---
order: 9
---

Isolation Level Design Spectrum

![[IsolationLevelDesignSpectrum .png|595]]



## Isolation Levels

#### Dirty Read

"Long duration" write locks
- [[Concurrency Control#Strict 2PL|Strict 2PL]]

No READ Locks
- Read-only [[Concurrency Control#Transaction|transactions]] are never delayed

Possible problems: [[Concurrency Control#Concurrent Execution Problems|dirty and inconsistent read]]


#### Read Committed

"Long duration" write locks
- Strict 2PL

"Short Duration" READ Locks
- Only acquire lock while reading (not 2PL)

Unrepeatable reads: When reading same element twice, may get two different values


#### Repeatable Read

"Long duration" write locks
- Strict 2PL

"Long Duration" READ Locks
- Strict 2PL

not [[Concurrency Control#Serializability|serializable]] yet


#### Serializable

"Long duration" write locks
- Strict 2PL

"Long Duration" READ Locks
- Strict 2PL

Predicate locking
 - To deal with [[Concurrency Control#Phantom Problem|phantoms]]



## Pessimistic vs. Optimistic

[[Concurrency Control#Locking|Pessimistic CC (locking)]]
- Prevents unserializable schedules
- Never abort for serializability (but may abort for [[Concurrency Control#2PL Deadlocks|deadlocks]]) 
- Best for workloads with high levels of contention

Optimistic CC (timestamp, multi-version, validation)
- Assume schedule will be serializable
- Abort when conflicts detected
- Best for workloads with low levels of contention



## Timestamp Ordering

Each transaction receives unique timestamp $TS(T)$
could be:
- the system's clock
- a unique counter, incremented by the scheduler

Timestamp order defines the serialization order of the transaction

Will generate a schedule that is [[Concurrency Control#View-Serializability|view-equivalent]] to a serial schedule, and recoverable



## Per-Element Timestamps

with each element $X$, associate
- $RT(X)$ = the highest timestamp of any transaction $U$ that reads $X$
- $WT(X)$ = the highest timestamps of any transaction $U$ that wrote $X$
- $C(X)$ = the commit bit: true when transaction with highest timestamp that wrote $X$ committed


If transactions abort, we must reset the timestamps



## Conflict Cases

for any $r_T(X)$ or $w_T(X)$ request, check for conflicts:
- $w_U(X) \dots r_T(X)$
- $r_U(X) \dots w_T(X)$
- $w_U(X) \dots w_T(X)$


when T requests $r_T(X)$, need to check $TS(U) \leq TS(T)$

![[readtoolate.png|476]]



## Simplified TS-based Schedule

Request is $r_T(X)$
	if $WT(X) > TS(T)$ then ROLLBACK
	else READ and update $RT(X)$ to larger of $TS(T)$ or $RT(X)$

Request is $w_T(X)$
	if $RT(X) > TS(T)$ then ROLLBACK
	else if $WT(X) > TS(T)$ ignore write & continue (Thomas write rule)
	otherwise WRITE and update $WT(X) = TS(T)$

The simplified timestamp-based scheduling with Thomas’ rule ensures that the schedule is view-serializable.



## Ensuring Recoverable Schedules

when a transaction $T$ requests $r_T(X)$ or $w_T(X)$, the scheduler examines $RT(X)$, $WT(X)$, $C(X)$, and decides one of:
- to grant the request, or
- to rollback $T$ (and restart with later timestamp)
- to delay T until $C(X)$ = true

The simplified timestamp-based scheduling with Thomas’ rule ensures that the schedule is view-serializable.


Request is $r_T(X)$
	if $WT(X) > TS(T)$ then ROLLBACK
	else if $C(X)$ = false, then WAIT
	else READ and update $RT(X)$ to larger of $TS(T)$ or $RT(X)$

Request is $w_T(X)$
	if $RT(X) > TS(T)$ then ROLLBACK
	else if $WT(X) > TS(T)$
		then if $C(X)$ = false then WAIT
			else IGNORE write (Thomas write rule)
	otherwise WRITE and update $WT(X) = TS(T)$, $C(X)$ = false



## Multiversion Timestamp

when transaction T requests $r(X)$, but $WT(X) > TS(T)$, then $T$ must rollback
idea: keep multiple versions of $X$: $X_t, X_{t-1}, X_{t-2}, \dots$


when $w_T(X)$ occurs,
	if the write is legal then
	create a new version, denoted $X_t$ where $t = TS(T)$

when $r_T(X)$ occurs,
	find most recent version $X_t$ such that $t \leq TS(T)$

can delete $X_t$ if we have a later version $X_{t1}$ and all active transactions $T$ have $TS(T) > t1$


![[multiversion1.png|529]]



## Concurrency control by validation

each transaction $T$ defines:
	read set $RS(T)$ = the elements it reads
	write set $WS(T)$ = the element it writes

each transaction $T$ has three phases:
	read phase; time = $START(T)$
	validation phase; time = $VAL(T)$
	write phase; time = $FIN(T)$


![[rtwuconflict.png|583]]


IF $RS(T) \cap WS(U)$ and $FIN(U) > START(T)$
	($U$ has validated and $U$ has not finished before $T$ begun)
Then $ROLLBACK(T)$



## Snapshot Isolation 

- A type of multiversion concurrency control algorithm
- Combines techniques:
	Timestamps
	Multiversion
	Validation

- Each transactions receives a timestamp $TS(T)$
- Transaction $T$ sees snapshot at time $TS(T)$ of the database
- W/W conflicts resolved by “first committer wins” rule
	- loser gets aborted
- R/W conflicts are ignored

Multiversion concurrency control:
	-versions of $X$: $X_{t1}, X_{t2}, X_{t3}, \dots$
When $T$ reads $X$, return $X_{TS(T)}$
When $T$ writes $X$ (to avoid lost update):
- if latest version of $X$ is $TS(T)$ then proceed
- else if $C(X) = true$ then abort
- else if $C(X) = false$ then wait
when $T$ commits, write its updates to disk


no dirty reads
- Start each snapshot with consistent state
No inconsistent reads
- Two reads by the same transaction will read same snapshot
No lost updates
