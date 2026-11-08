---
order: 20
---


![[fk.png|574]]



![[fk1.png|593]]



What should the DB engine do if execution SQL statement collides with a FOREIGN KEY constraint?
	For example:  `DELETE FROM Company WHERE name = ‘lmao’;`
		and the Products Table contains Foreign Key entries for  `cname = ‘Imao’`

ON DELETE / ON UPDATE Options  
- NO ACTION  
	Default behavior; Raises an error and the Delete/Update is rolled back
- CASCADE
	Automatically fixes the referencing Table; on UPDATE, corresponding rows are changed
- SET NULL
	Automatically fixes the referencing Table; FOREIGN KEY column must be NULLABLE
- SET DEFAULT  
	Automatically fixes the referencing Table; FOREIGN KEY column must have DEFAULT value defined


```
CREATE TABLE Company (
	name VARCHAR(100) PRIMARY KEY);
	CREATE TABLE Product (
	name VARCHAR(100) PRIMARY KEY,
	cname VARCHAR(100) REFERENCES Company (name)
	ON UPDATE CASCADE
	ON DELETE SET NULL);
```


#### Weak Entity Set -> Foreign Key + Cascade Delete  
```
CREATE TABLE Team (  
	univname CHAR(30) REFERENCES University(name)  
	ON DELETE CASCADE ON UPDATE CASCADE,  
	number int,
	sport CHAR(30))
```
