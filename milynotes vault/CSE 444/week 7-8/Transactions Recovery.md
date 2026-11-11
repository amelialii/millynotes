---
order: 10
---

## Transaction Management

Two parts:
- [[Concurrency Control|Concurrency control]]: [[Concurrency Control#ACID Properties|ACID]]
- Recovery from crashes: ACID


| Type of Crash               | Prevention                     |
| --------------------------- | ------------------------------ |
| Wrong data entry            | Constraints and data cleaning  |
| Disk crashes                | Redundancy: e.g. RAID, archive |
| Data center failures        | Remote backups or [[Replication\|replicas]]     |
| System failures: e.g. power | DATABASE RECOVERY              |


Each [[Concurrency Control#Transaction|transaction]] has internal state
When system crashes, internal state is lost
- Don’t know which parts executed and which didn’t
- Need ability to undo and redo


### Primitive Operations of Transactions

$READ(X,t)$
- copy element $X$ to transaction local variable $t$
$WRITE(X,t)$
- copy transaction local variable $t$ to element $X$
$INPUT(X)$
- read element $X$ to memory buffer
$OUTPUT(X)$
- write element $X$ to disk


### Atomic Transactions

FORCE or NO-FORCE
- Should all updates of a transaction be forced to disk before the transaction commits?
- FORCE: Pages of committed transactions must be forced to disk before commit
- NO-FORCE: Pages of committed transactions need not be written to disk

STEAL or NO-STEAL
- Can an update made by an uncommitted transaction overwrite the most recent committed value of a data item on disk?
- STEAL: Pages of uncommitted transactions may be written to disk
- NO-STEAL: Pages of uncommitted transactions cannot be written to disk


Write-Ahead Log (WAL)
The Log: append-only file containing log records
- Records every single action of every TXN 
- Forces log entries to disk as needed
- After a system crash, use log to recover
Three types: UNDO, REDO, UNDO-REDO
Aries: is an UNDO-REDO log


![[policiesandlogs.png]]



## UNDO Logging

Log records
- `<START T>`
	- transaction T has begun
- `<COMMIT T>`
	- T has committed
- `<ABORT T>`
	- T has aborted
- `<T, X, v>`
	- T has updated element X, and its old value was v
	- Idempotent, physical log records


![[undo.png|409]]


after crash
- if we see no commit statement
	- we UNDO both changes: $A = 8$, $B = 8$
	- the transaction is atomic, since none of its actions have been executed
- In we see that $T$ has a commit statement
	- we don't undo anything
	- the transaction is atomic, since both its actions have been executed


Undo-Logging Rules
- U1: if T modifies X, then `<T, X, v>` must be written to disk before OUTPUT(X)
- U2: if T commits, then OUTPUT(X) must be written to disk before `<COMMIT T>`
- OUTPUTs are done early, before the transaction commits



## Checkpointing

checkpoint the database periodically
- stop accepting new transactions
- wait until all current transactions complete
- flush log to disk
- write a `<CKPT>` log record, flush
- resume transactions


### Nonquiescent Checkpointing

- Write a `<START CKPT(T1,…,Tk)>` where T1,…,Tk are all active transactions. Flush log to disk
- Continue normal operation
- When all of T1,…,Tk have completed, write `<END CKPT>`, flush log to disk

![[checkpoint.png|583]]



## Implementing ROLLBACK

use the undo-log to implement [[Concurrency Control#ROLLBACK|ROLLBACK]]

- LSN = Log Sequence Number
- Log entries for the same transaction are linked, using the LSN’s
- Read log in reverse, using LSN pointers



## REDO 

NO-FORCE + NO-STEAL

One minor change to the undo log:
- `<T,X,v> = T` has updated element $X$, and its new value is $v$


After a crash:
1. Decide which transactions committed
2. Read the log from the **beginning**
3. Redo all updates from committed transactions



## ARIES

real-world-style protocol that combines UNDO and REDO.
supports STEAL + NO-FORCE


### ARIES log records

`<T,X,u,v>`

- $T$ is the transaction
- $X$ is the updated item/page
- $u$ is the old value
- $v$ is the new value


### LSN

- LSN = identifier of a log entry
	- Log entries belonging to the same TXN are linked with

- Each page contains a pageLSN
	- LSN of log record for latest update to that page


### ARIES data structures

Active Transactions Table
- Lists all active TXN’s
- For each TXN: lastLSN = its most recent update LSN

 Dirty Page Table
 - Lists all dirty pages
 - For each dirty page: recoveryLSN (recLSN)= first LSN that caused page to become dirty

Write Ahead Log
- LSN, prevLSN = previous LSN for same txn


### Normal operation in ARIES

1. Write a log record `<T, P, u, v>`
2. Set pageLSN = LSN
3. Set prevLSN = lastLSN
4. Update transaction table lastLSN = LSN
5. If page $P$ just became dirty, set recLSN = LSN


When [[Storage#Buffer Manager|buffer manager]] wants to output page $P$
Before writing the page to disk:
1. Flush the log up to `pageLSN`
2. Remove $P$ from the Dirty Page Table


When transaction $T$ commits
ARIES does:
1. Write `<COMMIT T>`
2. Flush the log up to that commit record
3. Write `<END>`
4. Remove `T` from the Active Transactions Table


### ARIES checkpoints

An ARIES checkpoint writes into the log:
1. The whole Active Transactions Table
2. The whole Dirty Page Table


### The 3 ARIES recovery phases

#### Analysis

Goal: Reconstruct what the system looked like at the time of crash

analysis determines:
1. Where REDO should start
2. Which pages were dirty at crash time
3. Which transactions were active at crash time

rebuilds:
- Active Transactions Table
- Dirty Page Table

At the end, ARIES computes `firstLSN = min⁡(recLSN)`


#### Redo

Repeat history
- process log forward starting from `firstLSN = min⁡(recLSN)`
- read every log record, sequentially
- redo actions are not recorded in the log
- needs the Dirty Page Table

for each log entry record
- if P not in Dirty page then no update
- if recLSN > LSN, then no update
- read page from disk:
	if pageLSN $\ge$  LSN, then no update
- otherwise perform update


#### Undo

main principle: "logical" undo
- start from end of log, move backwards
- read only affected log entries


while ToUndo not empty:
- choose most recent (largest) lSN in ToUndo
- if LSN = regular record `<T, P, u, v>`
	- write a CLR where CLR.undoNextLSN = LSN.prevLSN
	- undo $v$
- if LSN = CLR record
	- don't undo
- if CLR.undoNextLSN not null, insert in ToUndo
	otherwise, write `<END>` in log


