---
order: 28
---

- SQL = a declarative language where we say what data we want to retrieve
- RA = an algebra where we say how we want to retrieve the data
- RDMS translates SQL to RA then optimizes for performance


## RA Operators

- $\pi / \Pi$: SELECT, projection
- $\sigma$ (sigma): WHERE, selection
- $\gamma$ (gamma): grouping & aggregation
- $\bowtie$: JOIN
- ⟕: LEFT OUTER JOIN
- ⟖: RIGHT OUTER JOIN
- ⟗: FULL OUTER JOIN
- $\times$: cartesian product, `FROM T, S` with no WHERE
- $\cup$: UNION
- $\cap$: intersection; INTERSECT
- $-$: difference; EXCEPT
 - $\tau$ (tau): sort
- $\delta$ (delta): duplicate elimination; SELECT DISTINCT
- $\rho$ (rho): rename

#### Unary operator

Projection removes unspecified columns

![[file-20261021104552477.png|478]]


Selection filters tuples from the input

![[file-20261021104617526.png|493]]


#### Binary operator

Joins inputs relations on the specified condition

![[file-20261021104647531.png|577]]


## English to SQL to RA Example

![[file-20261021105014177.png|578]]

