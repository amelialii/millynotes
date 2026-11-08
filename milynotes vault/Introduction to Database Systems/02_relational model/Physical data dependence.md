---
order: 4
---

**Physical data independence**
The logical definition of the data remains unchanged, even when we make changes to the actual implementation

##### Imagine a database like a filing cabinet:

- **You** (the user) just ask, “Hey, give me Alice’s file.”
    
- **You don’t care** where in the cabinet the file is kept, how it’s arranged, or how it’s labeled inside — you just want the info.


#### SQL Example:

You have this table:

`Customers (ID, Name, Email)`

And you run:

`SELECT Name FROM Customers WHERE ID = 5;`

Now imagine the database admin:
- Moves that table to a faster disk
- Adds an [[Indexing|index]] on `ID` to make the query faster
- Stores some rows in a different file for performance

#### Query **still works the same**:

- You **don’t have to change** it
- You **still get the same result**
- You **don’t even know** anything changed inside