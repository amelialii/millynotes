---
order: 13
---

Which categories of products were purchased on both 3/1/2025 and 3/3/2025?

```
SELECT *
FROM Productwithkeys p
JOIN purchasewithkeys marchfirst
  ON p.productID = marchfirst.productid
  AND CONVERT(date, marchfirst.date) = '3/1/2025'
JOIN purchasewithkeys marchthird
  ON p.productID = marchthird.productid
  AND CONVERT(date, marchthird.date) = '3/3/2025'
```

same with WHERE syntax
```
SELECT *
FROM Productwithkeys p,
     purchasewithkeys marchfirst,
     purchasewithkeys marchthird
WHERE p.productID = marchfirst.productid
  AND p.productID = marchthird.productid
  AND CONVERT(date, marchfirst.date) = '3/1/2025'
  AND CONVERT(date, marchthird.date) = '3/3/2025'
```

same with CTE
```
WITH marchfirst AS (
    SELECT *
    FROM purchasewithkeys marchfirst
    WHERE CONVERT(date, date) = '3/1/2025'
), marchthird AS (
    SELECT *
    FROM purchasewithkeys marchthird
    WHERE CONVERT(date, date) = '3/3/2025'
)
SELECT *
FROM Productwithkeys p, marchfirst mf, marchthird mt
WHERE p.productID = mf.productid
  AND p.productID = mt.productid
```