---
order: 12
---

refers to a record (or tuple) that provides evidence or support for an [[Simple Aggregation|aggregate]] query result


```
SELECT x.city, MAX(y.price)
FROM Company x, Product y
WHERE x.cid = y.cid
GROUP BY x.city;
```

Getting the result per city, but don't know which product actually has that maximum price.

```
WITH CityMax AS (
  SELECT x.city, MAX(y.price) AS maxprice
  FROM Company x, Product y
  WHERE x.cid = y.cid
  GROUP BY x.city
)
SELECT DISTINCT u.city, v.pname, v.price
FROM Company u, Product v, CityMax w
WHERE u.cid = v.cid AND u.city = w.city AND v.price = w.maxprice;
```


| cid | cname     | city    |
| --- | --------- | ------- |
| 1   | Apple     | Seattle |
| 2   | Microsoft | Seattle |
| 3   | Samsung   | Seoul   |

| pname     | price | cid |
| --------- | ----- | --- |
| iPhone    | 999   | 1   |
| MacBook   | 1999  | 1   |
| Surface   | 1499  | 2   |
| Galaxy    | 1199  | 3   |
| GalaxyTab | 1999  | 3   |

|city|pname|price|
|---|---|---|
|Seattle|MacBook|1999|
|Seoul|GalaxyTab|1999