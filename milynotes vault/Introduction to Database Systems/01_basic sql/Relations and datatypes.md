---
order: 0
---
A relation R has a set of attributes A, B, C, ...
	*– e.g., cname, country, no_employees, for_profit*
An attribute A has a domain SA
	*– The domain is the set of allowed values.
	– Ex: no_employees: Domain is the set of all integers
	– Ex: cname: Domain is the set of all text shorter than 20 chars*
A Relation R is subset of S1 x S2 x ... x Sn
	*– Where Si is the domain of attribute i
	– n is number of attributes of the relation
	– Example:
		Think of all possible tuples Integer X Varchar X Varchar
		A tuple (234, Bill, Howe) is one of these.
		A relation is a set of these tuples*
		INFO 330 – Au 2024 4



Each attribute has a type
Types are enforced



`INT` / `INTEGER` *-2,147,483,648 to 2,147,483,647*

`SMALLINT` *32,768 to 32,767*

`BIGINT` *-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807*  

`DECIMAL(p,s)` *exact numeric, precision p, scale s*

`FLOAT(p)` *approximate numeric, precision p (precision in binary digits)*

`DATE` *(YYYY-MM-DD)*

`TIME` *(HH:MM:SS)*

`CHAR(n)` *fixed-length string*

`NCHAR(n)` *fixed-length Unicode string*

`VARCHAR(n)` *variable-length string*

`NVARCHAR(n)` *variable-length Unicode string*

`BIT(BOOLEAN)` *TRUE/FALSE/NULL*

