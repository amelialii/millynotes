---
order: 2
---

key = one (or more) attributes that uniquely identify a record


### Primary Key

The one key the db designer picks to be the main way of identifying rows

| student_id | first_name | last_name | major       |
| ---------- | ---------- | --------- | ----------- |
| 1          | Alice      | Smith     | Informatics |
| 2          | Bob        | Lee       | CS          |
| 3          | Carol      | Johnson   | Informatics |
```
-- two ways for assigning PK

CREATE TABLE students (
    student_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    major VARCHAR(50)
);

CREATE TABLE students (
    student_id INT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    major VARCHAR(50),
    PRIMARY KEY (student_id)
);
```




### Multi-attribute keys

| fName | lName    | Income | Department |
| ----- | -------- | ------ | ---------- |
| Alice | Smith    | 20000  | Testing    |
| Alice | Thompson | 50000  | Testing    |
| Bob   | Thompson | 30000  | SW         |
| Carol | Smith    | 50000  | Testing    |



### Surrogate keys

| id    | fName | lName    | Income | Department |
| ----- | ----- | -------- | ------ | ---------- |
| 11111 | Alice | Smith    | 20000  | Testing    |
| 22222 | Alice | Thompson | 50000  | Testing    |
| 33333 | Bob   | Thompson | 30000  | SW         |
| 44444 | Carol | Smith    | 50000  | Testing    |
```
CREATE TABLE employees (
    employee_id INT IDENTITY(1,1) PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    department VARCHAR(100)
);

INSERT INTO employees (first_name, last_name, department)
VALUES ('Amelia', 'Smith', 'Informatics');

SELECT * FROM employees;

-- dont need to insert primary key
```



### Super key

key might be an entire tuple
all attributes together *always* form a key

| Make   | Model | Year |
| ------ | ----- | ---- |
| Honda  | Pilot | 2014 |
| Honda  | CRV   | 2014 |
| Toyota | Camry | 2012 |
| Honda  | Pilot | 2017 |


### Multiple keys
a relation can have more than 1 key
the DB designer will designate one as the primary key

| SSN         | fName | lName    | Income | Department |
| ----------- | ----- | -------- | ------ | ---------- |
| 111-22-3333 | Alice | Smith    | 20000  | Testing    |
| 222-33-4444 | Alice | Thompson | 50000  | Testing    |
| 333-44-5555 | Bob   | Thompson | 30000  | SW         |
| 444-55-6666 | Carol | Smith    | 50000  | Testing    |



### Foreign key

| title                  | author             | isbn       | publisher     | printing |
| ---------------------- | ------------------ | ---------- | ------------- | -------- |
| The New Jim Crow       | Michelle Alexander | 123-45-678 | The New Press | 1        |
| Guns, Germs, and Steel | Jared Diamond      | 444-55-666 | Norton        | 2        |

| isbn       | customer | date     |
| ---------- | -------- | -------- |
| 123-45-678 | 1234     | 9/2/2021 |
| 444-55-666 | 4456     | 9/5/2021 |

| customer | lname | fname |
|----------|-------|-------|
| 1234     | Shah  | S     |
| 4456     | Lee   | J     

- The `isbn` in the **Sales** table refers to the `isbn` in the **Books** table. This tells us which book was sold.
- The `customer` in the **Sales** table refers to the `customer` in the **Customers** table. This tells us who bought the book.

A **foreign key** is a field (or group of fields) in one table that refers to the **primary key** in another table.
- It’s how we create relationships between tables in a database.