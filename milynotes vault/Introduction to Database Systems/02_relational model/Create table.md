---
order: 6
---

**Company Table**

| cname   | country | no_employees | for_profit |
|---------|---------|--------------|------------|
| Canon   | Japan   | 50000        | Y          |
| Hitachi | Japan   | 30000        | Y          |

```
CREATE TABLE Company (
  cname VARCHAR(30),
  country VARCHAR(20),
  no_employees INT,
  for_profit BOOLEAN
);
```

or:

```
CREATE TABLE Company (
  cname VARCHAR(30) PRIMARY KEY,
  country VARCHAR(20),
  no_employees INT,
  for_profit BOOLEAN
);
```


---

Product(<u>name</u>, category)

```
CREATE TABLE Product (
  name CHAR(30) PRIMARY KEY,
  category VARCHAR(20)
);
```

or:

```
CREATE TABLE Product (  
	name CHAR(30),  
	category VARCHAR(20),  
	PRIMARY KEY (name))  
```



### Keys with multiple attributes

Product(<u>name</u>, <u>category</u>, price)

```
CREATE TABLE Product (  
	name CHAR(30),  
	category VARCHAR(20),  
	price INT,  
	PRIMARY KEY (name, category)  
)
```

| **Name** | **Category** | **Price** |
| -------- | ------------ | --------- |
| Gizmo    | Gadget       | 10        |
| Camera   | Photo        | 20        |
| Gizmo    | Photo        | 30        |
| Gizmo    | Gadget       | 40        |


### Other keys

```
CREATE TABLE Product (  
	productID CHAR(10),  
	name CHAR(30),  
	category VARCHAR(20),  
	price INT,  
	PRIMARY KEY (productID),  
	UNIQUE (name, category))
```

There is at most one **PRIMARY KEY**;  
there can be many **UNIQUE**

| Feature            | PRIMARY KEY                 | UNIQUE                                         |
| ------------------ | --------------------------- | ---------------------------------------------- |
| Ensures uniqueness | ✅ Yes                       | ✅ Yes                                          |
| Allows NULL values | ❌ No (NULL not allowed)     | ✅ Yes (unless you say otherwise)               |
| Number per table   | ❗Only one allowed           | ✅ You can have multiple UNIQUE constraints     |
| Main identity      | ✅ Used to identify each row | ❌ Just used to enforce rules, not row identity |


### Foreign key constraints

```
CREATE TABLE Purchase (  
	prodName CHAR(30) REFERENCES Product(name),  
	date DATETIME)
```

prodName is a [[Keys#Foreign key|foreign key]] to Product(name)  
name must be a key in Product

Example:
```
CREATE TABLE Purchase (  
	prodName CHAR(30),  
	category VARCHAR(20),  
	date DATETIME,  
	FOREIGN KEY (prodName, category)  
	REFERENCES Product(name, category)
```
- (name, category) must be a KEY in Product

