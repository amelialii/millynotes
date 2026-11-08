---
order: 1
---


Query Evaluation Steps

![[query-evaluation-steps.png|459]]


#### Database/Relation/Tuple
- A Database is collection of relations
- A [[Relations and datatypes|Relation]] R is subset of $S_1 \times S_2 \times \dots \times S_n$
	- Where $S_i$ is the domain of attribute $i$
	- $n$ is number of attributes of the relation 
	- A relation is a set of tuples
- A Tuple $t$ is an element of $S_1 \times S_2 \times \dots \times S_n$


- Rows in a relation
- Columns in a tuple
- Domain of each column is a primitive type


#### Schema
- Relation schema: describes column heads
	- Relation name
	- Name of each field (or column, or attribute)
	- Domain of each field
- Degree (or arity) of relation: # attributes
- Database schema: set of all relation schemas


#### Instance
- Relation instance: concrete table content
	- Set of tuples (also called records) matching the schema
- Cardinality of relation instance: # tuples
- Database instance: set of all relation instances


#### Key Constraints

- [[Keys#Super key|Super Key]]: “set of attributes that [[Functional dependencies|functionally determines]] all attributes”
- Key: Minimal super-key; a.k.a. “candidate key”
- [[Keys#Primary Key|Primary key]]: One minimal key can be selected as primary key
- [[Keys#Foreign key|Foreign key]]
	- Field that refers to tuples in another relation
	- This field refers to the primary key of other relation


### Relational Algebra

- Queries specified in an operational manner
	- A query gives a step-by-step procedure

- Relational operators
	- Take one or two relation instances as argument
	- Return one relation instance as result
	- Easy to compose into [[Relational Algebra|relational algebra]] expressions

		only two relations may be input to a join operator
		to join 3+ relations we need multiple join operators


#### Five Basic Relational Operators

- Selection: $\sigma_{\text{condition}}(S)$
	- condition is boolean combination ($\land$, $\lor$) of atomic predicates
- Projection: $\pi_{\text{list of attributes}}(S)$
- Union ($\cup$)
- Set difference (-)
- Cross-product/cartesian product ($\times$), [[JOINs|Join]]: $R \bowtie_\theta S = \sigma_\theta (R \times S)$



#### English to SQL to RA Example


![[sql-to-ra.png|537]]
