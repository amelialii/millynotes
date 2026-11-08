---
order: 19
---

```
CREATE TABLE User (  
	uid int primary key,  
	firstName text,  
	lastName text NOT NULL,  
	age int CHECK (age > 12 and age < 120),  
	email text,  
	phone text,  
	CHECK (email is not NULL or phone is not NULL)  
)
```


Similar to FK, but not supported
```
CREATE TABLE Purchase (
    prodName CHAR(30)
        CHECK (prodName IN (
            SELECT Product.name
            FROM Product
        )),
    date DATETIME NOT NULL
);
```

