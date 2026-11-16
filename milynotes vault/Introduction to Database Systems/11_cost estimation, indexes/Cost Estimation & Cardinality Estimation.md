---
order: 33
---

## Cost estimation ideas and assumptions

Logical vs Physical Plans
- SQL is translated into RA
- RA (logical plan) does not fully describe execution
- RA with algorithms (physical plan) is needed

RDBMS optimize by selecting the least cost plan
- SQL $\rightarrow$ RA
- RA $\rightarrow$ Set of eq. RA
- Set of eq. RA $\rightarrow$ Set of physical plans
- Set of physical plans $\rightarrow$ The least cost plan (exec)

![[file-20261116030015306.png|565]]

Cost estimation is an active research topic
- equations and methods discussed in this class form a foundation of concepts, but usually cannot compare to a commercialized solution


#### Assumptions

Assumptions in this class:
- Disk-based storage
    - HDD not SSD
- Row-based storage
    - Tuples are stored contiguously
- HDD I/O cost (reading from disk) only considered
- Cold cache (no data preloaded)


#### Disk Storage

- Tables are stored as files
    - Heap file → Unsorted tuples
    - Sequential file → Sorted tuples
    - attribute(s) sorted on is called a key
- Smallest unit of memory that can be read at once is a block
- DBMS will attempt to store table files in contiguous chunks of memory on disk
- Sequential disk reads are faster than random ones


#### Making Cost Estimations

RDBMS keeps statistics about our tables
- B(R) = # of blocks in relation R
- T(R) = # of tuples in relation R
- V(attr, R) = # of distinct values of attr in R

In this class, we focus on computing T(Q), where Q is the output of some query



## Full cardinality estimates for a query

Estimate the number of tuples in the output of each RA operator
- without actually computing the output

Example statistics (id = primary key)
- Safeway(id, name, category, price)
    - T = 1000
    - V(name) = 900
    - V(category) = 10
    - V(price) = 200
    - Range(price) = [1, 50]
- QFC(id, name, category, price)
    - T = 2000
    - V(name) = 1900
    - V(category) = 12
    - V(price) = 500


#### Projection

$\pi_{name}$(Safeway)

```sql
SELECT name FROM Safeway
```

- ANSWER: 1000 (no change)
- projection: no change in tuples


#### Distinct & Aggregate

$\delta(\pi_{name}$(Safeway))

```sql
SELECT DISTINCT name FROM Safeway
```

- ANSWER: 900 (set to distinct values)

$\gamma_{category, AVG(price)}$(Safeway)

```sql
SELECT category, AVG(price) FROM Safeway GROUP BY category
```

- ANSWER: 10 (set to distinct values)
- distinct, aggregate: # distinct values


#### Point Selection

$\sigma_{id = 45}$(Safeway)

```sql
SELECT * FROM Safeway WHERE id = 45
```

- ASSUME: that '45' exists in the distinct values of id
    - answer is 0 otherwise
- ANSWER: 1

$\sigma_{name = 'Milk'}$(Safeway)

```sql
SELECT * FROM Safeway WHERE name = 'Milk'
```

- ASSUME: distinct values uniformly distributed
    - without assumptions, estimation is impossible
- ANSWER: 1000 / 900 ≈ 1.11 tuples

Select Value: $T(R) \cdot \frac{1}{V(R, attr)}$
- $\frac{1}{V(R, attr)}$ = the **selectivity factor**
- assume constants ('Milk') exist in the input
- assume uniform distribution


#### Range Selection

$\sigma_{price < 20}$(Safeway)

```sql
SELECT * FROM Safeway WHERE price < 20
```

- ASSUME: distinct values uniformly distributed & continuous
- ANSWER: 1000 * $\frac{20 – 1}{50 – 1}$ ≈ 387.8 tuples

Select Range: $T(R) \cdot \frac{value - min}{max - min}$
- $\frac{value - min}{max - min}$ = the **selectivity factor**
- assume price is continuous within its range


#### Cartesian Product

Safeway $\times$ QFC

```sql
SELECT * FROM Safeway S, QFC Q WHERE TRUE
```

- no selectivity factor
- ANSWER: 1000 * 2000 = 2000000 tuples

Cartesian Product: $T(R_1) \cdot T(R_2)$


#### Join

$A \bowtie_{A.z = B.z} B$

```sql
SELECT * FROM A, B WHERE A.z = B.z
```

1. T(A) * T(B) tuples in Cartesian product
2. Suppose $z_0$ exists in the join
3. How many times does $z_0$ occur?
    - like the selection condition $\sigma_{A.z = z_0 \land B.z = z_0}$
    - $\frac{T(A)}{V(A, z)} \cdot \frac{T(B)}{V(B, z)}$
4. How many distinct $z_0$s exist in the join?
    - ≥ 0 (if no overlap)
    - ≤ min{V(A, z), V(B, z)} (if full overlap)
    - for this class, ASSUME full overlap
        - as if one is a subset of the other (containment assumption)
5. Multiply by estimate # of distinct $z_0$s

$$T(A \bowtie B) = \frac{T(A)}{V(A, z)} \cdot \frac{T(B)}{V(B, z)} \cdot \min\{V(A, z), V(B, z)\} = \frac{T(A) \cdot T(B)}{\max\{V(A, z), V(B, z)\}}$$

- selectivity factor = $\frac{1}{V(A, z)} \cdot \frac{1}{V(B, z)}$

Join on id

```sql
SELECT * FROM Safeway S, QFC Q WHERE S.id = Q.id
```

- V(Safeway, id) = 1000, V(QFC, id) = 2000
- $\frac{1000 \cdot 2000}{\max\{1000, 2000\}}$ = 1000 tuples
- if we assume full overlap of ids between Safeway & QFC, then we only need keep the ids of the smaller (Safeway)

Join on name

```sql
SELECT * FROM Safeway S, QFC Q WHERE S.name = Q.name
```

- V(Safeway, name) = 900, V(QFC, name) = 1900
- $\frac{1000 \cdot 2000}{\max\{900, 1900\}}$ ≈ 1053 tuples
- if there are less distinct values (more repeats), then the join results in more tuples


#### Cardinality for Optimization

- Now we know how to estimate RA cardinality
- Optimization: find the equivalent RA Plan that minimizes operator cardinality
    - often we only care about the operator with largest cardinality (most "expensive")
    - "MinMax"
- Real RDBMS uses sophisticated cost models
    - I/O estimate in reads/writes
    - Compute estimate in FLOPS
    - Memory estimate in bytes
