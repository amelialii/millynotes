---
order: 7
---

![[optimizationoverview.png|502]]


three components:
- [[Query plan costs|cost/cardinality estimation]]
- search space
	- algebraic laws
	- restricting the query plans
- search algorithm


input: a logical query plan
output: a good [[DBMS architecture#Physical Query Plan|physical query plan]]
best query optimization algorithm
- enumerate alternative plans (logical and physical)
- compute estimate cost of each plan
	- compute number of I/Os
	- optionally take into account other resources
- choose plan with the lowest cost
- called cost-based optimization



## Types of Join Trees

Bushy
![[bushy.png|302]]

Linear (zig-zag)
![[linear.png|196]]

Right deep
![[rightdeep.png|317]]

Left deep
![[leftdeep.png|325]]



## key decisions for implementation

search space
optimization rules
- algebraic laws when implemented in the optimizer
optimization algorithm

more rules $\rightarrow$ large search space $\rightarrow$ better plan
less rules $\rightarrow$ faster optimization $\rightarrow$ less good plan



## Algebraic Laws (Optimization Rules)

### laws involving selection

$\sigma_{C \land C'}(R) = \sigma_C(\sigma_{C'}(R)) = \sigma_C(R) \cap \sigma_{C'}(R)$
$\sigma_{C \lor C'}(R) = \sigma_C(R) \cup \sigma_{C'}(R)$
$\sigma_C(R \bowtie S) = \sigma_C(R) \bowtie S$

$\sigma_C(R - S) = \sigma_C(R) - S$
$\sigma_C(R \cup S) = \sigma_C(R) \cup \sigma_C(S)$
$\sigma_C(R \bowtie S) = \sigma_C(R) \bowtie S$


### laws involving projections

$\Pi_M(R \bowtie S) = \Pi_M(\Pi_P(R) \bowtie \Pi_Q(S))$
$\Pi_M(\Pi_N(R)) = \Pi_M(R)$ where $M \subseteq N$


### laws for grouping and aggregation

$\gamma_{A,\, \text{agg}(D)}\bigl(R(A,B) \bowtie_{B=C} S(C,D)\bigr) = \gamma_{A,\, \text{agg}(D)}\bigl(R(A,B) \bowtie_{B=C} \gamma_{C,\, \text{agg}(D)} S(C,D)\bigr)$



## Two types of optimizers

rule-based (heuristic optimizers)
- apply greedily rules that always improve the plan

cost-based optimizers
- use a cost model to estimate the cost of each plan
- select the "cheapest" plan



## three approaches to search trees

- complete plans
- bottom-up plans
- top-down plans


### complete plans

enumerate every full plan and cost it. inefficient because there's no way to prune early


### bottom-up plans

build up from base relations

![[bottomup.png|542]]


### top-down plans

start from the full query, break it into subqueries

![[topdown.png|544]]



## Search Algorithm

### Dynamic Programming

only handles single block queries

```
SELECT list
FROM R1, …, Rn
WHERE cond1 AND cond2 AND . . . AND cond
```


```
| Subset       | Size of result (T) | Best plan | Cost of best plan |
|--------------|--------------------|-----------|-------------------|
| {R}          | ...                | ...       | ...               |
| {S}          | ...                | ...       | ...               |
| {R, S}       | ...                | ...       | ...               |
| {R, S, T}    | ...                | ...       | ...               |
| {R, S, T, U} | ← final answer     |           |                   |
```


for each subquery $Q \subseteq \{R_1, \dots, R_n\}$ compute the following:
- $T(Q)$ = the estimated size of Q
- $plan(Q)$ = a best plan for Q
- $cost(Q)$ = the estimated cost of that plan

step 1: for each $\{R_i\}$ do:
- $T(\{R_i\}) = T(R_i)$
- $plan(\{R_i\})$ = access method for $R_i$
- $cost(\{R_i\})$ = cost of access method for $R_i$

For each individual table by itself, there's no join to figure out. The "plan" is just: how do I read this table from disk?
For table $R$, the answer might be "do a table scan" or "use an [[Indexing|index]]." Pick the cheapest access method. That's the plan. Its cost is whatever that access method costs. Its size $T(R)$ is just the size of $R$.


step 2: for each $Q \subseteq \{R_1, \dots, R_n\}$ of size $k$ do:
- $T(Q)$ = use estimator
- consider all partitions $Q = Q' \cup Q''$ compute $cost(plan(Q') \bowtie plan(Q''))$
- $cost(Q)$ = the smallest such cost
- $plan(Q)$ = the corresponding plan

Now do subsets of size 2, then size 3, then size 4, growing each round.
For each subset Q, ask: what's the best way to compute Q?

step 3: return $plan(\{R_1, \dots, R_n\})$

![[dp.png|440]]



- for the subset $\{RS\}$, need to consider both $R \bowtie S$ and $S \bowtie R$
	- the cost may be different


#### complexity

for $n$ relations:
- DP table size: $2^n - 1$ entries
- plans consider per entry of size $k$: $2^k - 2$



## Two Common Heuristics to Shrink the Search Space Further

restrict to left-deep trees

Avoid Cartesian products



## Selinger Algorithm

Selinger enumeration algorithm considers
- Different logical and physical plans at the same time
- Cost of a plan is IO + CPU
- Concept of interesting order during plan enumeration
	- A sorted order as that requested by ORDER BY or GROUP GY
	- Or order on attributes that appear in equi-join predicates
		- Because they may enable cheaper [[Query execution and operator algorithms#Sort-merge join|sort-merge joins]] later


### Key Ideas

**1. Left-Deep Plans Only**
Rather than considering all tree shapes, Selinger restricts to _left-deep_ trees like `(((A⋈B)⋈C)⋈D)`. This is efficient because:
- It fits naturally with [[Query execution and operator algorithms#Nested loop join|nested-loop]] and one-pass joins
- The outer (left) relation stays in memory; the inner (right) relation is read from disk
- For index joins, you can always put the indexed relation on the right (inner) side

**2. Interesting Orders**
Some operators naturally produce sorted output (e.g., index scans, merge-joins). If a downstream join can exploit that sorted order (e.g., for a sort-merge join), it's worth tracking even if it's not the cheapest plan in isolation. The algorithm keeps the cheapest plan _per interesting order_, not just one global cheapest plan. This adds complexity by a factor of $k+1$ where $k$ = number of interesting orders.

**3. Dynamic Programming**
Instead of re-evaluating the same subsets repeatedly, Selinger caches results. The algorithm builds up from single relations → pairs → triples → etc.:
- **Step 1:** For each single relation, find the cheapest access path (file scan or index scan) for each interesting order
- **Step 2:** For each pair of relations, try each as outer + inner in a nested-loop or sort-merge join, using cached Step 1 results
- **Step 3+:** Repeat, adding one relation at a time, always referencing cached subplan costs

**4. Other pruning rules:**
- Push selections down as early as possible
- Never consider Cartesian products (joins without predicates



## DP Algorithm (Pseudocode)

```
For d = 1 to N:
	For each size-d subset S of relations:
		optJoin(S) = best of: (S – a) ⋈ a, for each a in S
		where cost = cost(optJoin(S–a)) + join cost + access cost for a
```