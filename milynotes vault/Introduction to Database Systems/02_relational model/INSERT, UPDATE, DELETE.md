---
order: 7
---

```
INSERT Product(name, category)  
VALUES (‘gizmo’, ‘toy'),  
	(‘digicam’, ‘camera’)  
```

You can specify which columns you’re providing.  

You can insert multiple records with one  statement. Often much faster than a separate statement for each record.

---

```
UPDATE Product
SET category = ‘toy’
WHERE name = ‘digicam’
```
You can make multiple changes with one statement  
ALL records that match this condition will be updated.

---

```
DELETE FROM Product  
WHERE category = ‘toy’
```

ALL records that match this condition will be updated.
