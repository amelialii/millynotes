---
order: 24
---

A **functional dependency** is a constraint that describes a relationship between attributes (columns) in a relation (table).

 >If two tuples agree on attribute X, they must also agree on the attributes Y
   `X -> Y`

X functionally determines Y.


If you have a table `Students` with attributes:
`StudentID, Name, Major)`

and each student has a unique `StudentID`, then:
`StudentID -> Name, Major`

Means knowing the StudentID uniquely determines the Name and Major.

If we can be sure that *every instance* of R (relational schema) will be one in which a given FD is true, then we say that R satisfies the FD

### Additional Rules

If X → Y and X → Z, then X → YZ

If X → YZ, then X → Y and X → Z

If X → Y and WY → Z, then WX → Z
