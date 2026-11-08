---
order: 14
---

### Database Design Process

**Conceptual Database Design**
	Organizing information into a data model.
	Identifies entities, relationships, constraints, and operations.
	Aims to capture requirements independently of specific systems/tools.

**Data Model Components**
	Structures (e.g., entities like Employee, Product),
	Constraints (e.g., each employee must have a supervisor),
	Operations (e.g., make a purchase).

**Design Levels**
	Conceptual Schema (entities and relationships)
	[[From ERD to relational schema|Relational Schema]] (tables and constraints)
	[[Physical data dependence|Physical Schema]] (storage details)


### Conceptual Design Process

**Entity Identification**
	Begin by identifying entities—the real-world things that data is about.
	Example: For a race-tracking app, possible entities include:
		Racers, Races, Bicycles/Equipment, Sponsors, Race Results

**Relationships Among Entities**
	Recognize how entities are related:
		Parent-Child
		Has-A, Is-A
		Part-Of, Depends-On
	Concepts like Inheritance, Aggregation, Association, etc.

**[[Entity Relationship Diagram|Entity-Relationship (E/R) Diagrams]]**
	Entity Set = a class/type of object
	Entity = an instance
	Includes attributes, relationships, and keys for each entity set.

**Relations and Multiplicity**
	A relation is a mathematical subset of the Cartesian product of two sets.
	[[Relationship|Relationships]] may be:
		One-to-one
		One-to-many
		Many-to-many

**Attributes on Relationships**
	Relationships can have their own attributes (e.g., date of purchase in a "Buys" relationship).

