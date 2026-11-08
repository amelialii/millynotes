---
order: 1
---

There are multiple ways to join tables, with the two below being among the most common:

```
SELECT DISTINCT cname  
FROM Product, Company  
WHERE manufacturer = cname
```

```
SELECT DISTINCT cname  
FROM Product
JOIN Company
ON manufacturer = cname
```


#### A simple JOIN example


`Product` 

| pname     | category | manufacturer |
|-----------|----------|--------------|
| Gizmo     | gadget   | GizmoWorks   |
| Camera    | Photo    | Hitachi      |
| OneClick  | Photo    | Hitachi      |

`Company`

| cname      | country |
|------------|---------|
| GizmoWorks | USA     |
| Canon      | Japan   |
| Hitachi    | Japan   |

```
SELECT DISTINCT cname  
FROM Product p, Company c
WHERE p.manufacturer = c.cname;
```

| cname      |
|------------|
| GizmoWorks |
| Hitachi    |


#### (Inner) JOIN

`FROM Product, Company`
*"From <u><i>all possible combinations</i></u> of product of company"*

`WHERE`
*"... choose only those results where the manufacturer of the product is the same as the company name"*

`SELECT DISTINCT cname`
*"... then display only the unique company names."*

| id  | name |
| --- | ---- |
| 1   | Joe  |
| 2   | Jack |
| 3   | Jill |

| employeeID | productID |
| ---------- | --------- |
| 1          | 344       |
| 1          | 355       |
| 2          | 544       |

```
SELECT *
FROM Employee E, Sales S
WHERE E.id = S.employeeID
```

| id  | name | employeeID | productID |
| --- | ---- | ---------- | --------- |
| 1   | Joe  | 1          | 344       |
| 1   | Joe  | 1          | 355       |
| 2   | Jack | 2          | 544       |

alternative syntax:
```
SELECT *
FROM Employee E
	INNER JOIN
	Sales S
	ON E.id = S.employeeID
```

Retrieve employees and their sales:
```
SELECT *
FROM Employee E
	LEFT OUTER JOIN
	Sales S
	ON E.id = S.employeeID
```

| id  | name | employeeID | productID |
| --- | ---- | ---------- | --------- |
| 1   | Joe  | 1          | 344       |
| 1   | Joe  | 1          | 355       |
| 2   | Jack | 2          | 544       |
| 3   | Jill | null       | null      |


#### Outer JOIN

`Employee`

| id  | name |
| --- | ---- |
| 1   | Joe  |
| 2   | Jack |
| 3   | Jill |

`Sales`

| employeeID | productID |
|------------|-----------|
| 1          | 344       |
| 1          | 355       |
| 2          | 544       |

```
-- Retrieve employees and their sales

SELECT *
FROM Employee E
LEFT OUTER JOIN Sales S
ON E.id = S.employeeID;
```


| id | name | employeeID | productID |
|----|------|------------|-----------|
| 1  | Joe  | 1          | 344       |
| 1  | Joe  | 1          | 355       |
| 2  | Jack | 2          | 544       |
| 3  | Jill | NULL       | NULL      |

`FROM Employee E LEFT OUTER JOIN Sales S`  
_Start with all rows from the `Employee` table, and include matching rows from `Sales` — if there is no match, still include the employee with [[NULL]]s for sales data._
