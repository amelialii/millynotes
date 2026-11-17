---
order: 34
---

## Making Cost Estimations


#### Statistics

- RDBMS keeps statistics about our tables
    - B(R) = # of blocks in relation R
    - T(R) = # of tuples in relation R
    - V(attr, R) = # of distinct values of attr in R
- In this class, we focus on computing T(Q), where Q is the output of some query
- Estimate the number of tuples in the output of each RA operator (without actually computing the output)

Example:
- Safeway(id, name, category, price)
    - T = 1000
    - V(name) = 900
    - V(category) = 10
    - V(price) = 200
    - Range(price) = [1, 50)
- QFC(id, name, category, price)
    - T = 2000
    - V(name) = 1900
    - V(category) = 12
    - V(price) = 500


#### SELECT, DISTINCT, AGGREGATE

$\pi_{name}$(Safeway)

```sql
SELECT name FROM Safeway
```

- ANSWER: 1000 (no change)

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


#### Selectivity Factor

- T(R) = # tuples, V(R, attr) = # distinct vals
- The amount of data an operator reads depends on the amount that's output by a previous operator
    - we can estimate the amount of data this operator will read
- The **selectivity factor** $\Theta$ is an operator's size decrease or increase
- Specifically:
    - $T(\sigma_{pred}(R)) = \Theta_{pred} \cdot T(R)$
    - $T(R \bowtie_{pred} S) = \Theta_{pred} \cdot T(R) \cdot T(S)$


#### Assumptions for This Course

1. Uniformity
2. Independence
3. Containment of values
4. Preservation of values



## Selection

#### 1) Uniformity Assumption

- Assume: values in R are uniformly distributed
- Thus:
    - $\Theta$ of equality selection $\sigma_{a = x}$ is $\frac{1}{V(R, a)}$
    - $\Theta$ of range selection $\sigma_{a < c}$ is $\frac{c - min_a}{1 + max_a - min_a}$
    - $\Theta$ of range selection $\sigma_{c_1 \le a < c_2}$ is $\frac{c_2 - c_1}{1 + max_a - min_a}$
    - we need to force the denominator's range to go "past the end of R", in order to match our [inclusive, exclusive) numerator

WHERE Value: $\sigma_{id = 45}$(Safeway)

```sql
SELECT * FROM Safeway WHERE id = 45
```

- ASSUME: that '45' exists in the distinct values of id
    - answer is 0 otherwise
- ANSWER: 1

WHERE Value: $\sigma_{name = 'Milk'}$(Safeway)

```sql
SELECT * FROM Safeway WHERE name = 'Milk'
```

- ASSUME: distinct values uniformly distributed
    - without assumptions, estimation is impossible
- ANSWER: 1000 / 900 ≈ 1.11 tuples
    - $\frac{1}{900}$ = the selectivity factor

WHERE Range: $\sigma_{price < 20}$(Safeway)

```sql
SELECT * FROM Safeway WHERE price < 20
```

- ASSUME: distinct values uniformly distributed & continuous
    - without assumptions, estimation is impossible
- ANSWER: 1000 * (20 – 1) / (50 – 1) ≈ 387.8 tuples
    - $\frac{20 - 1}{50 - 1}$ = the selectivity factor


#### 2) Independence Assumption

- Assume: values in R.a and R.b are independent
    - ie, there's no FD between R.a and R.b
- Thus:
    - $\Theta$ of conjunction $\sigma_{a = x \land b = y}$ is $\Theta_{a = x} \cdot \Theta_{b = y}$
    - and if we assume uniformity, then $\Theta_{a = x} \cdot \Theta_{b = y} = \frac{1}{V(R, a)} \cdot \frac{1}{V(R, b)}$

WHERE Value: $\sigma_{name = 'Milk' \land price = 5}$(Safeway)

```sql
SELECT * FROM Safeway WHERE name = 'Milk' AND price = 5
```

- ASSUME: uniformity & independence
- ANSWER: 1000 * $\frac{1}{900}$ * $\frac{1}{200}$ ≈ 0.01 tuples
    - $\frac{1}{900} \cdot \frac{1}{200}$ = the selectivity factor



## Join

#### Cartesian Product

Safeway S $\times$ QFC Q

```sql
SELECT * FROM Safeway S, QFC Q
```

- ANSWER: 1000 * 2000 = 2000000 tuples
- no selectivity factor


#### 3) Containment Assumption

- Assume: when V(R, a) ≤ V(S, b), then the set of a values in R is included in the set of b values in S
- This assumption most commonly applies when b is S's PK, and a is a FK in R

