---
order: 9
---

One answer for each product
```
SELECT product, count(*)  
FROM Purchase  
GROUP BY product
```

One answer for each month
```
SELECT month, count(*)  
FROM Purchase  
GROUP BY month
```


Using multiple aggregates:
```
SELECT product, sum(quantity) AS SumQuantity, max(price) AS MaxPrice  
FROM Purchase
GROUP BY product
```



**All attributes must be involved in GROUP BY or an [[Simple Aggregation|aggregate]]**
✅
```
SELECT product, max(quantity)  
FROM Purchase 
GROUP BY product
```

❌
```
SELECT product, quantity  
FROM Purchase  
GROUP BY product
```


### GROUP BY + DISTINCT

```
SELECT month  
FROM Purchase  
GROUP BY month
```

=

```
SELECT DISTINCT month  
FROM Purchase
```



### GROUP BY + WHERE

| Product | Price | Quantity |
| ------- | ----- | -------- |
| Bagel   | 3     | 20       |
|         | 1.50  | 20       |
| Banana  | 0.5   | 50       |
|         | 2     | 10       |
|         | 4     | 10       

```
SELECT product, Sum(quantity) AS TotalSales  
FROM Purchase  
WHERE price > 1  
GROUP BY product
```

| Product | TotalSales |
| ------- | ---------- |
| Bagel   | 40         |
| Banana  | 20         |


### Grouping and Aggregation  

1. Compute the FROM and WHERE clauses.  
2. Group by the attributes in the GROUPBY  
3. Compute the SELECT clause: grouped attributes and aggregates.  

> <b><i>FWGS</i></b>

```
SELECT product, sum(price * quantity) as rev  
FROM Purchase  
GROUP BY product  
ORDER BY rev DESC
```


### GROUP BY + JOIN

```
SELECT x.manufacturer, y.month, COUNT(*)
FROM Product x, Purchase y
WHERE x.product_id = y.product_id
	and y.price > 100
GROUP BY x.manufacturer, y.month
```