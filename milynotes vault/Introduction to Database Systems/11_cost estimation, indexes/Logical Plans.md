---
order: 33
---

## RA to RA

Rewrite rules for turning one RA plan into an equivalent one

#### WHERE & SELECT

WHERE: Idempotency
- $\sigma_c(\sigma_c(R)) = \sigma_c(R)$

SELECT: Idempotency
- $\pi_A(\pi_{A,B}(R)) = \pi_A(R)$

WHERE-AND: Commutativity
- $\sigma_{c \land d}(R) = \sigma_c(\sigma_d(R)) = \sigma_d(\sigma_c(R))$

WHERE-OR
- $\sigma_{c \lor d}(R) = \sigma_c(R) \cup \sigma_d(R)$
- watch out for duplicates (set union)

SELECT-WHERE: ***Conditional*** Commutativity
- $\pi_A(\sigma_c(R)) = \sigma_c(\pi_A(R))$
- \* if c only references attributes in A

WHERE-HAVING: ***Conditional*** Commutativity
- $\sigma_c(\gamma_{G,a}(A)) = \gamma_{G,a}(\sigma_c(A))$
- \* if c only references attributes in G


#### WHERE, JOIN & UNION

WHERE-JOIN: Distributive
- $\sigma_{c \land d}(R \times S) = \sigma_c(R) \times \sigma_d(S)$
- (c only references R, d only references S)

WHERE-UNION: Distributive
- $\sigma_c(R \cup S) = \sigma_c(R) \cup \sigma_c(S)$
- $\sigma_c(R \cap S) = \sigma_c(R) \cap \sigma_c(S)$
- $\sigma_c(R \setminus S) = \sigma_c(R) \setminus \sigma_c(S)$

JOIN-UNION: Distributive
- $R_1 \times (R_2 \cup R_3) = (R_1 \times R_2) \cup (R_1 \times R_3)$
- same for INTERSECT, EXCEPT


#### Join Ordering

CROSS PRODUCT Ordering: Commutative + Associative
- any subtree order works

INNER JOIN Ordering
- cross product is associative and commutative so we can shuffle however we want
- push filters back down to recover inner join logic



## Example Optimizations

Suppliers(sid, name, city, state)
Supplies(sid, pid, quantity)
Parts(pid, name, price)


#### Example Optimization #1

```sql
SELECT X.sid, Y.pid, Y.quantity
FROM Suppliers X, Supplies Y
WHERE X.sid = Y.sid AND X.city = 'Seattle' AND X.state = 'WA'
```

- push $\sigma_{X.city = 'Seattle' \land X.state = 'WA'}$ down below the join, onto Suppliers X


#### Example Optimization #2

```sql
SELECT X.sid, Y.pid, Y.quantity
FROM Suppliers X, Supplies Y
WHERE X.sid = Y.sid AND X.city = 'Seattle' AND Y.pid = 5
```

- split the condition and push each part down
    - $\sigma_{X.city = 'Seattle'}$ onto Suppliers X
    - $\sigma_{Y.pid = 5}$ onto Supplies Y


#### Example Optimization #3

```sql
SELECT *
FROM Suppliers X, Supplies Y, Parts Z
WHERE X.sid = Y.sid AND Y.pid = Z.pid
```

- Plan 1: (Suppliers $\bowtie$ Supplies) $\bowtie$ Parts
- Plan 2: Suppliers $\bowtie$ (Supplies $\bowtie$ Parts)
- Which logical plan is better?
    - depends on: |Suppliers $\bowtie$ Supplies| $\lessgtr$ |Supplies $\bowtie$ Parts|


#### Example Optimization #4

```sql
SELECT *
FROM Suppliers x, Supplies y, Parts z
WHERE x.city = 'Seattle' AND z.price > 99
  AND x.sid = y.sid AND y.pid = z.pid
```

- Plan 1: join $\sigma_{x.city = 'Seattle'}$(Suppliers) with Supplies first, then Parts
- Plan 2: join Supplies with $\sigma_{z.price > 99}$(Parts) first, then Suppliers
- Which logical plan is better?
    - need an estimate for $\sigma_{x.city = 'Seattle'}$(Suppliers) vs $\sigma_{z.price > 99}$(Parts)
