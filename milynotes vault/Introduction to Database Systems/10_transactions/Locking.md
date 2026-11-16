---
order: 31
---

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
