---
order: 32
---

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

| Level            | When S is released          | How long others can't write what you read     |
| ---------------- | --------------------------- | --------------------------------------------- |
| READ UNCOMMITTED | never takes S               | never protected                               |
| READ COMMITTED   | right after the read        | only during that one read                     |
| REPEATABLE READ  | at commit                   | until txn is done                             |
| SERIALIZABLE     | at commit (+ predicate lock) | until txn is done + no new matching rows      |


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
