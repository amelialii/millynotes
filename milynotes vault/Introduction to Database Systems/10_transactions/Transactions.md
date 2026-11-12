---
order: 29
---

## Concurrency Anomalies

Dirty/Inconsistent Read
- reading another transaction's uncommitted write
    - Write-Read (WR) conflict

Unrepeatable Read
- read the same element twice, get different values (someone changed it in between)
    - Read-Write (RW) conflict

Lost Update
- when a write "disappears" (overwritten by another txn)
    - Write-Write (WW) conflict

[[Concurrency Control#Phantom Problem|Phantom Read]]
- same query returns new rows (someone inserted/deleted in between)
    - not a conflict on an existing element → conflict model can't capture it


## Transactions & ACID

#### ACID
- Atomic
    - all or nothing: everything in the txn happens, or none of it
- Consistent
    - txn starts in a valid state and ends in a valid state (constraints hold)
- Isolated
    - behaves as if it were the only txn running
    - the most important feature of ACID
- Durable
    - committed changes survive crashes ([[Transactions Recovery|recovery]])

Not every DB guarantees full ACID by default (e.g. isolation level is configurable)



## Schedules & Serializability

Transactions are sequences of element reads and/or writes

- $R_i(A) \space \rightarrow$ txn i reads element A
- $W_i(A) \space \rightarrow$ txn i writes element A

Schedules are a sequence of interleaved actions from all transactions


#### Serial Schedules

**Serial schedule**: each txn executes one after another, no interleaving
**[[Concurrency Control#Serializability|Serializable]] schedule**: interleaved, but behaves the same as some serial schedule



## Conflict Serializability

Most application concurrency problems are describable by conflicts

Types of Conflicts

- Intra-transaction: any two ops in the same txn → can never be swapped
- Inter-transaction: same element, at least one is a write
    - WW → $W_1(X)$, $W_2(X)$
    - WR → $W_1(X)$, $R_2(X)$
    - RW → $R_1(X)$, $W_2(X)$
    - (RR never conflicts)

A schedule is **[[Concurrency Control#Conflict Serializability|conflict serializable]]** if it can be turned into a serial schedule by swapping adjacent non-conflicting actions

conflict serializable → serializable (but not the other way)

- only holds for a static database (no inserts/deletes)

![[file-20261102111700596.png|598]]



## Precedence Graphs

Rules:

- one node per txn
- edge $T_i \rightarrow T_j$ when an action of $T_i$ conflicts with a later action of $T_j$
- no cycle → conflict serializable, cycle → not
- serial order = follow the arrows

Faster way: list each element's actions in order, look for cross-txn pairs where at least one is a write



## Locks & 2PL

Scheduler approaches

- optimistic: execute first, check at commit, abort if conflict
    - cheap overhead, expensive aborts → good for low contention
- pessimistic (locking): prevent conflicts up front
    - expensive overhead, fewer aborts → good for high contention
    - used in class


#### Binary Locks

- $L_i(X)$ → txn i locks X (required before R or W on X)
- $U_i(X)$ → txn i unlocks X
- if another txn holds the lock → wait ("blocking")
- default in problems: get lock right before first use of the element


#### S/X Locks

- reads don't conflict with each other → split the lock into two
- Shared/Read lock $S_i(X)$: shared control, may exist with other S locks
- Exclusive/Write lock $X_i(X)$: full control, no other locks may exist
- only S + S is compatible
- txn upgrades S → X when it writes something it read


#### Lock Granularity

- database → table → predicate → tuple (less → more concurrency)
- SQLite → whole database only
- MySQL, SQL Server, Oracle → row or table


#### 2-Phase Locking

rule: in every txn, all lock requests come before all unlock requests
- growing phase (only lock) → shrinking phase (only unlock)

[[Concurrency Control#Two Phase Locking (2PL)|2PL]] guarantees conflict serializability
- each txn acts as if it ran all at once at the moment it starts unlocking
- problem: txn can unlock before commit → others can read its uncommitted writes (dirty read)

#### Deadlocks

side effect of 2PL: txns hold locks while waiting for more

```
T1 (A,B): L(A) ... L(B) blocked   (T2 has B)
T2 (B,C): L(B) ... L(C) blocked   (T3 has C)
T3 (C,D): L(C) ... L(D) blocked   (T4 has D)
T4 (D,A): L(D) ... L(A) blocked   (T1 has A)
```

DBMS builds a waits-for graph, cycle = [[Concurrency Control#2PL Deadlocks|deadlock]] → abort one txn



## Strict 2PL & Recoverability

#### Strict 2PL

- every lock held until commit/rollback
- ensures conflict serializability
- also **recoverable**: txn doesn't affect others until commit/rollback (no dirty reads)
- can still deadlock

Recoverable: a txn only commits after every txn it read from has committed

strict 2PL $\subset$ 2PL $\subset$ conflict serializable $\subset$ serializable



## Isolation Levels

- Write locks → always strict 2PL X locks
    - read mistakes are temporary, write mistakes are forever
- Read locks → can be relaxed
- less read locking → faster, but more anomalies
- set with:

```sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

- default depends on DBMS, serializable is often not the default


#### Summary (fast → correct)

| Level            | Read locks                                | Dirty read | Unrepeatable read | Phantom   |
| ---------------- | ----------------------------------------- | ---------- | ----------------- | --------- |
| READ UNCOMMITTED | none                                      | possible   | possible          | possible  |
| READ COMMITTED   | short: lock → read → unlock right away    | prevented  | possible          | possible  |
| REPEATABLE READ  | held until commit (strict 2PL)            | prevented  | prevented         | possible  |
| SERIALIZABLE     | held until commit + table/predicate locks | prevented  | prevented         | prevented |


#### READ UNCOMMITTED

- Reads: no locks
- Problem: dirty reads
- fastest
- use case: static data, or reads where accuracy isn't critical


#### READ COMMITTED

- Reads: short S locks (acquire, read, release right away)
- fixes dirty reads: S waits for X, X held until commit → only see committed data
- Problem: unrepeatable reads, since S is released before txn ends
- use case: e-commerce (info was true when you read it, may change after)


#### REPEATABLE READ

- Reads: S locks held until commit (strict 2PL)
- fixes unrepeatable reads: no one can get X on what you read until you're done
- = strict 2PL with S/X → conflict serializable
- Problem: phantoms, since locks only cover rows that already exist


#### SERIALIZABLE

- Reads: strict 2PL + predicate locks and/or table locks
- fixes phantoms:
    - table lock → block all inserts into the table
    - predicate lock → lock the query condition (e.g. price < 10), block anything that would change the query's output
- slowest, rarely used in production
