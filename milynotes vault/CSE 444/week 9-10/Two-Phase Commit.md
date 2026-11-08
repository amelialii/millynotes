---
order: 14
---

OLTP: [[Concurrency Control#Transaction|Transactions]] per second
	“Online Transaction Processing



Transaction Scaling Challenges
- Distribution
- [[Replication]]


2PC Outline
- Phase 1: coordinator polls the subordinators whether they want to commit or abort
- Phase 2: coordinator notifies all subordinators of the decision commit or abort



Coordinator State Machine
- All states involve waiting for messages

![[CoordinatorStateMachine.png|302]]




Subordinate State Machine
- INIT and PREPARED involve waiting

![[SubordinateStateMachine.png|350]]


## Handling Site Failures

What to do if there is no response
- Approach 1: no site failure detection
	- Subordinate can only do retrying & blocking
- Approach 2: timeouts, since unilateral abort is ok 
	- Subordinate: init state: can timeout; prepared state is still blocking
	- Coordinator: collecting state can timeout committing state is blocking


A subordinate fails. During [[Transactions Recovery|recovery]]:
- If the last entry in the log is then the transaction is committed: [[Transactions Recovery#REDO|REDO]]
- If the last entry in the log is then the transaction is aborted: [[Transactions Recovery#UNDO Logging|UNDO]]
- If no COMMIT/ABORT/PREPARE is found, then presume ABORT
- If the last entry is then it’s hard: must re-contact coordinator to find out whether ABORT or COMMIT
