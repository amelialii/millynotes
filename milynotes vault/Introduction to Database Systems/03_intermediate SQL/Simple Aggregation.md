---
order: 10
---

Total quantities for all sales over $1, by product.
```
SELECT sum(quantity)  
FROM Purchase  
WHERE price > 1
```


Five basic aggregate operations:
```
SELECT count(*) FROM Purchase  
SELECT sum(quantity) FROM Purchase  
SELECT avg(price) FROM Purchase  
SELECT max(quantity) FROM Purchase  
SELECT min(quantity) FROM Purchase
```


Multiple simple aggregations in one statement   
```
SELECT count(*), sum(quantity), avg(price)  
FROM Purchase
```


Compute the average price with sum and count  
```
SELECT sum(quantity) / count(*) AS average_quant  
FROM Purchase
```


SQL as a calculator
```
SELECT 1+2+3+4+5 AS expr
SELECT 25 / 100
SELECT 25 / 100.0
SELECT 25 / CAST(100 AS Float)
```


```
SELECT sum(quantity) / count(*)  
FROM Purchase  
```
`int / int = int`

```
SELECT (1.0*sum(quantity)) / count(*)  
FROM Purchase  
```
`(float * int) / int = float`

```
SELECT CAST(sum(quantity) AS float) / count(*)  
FROM Purchase  
```
`(float * int) / int = float`


### Aggregation and NULL

[[NULL]] values are not used in aggregates

```
CREATE TABLE Purchase (
    id INT,
    item_name VARCHAR(50),
    quantity INT,
    price DECIMAL(10, 2),
    purchase_month VARCHAR(20)
);

INSERT INTO Purchase VALUES (12, 'gadget', NULL, NULL, 'april');
INSERT INTO Purchase VALUES (12, 'gadget', 5, NULL, 'april');
```

| id  | item_name | quantity | price | purchase_month |
|-----|-----------|----------|-------|----------------|
| 12  | gadget    | NULL     | NULL  | april          |
| 12  | gadget    | 5        | NULL  | april          |


```
SELECT count(quantity) FROM Purchase

SELECT count(*)  
FROM Purchase  
WHERE quantity IS NOT null;
```