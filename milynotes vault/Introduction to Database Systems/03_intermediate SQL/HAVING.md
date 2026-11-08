---
order: 8
---

Purchase(pid, product, price, quantity, month)  
```
SELECT product, sum(price*quantity)  
FROM Purchase  
WHERE price > 1  
GROUP BY product  
HAVING sum(quantity) > 30
```
**HAVING clause contains conditions on aggregates**
Where clause before grouping, having clause after [[GROUP BY|grouping]]

#### WHERE vs HAVING  
WHERE is applied to individual rows  
- The rows may or may not contribute to the aggregate  
- No aggregates allowed here
- Occasionally, some groups become empty and are removed  
HAVING is applied to the entire group  
- Entire group is returned, or removed  
- May use aggregate functions on the group  


```
SELECT COUNT(*) AS total_users
FROM users
HAVING COUNT(*) > 100;
```
Also works.
GROUP BY not strictly required


**Example**

Compute the total income per month  
Show only months with less than 10 items sold  
Order by quantity sold and display as “TotalSold” 

Purchase(pid, product, price, quantity, month)
```
SUM month, SUM(price * quantity),  
sum(quantity) as TotalSold  
FROM Purchase  
GROUP BY month  
HAVING sum(quantity) < 10
ORDER BY sum(quantity)  
```