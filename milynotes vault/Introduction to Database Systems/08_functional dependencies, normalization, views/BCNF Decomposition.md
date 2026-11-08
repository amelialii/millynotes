---
order: 26
---

(recall [[Normalization#BCNF (Boyce-Codd Normal Form)|BCNF]]: For **every [[Functional dependencies|functional dependency]]** `X → Y`, `X` must be a **[[Keys#Super key|superkey]]**)

### Step 1

Check which functional dependencies of R are not in BCNF, if they're all in BCNF we do not need to decompose R.

AB -> CD
D -> E
A -> C
B -> D

{AB}<sup>+</sup> = {A,B,C,D,E} -> CK: AB

AB -> CD
D -> E (violates BCNF)
A -> C
B -> D


### Step 2

Create two sub-relations:
1. {X}<sup>+</sup>
2. R - {X}<sup>+</sup> + X

AB -> CD
D -> E ->  {D}<sup>+</sup> = {D, E} -> R<sub>1</sub>(DE), R<sub>2</sub>(ABCD)
A -> C
B -> D


### Step 3

For each sub-relation we check if all of its functional dependencies are now in BCNF
- if they are we keep the sub-relation as it is
- if not, do Step 2 again for the sub-relation's dependency that does not satisfy BCNF

R<sub>1</sub>(DE)
CK = D
D -> E (BCNF)

R<sub>2</sub>(ABCD)
CK = AB
AB -> CD (BCNF)
A -> C (not in BCNF)
B -> D

R<sub>3</sub>(AC)
CK = A
A -> C (BCNF)

R<sub>4</sub>(ABD)
CK = AB
AB -> D (BCNF)
B -> D (not in BCNF)

R<sub>5</sub>(BD)
CK = B
B -> D (BCNF)

R<sub>6</sub>(AB)
CK = AB
AB -> AB (BCNF)


### Step 4

Final decomposition is composed of sub-relations that all their functional dependencies hold BCNF


R<sub>1</sub>(DE)
D -> E

R<sub>3</sub>(AC)
A -> C

R<sub>5</sub>(BD)
B -> D

R<sub>6</sub>(AB)
AB -> AB