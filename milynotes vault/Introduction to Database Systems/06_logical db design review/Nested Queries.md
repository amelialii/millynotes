---
order: 21
---


A subquery is a SQL query nested inside a larger query
Such inner-outer queries are called nested queries
A subquery may occur in:
- A SELECT clause
- A FROM clause
- A WHERE clause

In a SELECT clause, must return **a single value** (1 row, 1 column)
In a FROM clause, returns a **relation** (many rows, many relations), aliased using a tuple variable
In a WHERE clause, **may** return a **single value** to be compared with another value
In a WHERE clause, **may** return a **relation** to be used with WHERE EXISTS


### Subqueries in SELECT (single value)

For each product return the city where it is manufactured
```
SELECT X.pname, (SELECT Y.city  
	FROM Company Y  
	WHERE Y.cid = X.cid) as City  
FROM Product X
```

> "Correlated subquery": a subquery that depends on a value from the outer query
> "Using this product's `cid`, find the `city` in the `Company` table."


Same thing as:
```
SELECT X.pname, Y.city  
FROM Product X, Company Y  
WHERE X.cid = Y.cid
```


Compute the number of products made by each company
```
SELECT C.cid, C.cname, (SELECT count(*)
	FROM Product P  
	WHERE P.cid = C.cid)  
FROM Company C
```

Same thing as:
```
SELECT C.cid, C.cname, count(pname)  
FROM Company C LEFT JOIN Product P  
ON C.cid = P.cid  
GROUP BY C.cid, C.cname
```

> Without LEFT JOIN, companies with no products are excluded


### Subqueries in FROM

Find all products whose prices is > 20 and < 500

```
SELECT X.pname  
FROM (SELECT *  
	FROM Product AS Y  
	WHERE price > 20) as X  
WHERE X.price < 500
```

> Every SQL returns a relation, so you can use it in the FROM clause like any other relation

Sometimes we need to compute an intermediate table only to use it later in a SELECT-FROM-WHERE  
- Option 1: use a subquery in the FROM clause
- Option 2: use the [[WITH]] clause  

```
WITH myTable AS (
	SELECT *
	FROM Product AS Y
	WHERE price > 20)
SELECT X.pname
FROM myTable as X
WHERE X.price < 500
```


### Subqueries in WHERE

Find all companies that make **some** products with price < 200

Using EXISTS:
```
SELECT C.cid, C.cname  
FROM Company C  
WHERE EXISTS (SELECT *  
	FROM Product P  
	WHERE C.cid = P.cid and P.price < 200)
```
EXISTS returns TRUE if the subquery returns any row

Using IN:
```
SELECT C.cid, C.cname  
FROM Company C  
WHERE C.cid IN (SELECT P.cid  
	FROM Product P  
	WHERE P.price < 200)
```

Using ANY:
```
SELECT C.cid, C.cname  
FROM Company C  
WHERE 200 > ANY (SELECT price  
	FROM Product P  
	WHERE P.cid = C.cid)
```

> Not supported in some DBMS (avoid)


Unnest it:
```
SELECT DISTINCT C.cid, C.cname  
FROM Company C, Product P  
WHERE C.cid = P.cid and P.price < 200
```


Find all companies s.t. all their products have price < 200 = Find all companies that make only products with price < 200


Find all companies s.t. all their products have price < 200  
1. Find the other companies that make some product ≥ 200

```
SELECT C.cid, C.cname
FROM Company C
WHERE C.cid NOT IN (
	SELECT P.cid
	FROM Product P
	WHERE P.price >= 200
)
```

2. Find all companies s.t. all their products have price < 200

Another way using EXISTS

```
SELECT C.cid, C.cname
FROM Company C
WHERE NOT EXISTS (SELECT *
	FROM Product P
	WHERE P.cid = C.cid and P.price >= 200)
```

Using ALL:
```
SELECT C.cid, C.cname  
FROM Company C  
WHERE 200 >= ALL (SELECT price  
	FROM Product P  
	WHERE P.cid = C.cid)
```

> Not supported in some DBMS (avoid)