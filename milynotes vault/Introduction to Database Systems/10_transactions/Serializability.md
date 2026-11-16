---
order: 30
---

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
