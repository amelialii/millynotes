---
order: 25
---

**Normalization** is a **process** in database design used to:
- Eliminate redundancy
- Prevent update anomalies
- Ensure data integrity

Normal forms are levels or stages of normalization.

#### 1NF (First Normal Form)
- All values in each column must be **atomic** (i.e., indivisible).
- No repeating groups or arrays.

| StudentID | CourseID | StudentName |
| --------- | -------- | ----------- |
| 1         | C101     | Alice       |
| 1         | C102     | Alice       |
| 2         | C101     | Bob         |

`StudentName` depends **only on StudentID**, not the full key → **partial dependency**

#### 2NF (Second Normal Form)
- Must be in **1NF**
- **No partial dependency**: No non-key attribute should depend on **part of a composite key**

|EmployeeID|DeptID|DeptName|
|---|---|---|
|1|10|Sales|
|2|20|HR|
|3|10|Sales|

`DeptID → DeptName` (transitive: `EmployeeID → DeptID → DeptName`)

#### 3NF (Third Normal Form)
- Must be in **2NF**
- No **transitive dependency**: Non-key attributes shouldn’t depend on **other non-key attributes**
	- transitive dependency: A non-key attribute depends on another non-key attribute, which in turn depends on the key.

|Course|Instructor|Room|
|---|---|---|
|Math101|Smith|R1|
|CS102|Jones|R2|
|Math101|Smith|R1|

**Instructor** is not a key, but it's determining `Room` → violates BCNF

#### BCNF (Boyce-Codd Normal Form)
- Must be in **3NF**
- For **every functional dependency** `X → Y`, `X` must be a **superkey**

| Student | Language | Hobby  |
| ------- | -------- | ------ |
| Alice   | French   | Music  |
| Alice   | French   | Sports |
| Alice   | Spanish  | Music  |
| Alice   | Spanish  | Sports |

#### Relational Schema Design  (or Logical Design)  

• Start with some relational schema  
• Find out its [[Functional dependencies|functional dependencies]] (FDs)  
• Use FDs to normalize the relational schema  


One person may have multiple phones, but lives in only one city  
Primary key is thus (SSN, PhoneNumber)
What's wrong?

| Name | SSN         | PhoneNumber  | City      |
| ---- | ----------- | ------------ | --------- |
| Fred | 123-45-6789 | 206-555-1234 | Seattle   |
| Fred | 123-45-6789 | 206-555-6543 | Seattle   |
| Joe  | 987-65-4321 | 908-555-2121 | Westfield |
| Joe  | 987-65-4321 | 908-555-1234 | Westfield |

The only key is: `{SSN, PhoneNumber}`
Hence `SSN -> Name, City` is a “bad” dependency  
- Why? Partial dependency
	- partial dependency: when a non-key attribute depends on part of a composite key, not the full key

In other words:  
SSN<sup>+</sup> = SSN, Name, City and is neither SSN nor All Attributes  
- Is not enough to uniquely identify tuples
- But it's also not trivial (more than just itself)


> `SSN⁺` : the **closure** of the attribute `SSN`, meaning the set of attributes functionally determined by SSN.
> `SSN⁺ = {SSN, Name, City}`

#### Example BCNF Decomposition

| Name | SSN         | City      |
|------|-------------|-----------|
| Fred | 123-45-6789 | Seattle   |
| Joe  | 987-65-4321 | Westfield |

| SSN         | PhoneNumber   |
|-------------|---------------|
| 123-45-6789 | 206-555-1234  |
| 123-45-6789 | 206-555-6543  |
| 987-65-4321 | 908-555-2121  |
| 987-65-4321 | 908-555-1234  |
