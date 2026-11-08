---
order: 23
---

In SQL, ranking functions help us assign ranks to rows based on partitioning and order expressions.
A [[Window Functions|window]] is just a set of rows that meet certain conditions

Generic syntax:
```
SELECT 
  RANK() / DENSE_RANK() / ROW_NUMBER() OVER ( -- Compulsory expression
    PARTITION BY partitioning_expression -- Optional expression
    ORDER BY order_expression) -- Compulsory expression
FROM table_name;
```


1. **ROW_NUMBER()**: This function assigns a unique sequential number to each row within a window. It's like numbering the rows in order.
2. **RANK()**: The `RANK()` function handles tied values by assigning the same rank to them. However, it may skip subsequent ranks, leaving gaps in the sequence.
3. **DENSE_RANK()**: Similar to `RANK()`, `DENSE_RANK()` also handles tied values by assigning the same rank. However, it does not skip ranks, resulting in no gaps in the sequence.

#### Window Function Ranking with ORDER BY

Write a query to display the list of artists sorted in descending order of their concert revenue.
```
SELECT 
 artist_name, 
 concert_revenue, 
 ROW_NUMBER() OVER (ORDER BY concert_revenue) AS row_num,
 RANK() OVER (ORDER BY concert_revenue) AS rank_num,
 DENSE_RANK() OVER (ORDER BY concert_revenue) AS dense_rank_num
FROM concerts;
```

|artist_name|concert_revenue|row_num|rank_num|dense_rank_num|
|---|---|---|---|---|
|BTS|800000|1|1|1|
|Beyonce|750000|2|2|2|
|Ariana Grande|720000|3|3|3|
|Bruno Mars|700000|4|4|4|
|Taylor Swift|700000|5|4|4|
|Justin Bieber|680000|6|6|5|
|Pink Floyd|670000|7|7|6|
|Red Hot Chili Peppers|660000|8|8|7|
|U2|650000|9|9|8|
|Ed Sheeran|650000|10|9|8|

#### Window Function Ranking with PARTITION BY and ORDER BY

```
SELECT 
  artist_name, 
  country,
  year_of_formation,
  ROW_NUMBER() OVER (PARTITION BY country ORDER BY year_of_formation) AS row_num,
 RANK() OVER (PARTITION BY country ORDER BY year_of_formation) AS rank_num,
 DENSE_RANK() OVER (PARTITION BY country ORDER BY year_of_formation) AS dense_rank_num
FROM concerts;
```

|artist_name|country|concert_revenue|row_num|rank_num|dense_rank_num|
|---|---|---|---|---|---|
|Rihanna|Barbados|550000|1|1|1|
|Justin Bieber|Canada|680000|1|1|1|
|The Weeknd|Canada|620000|2|2|2|
|BTS|South Korea|800000|1|1|1|
|Super Junior|South Korea|490000|2|2|2|
|EXO|South Korea|480000|3|3|3|
|Got7|South Korea|470000|4|4|4|
|SHINee|South Korea|470000|5|4|4|
|Ed Sheeran|United Kingdom|650000|1|1|1|
|Adele|United Kingdom|600000|2|2|2|
|One Direction|United Kingdom|580000|3|3|3|
|...|...|...|...|...|...|
