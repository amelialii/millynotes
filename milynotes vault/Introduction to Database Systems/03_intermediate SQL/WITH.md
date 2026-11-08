---
order: 11
---

[[Nested Queries#Subqueries in FROM|Nested queries in the FROM clause]]:
```
SELECT X.pname  
FROM (SELECT *  
	FROM Product AS Y  
	WHERE price > 20) as X
WHERE X.price < 500
```


Use WITH to assign a name to a result so it can be reused:
```
WITH expensiveprods as (
	SELECT *
	FROM Product AS Y
	WHERE price > 20
)
SELECT X.pname
FROM expensiveprods as X
WHERE X.price < 500
```

Multiple results can be named  
```
WITH seattlecompanies as (
	SELECT *
	FROM Company
	WHERE city = ‘Seattle’
),
expensiveprods as (
	SELECT *
	FROM Product AS Y
	WHERE price > 20
)
SELECT s.cname, e.pname
FROM expensiveprods e, seattlecompanies s
WHERE e.cid = s.cid
```

Results can refer to previous results:
```
WITH seattlecompanies as (  
	SELECT *  
	FROM Company  
	WHERE city = ‘Seattle’  
),  
seattleprods as (  
	SELECT p.*  
	FROM Product p, seattlecompanies s  
	WHERE p.cid = s.cid  
),  
cheapseattleprods as (  
	SELECT *  
	FROM seattleprods p  
	WHERE price < 100  
),  
SELECT * FROM cheapseattleprods
```

Example: Find companies that sell both cheap and expensive products  
```
WITH cheap as (  
	SELECT cid  
	FROM Product p, Company c  
	WHERE p.cid = c.cid  
	AND p.price < 10  
)  
expensive as (  
	SELECT cid  
	FROM Product p, Company c  
	WHERE p.cid = c.cid  
	AND p.price > 100  
)  
SELECT cname FROM Company c, cheap, expensive  
WHERE c.cid = cheap.cid  
AND c.cid = expensive.cid
```