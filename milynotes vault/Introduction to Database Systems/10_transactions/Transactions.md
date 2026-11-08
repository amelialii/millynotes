---
order: 29
---

## Concurrency Anomalies

Dirty/Inconsistent Read
- reading another transaction's uncommitted write
	• Write-Read (WR) conflict

Unrepeatable Read
- happens when data is read prior to a change
	-  Read-Write (RW) conflict

Phantom Read
- happens when data is read prior to an addition/deletion
	• Read-Write (RW) conflict

lost update
- when a write "disappears"
	- A Write-write (WW) conflict


## Transactions & ACID

#### ACID

- Atomic
	- A transaction is atomic if everything works or nothing happens
- Consistent
	- Transaction start in a valid state and end in a valid state
- Isolated
	- behaves as if it were the only transaction running
	- The most important feature of ACID
- Durable
	- Crash recovery: committed changes survive crashes
		- What if the database fails in the middle of our atomic transaction?


## Schedules & Serializability

Transactions are sequence of element reads and/or writes
• $R_i(A) \space \rightarrow$ read element A
• $W_i(A) \space \rightarrow$ update element A

Schedules are a sequence of interleaved actions from all transactions

#### Serial Schedules

A **serial schedule** is a schedule where each transaction is executed in some order, one after the other

A **serializable schedule** is a schedule where transactions are executed with possible interleaving, but it appears to the outside as if they were executed in serial order


## Conflict Serializability

We define operation “conflicts” and check for their interactions in a schedule

Most application concurrency problems are describable by conflicts
- Lost Update $\rightarrow$ Write-Write (WW) conflict
- Dirty Read $\rightarrow$ Write-Read (WR) conflict
- Unrepeatable Read $\rightarrow$ Read-Write (RW) conflict
- Phantom Read

Types of Conflicts
- Intra-transaction conflicts
	- Operations within a transaction cannot be swapped
- Inter-transaction conflicts
	- WW conflicts $\rightarrow$ $W_1(X)$, $W_2(X)$
	- WR conflicts $\rightarrow$ $W_1(X)$, $R_2(X)$
	- RW conflicts $\rightarrow$ $R_1(X)$, $W_2(X)$


A schedule is **conflict serializable** if it can be transformed into a serial schedule by a series of swappings of adjacent non-conflicting actions

![[file-20261102111700596.png|598]]



## Precedence Graphs

Rules:
- one node per transaction
- draw an edge $T_i \rightarrow T_j$ whenever an action of $T_i$ conflicts with a later action of $T_j$
- no cycle $\rightarrow$ conflict-serializable. cycle $\rightarrow$ not conflict-serializable

Faster way:
instead of comparing every pair, list each element's actions in order. Then look for cross-transaction pairs where at least one is a write


## Locks &  2PL

scheduler
- optimistic: execute first, check later
	- cheap overhead, expensive aborts $\rightarrow$ good for low retention
- pessimistic (locking): prevent conflicts up front
	- expensive overhead, cheap aborts $\rightarrow$ good for high retention
	- use in class

binary locks
- $L_i(X) \rightarrow$ txn i locks X (required before R or W on X)
- $U_i(X) \rightarrow$ txn i unlocks X
- if another txn holds the lock $\rightarrow$ wait (“blocking”)
- lock granularity depends on the DBMS
    - SQLite $\rightarrow$ whole database only
    - MySQL, SQL Server, Oracle $\rightarrow$ row or table

#### 2-Phase Locking

rule: in every txn, all lock requests come before all unlock requests
- growing phase (only lock) $\rightarrow$ shrinking phase (only unlock)

2PL guarantees conflict serializability
each txn acts as if it ran all at once at the moment it starts unlocking

#### Deadlocks

a side effect of 2PL: txns hold locks while waiting for more

```
T1 (A,B): L(A) ... L(B) blocked   (T2 has B)
T2 (B,C): L(B) ... L(C) blocked   (T3 has C)
T3 (C,D): L(C) ... L(D) blocked   (T4 has D)
T4 (D,A): L(D) ... L(A) blocked   (T1 has A)
```

the DBMS builds a waits-for graph, and a cycle means deadlock


## Strict 2PL & Recoverability


- Every isolation level uses strict 2PL X locks for writes
- The only thing that changes between levels is how long read locks are held
- Less read locking → faster, but more anomalies possible
- Set it with:
```sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
```
- Default level depends on the DBMS

#### Summary (fast → correct)
| Level            | Read locks                                | Dirty read | Unrepeatable read | Phantom   |
| ---------------- | ----------------------------------------- | ---------- | ----------------- | --------- |
| READ UNCOMMITTED | none                                      | possible   | possible          | possible  |
| READ COMMITTED   | short: lock → read → unlock right away    | prevented  | possible          | possible  |
| REPEATABLE READ  | held until commit (strict 2PL)            | prevented  | prevented         | possible  |
| SERIALIZABLE     | held until commit + table/predicate locks | prevented  | prevented         | prevented |

#### READ UNCOMMITTED

- Reads: no locks
- Problem: dirty reads, since you can read a write that hasn't committed
- Fastest level
- Use case: static data, or reads where accuracy isn't critical

#### READ COMMITTED

- Reads: short S locks (acquire, read, release immediately)
- Fixes dirty reads: S must wait for X, and X is held until commit, so you only see committed data
- Problem: unrepeatable reads, since S is released before the txn ends
- Use case: e-commerce ("only 2 left in stock" was true when you read it, but may change)

#### REPEATABLE READ

- Reads: S locks held until commit (strict 2PL)
- Fixes unrepeatable reads: no one can write what you've read until you're done
- This is full strict 2PL → conflict serializable
- Problem: phantoms are still possible