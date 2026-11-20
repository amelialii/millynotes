---
order: 36
---

## Index Cost Estimation

#### Database Design Question

- Choosing how to configure a database system is an interesting (i.e. hard) problem
- A database that is used by many people will often need one or more dedicated personnel to manage it (Database Administrator)
    - logical design (multi-team coordination)
    - physical design (hardware and system considerations)
    - permission management (visibility and security)
    - integration (company acquisitions and mergers)
    - ...


#### Estimating Amount of Data Read

- Selectivity Factor (X) → proportion of total data needed
- Assuming uniform distribution of data values on numeric attribute a in table R, if the condition is:
    - a = c → $X \cong \frac{1}{V(R, a)}$
    - a < c → $X \cong \frac{c - min(R, a)}{max(R, a) - min(R, a)}$
    - c1 < a < c2 → $X \cong \frac{c_2 - c_1}{max(R, a) - min(R, a)}$
    - cond1 AND cond2 → $X \cong X_1 \cdot X_2$
- More thorough selectivity estimation will use a histogram


#### Index-Based Selection

```sql
SELECT * FROM R WHERE R.a = c
```

- Cost in IOs (block reads), given some condition to read data:
    - **full sequential scan** → B(R)
        - reads every block
    - **scan on clustered index** → X * B(R)
        - able to read a contiguous chunk of the file
    - **scan on unclustered index** → X * T(R)
        - worst case would read a different block every time


#### Sequential Scan

- Assume a block holds 4 tuples. I want tuples associated with values 40-85
- Without an index, finding a value must be done the "old fashioned way"
    - read every block d1, d2, d3, ...
- Total cost is B(R)


#### Clustered Index Scan

- Assume a block holds 4 tuples. I want tuples associated with values 40-85
- With a clustered index, I start scanning blocks in the range they are at
- Estimated cost is X * B(R)


#### Unclustered Index Scan

- Assume a block holds 4 tuples. I want tuples associated with values 40-85
- With an unclustered index, I start scanning tuples wherever they occur
- Important: we have no caching guarantees, may have to scan same block multiple times
- Estimated cost is X * T(R)


#### Index Expectations

- Using an index in the wrong scenario can lead to a slowdown
- Common example: full sequential scan vs unclustered index scan with high X value and/or small tuple size (large T(R):B(R) ratio)

Example:
- Known: B(R) = 100, T(R) = 10000
- Consider a query with X = 1/10
- Sequential scan = B(R) = 100
- Unclustered index scan = X * T(R) = 1/10 * 10000 = 1000
- Having indexes doesn't mean you will see a speedup!

Sequential vs random reads:
- Sequential disk reads are faster than random ones
    - cost ~1-2% random scan = full sequential scan
    - equivalent to selectivity ~.01-.02
- sequential scan: B(R)
- clustered index: X * B(R)
- unclustered index: X * T(R)
    - cheaper than a sequential scan only when proportion of data needed is below ~1-2%



## Database Tuning

#### Create Indexes in SQL

```sql
CREATE TABLE Users (
    id INT,
    age INT,
    score INT);

CREATE INDEX U_age ON Users(age)

CREATE INDEX U_age_score ON Users(age, score)

CREATE CLUSTERED INDEX U_score_age ON Users(score, age)
```

- `CREATE INDEX`: unclustered by default
- `U_age_score ON Users(age, score)`: order specifies precedence in sorting
- `CREATE CLUSTERED INDEX`: reorders data on disk! (fails if another clustered index exists)
- Fine to create indexes on non-numeric data


#### Leveraging Indexes

- Often for applications, workloads can be well described
    - flights application
        - search method → query on city name values
    - data visualization software (e.g. Tableau)
        - 2D plot → query on graph axis bounds
- Create indexes to match expected query workload

Example: what indexes could we make on Users?

```sql
CREATE TABLE Users (
    id INT PRIMARY KEY,
    age INT,
    score INT, ...);
```

Expecting 1000 exec/day

```sql
SELECT *
FROM Users, Assets
WHERE Users.id = Assets.uid
```

- IDs are unique so an unclustered index would do fine

Expecting 1000 exec/day

```sql
SELECT *
FROM Users
WHERE Users.score > 95
```

- This range query would benefit from a clustered index on score

Expecting 10 exec/day

```sql
SELECT *
FROM Users
WHERE Users.age > 21
```

- This range query would benefit from a clustered index on age
- Only one can exist!
- Things to consider:
    - what is the expected result size for each query?
    - do either of these queries need to be returned ASAP?
