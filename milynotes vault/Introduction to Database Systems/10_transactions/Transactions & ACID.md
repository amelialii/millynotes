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