Special case: we have a PK/FK relationship
- Consider the FK join $R \bowtie_{R.fk = S.pk} S$ where pk is S's PK, and fk is the FK in R
- Hence $T(R \bowtie_{A = B} S) = T(R) \cdot T(S) / V(S, B)$
- A tuple t in R joins with exactly 1 tuple in S
- So $T(R \bowtie_{R.fk = S.pk} S) = T(R)$


#### JOIN

$A \bowtie_{A.z = B.z} B$

```sql
SELECT * FROM A, B WHERE A.z = B.z
```

1. T(A) * T(B) tuples in Cartesian product
2. Suppose $z_0$ exists in the join
3. How many times does $z_0$ occur?
    - like the selection condition $\sigma_{A.z = z_0 \land B.z = z_0}$
4. How many distinct $z_0$s exist in the join?
    - ≥ 0 [if no overlap]
    - ≤ min{V(A, z), V(B, z)} [if full overlap]
    - for this class, ASSUME full overlap
    - as if one is a subset of the other (containment assumption)
5. Multiply by estimate # of distinct $z_0$s

$$T(A \bowtie B) = \frac{T(A)}{V(A, z)} \cdot \frac{T(B)}{V(B, z)} \cdot \min\{V(A, z), V(B, z)\} = \frac{T(A) \cdot T(B)}{\max\{V(A, z), V(B, z)\}}$$

- Selectivity Factor = $\frac{1}{V(A, z)} \cdot \frac{1}{V(B, z)}$

JOIN on id

```sql
SELECT * FROM Safeway S, QFC Q WHERE S.id = Q.id
```

- T = 1000, V(id) = 1000 for Safeway; T = 2000, V(id) = 2000 for QFC
- $\frac{1000 \cdot 2000}{\max\{1000, 2000\}}$ = 1000 tuples
- Right... if we assume full overlap of ids between Safeway & QFC, then we only need keep the ids of the smaller (Safeway)

JOIN on name

```sql
SELECT * FROM Safeway S, QFC Q WHERE S.name = Q.name
```

- T = 1000, V(name) = 900 for Safeway; T = 2000, V(name) = 1900 for QFC
- $\frac{1000 \cdot 2000}{\max\{900, 1900\}}$ ≈ 1053 tuples
- Right... if there are less distinct values (more repeats), then the join results in more tuples


#### 4) Preservation Assumption

- Assume: c is an attribute in R (not the join attribute)
- Then $V(R \bowtie_{R.a = S.b} S, c) = V(R, c)$
- This allows us to reuse what we know about c further up in the plan
    - e.g. V(output, name) = V(Payroll, name) for Payroll p $\bowtie_{p.username = r.username}$ Registry r
- Important for joins


#### Example #1

Suppliers(sid, name, city, state)
Supplies(sid, pid, quantity)

```sql
SELECT x.sid, y.pid, y.quantity
FROM Suppliers x, Supplies y
WHERE x.sid = y.sid
  AND x.city = 'Seattle' AND x.state = 'WA' AND y.pid = 5
```

- T(Suppliers) = 1000, V(Suppliers, city) = 20, V(Suppliers, state) = 10
- T(Supplies) = 10000, V(Supplies, pid) = 2500
- Supplies has a FK into Suppliers, so V(Supplies, sid) ≤ V(Suppliers, sid)
- Join: T = 10000
    - equijoin on sid, and Supplies uses a FK into Suppliers, so $T(x \bowtie_{x.sid = y.sid} y) = T(Supplies)$
- Selection: T < 1
    - preservation assumption: city, state, pid keep their V through the join
    - 10000 * $\frac{1}{20}$ * $\frac{1}{10}$ * $\frac{1}{2500}$ = 0.02


#### Example #2

Same query as Example #1, but with the filters **pushed down** below the join

- $\sigma_{city \land state}$(Suppliers): 1000 * $\frac{1}{20}$ * $\frac{1}{10}$ = 5
- $\sigma_{pid = 5}$(Supplies): 10000 * $\frac{1}{2500}$ = 4
- Join: T = 4
    - equijoin on sid, and Supplies uses a FK into Suppliers (containment), so T = T(filtered Supplies)
- Projection: T = 4


#### Comparing Plans

- Example #1 (filter after join) estimates T < 1, Example #2 (filter before join) estimates T = 4
    - same query, different estimates: cardinality estimation produces ESTIMATES, not exact answers
- But estimates can still be used to compare trees
    - Example #2's intermediate results are tiny (5, 4, 4) vs Example #1's join of 10000
    - so the pushdown plan is probably more efficient