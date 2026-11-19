---
order: 35
---

## Assumptions

414 assumptions:
- Disk-based storage
    - HDD not SSD
- Row-based storage
    - tuples are stored contiguously
- IO cost only
    - one disk access is ~100000x more expensive than one main memory access
- Cold cache
    - no data preloaded into main memory


#### Disk Storage

- Can only read 1 block per read operation
    - usually 512B to 4kB
- Sequential disk reads are faster than random ones
    - cost ~1-2% random scan = full sequential scan



## Files

#### Example Lookup

- Scan all records in the file that match a predicate of the form *attribute op value*
    - e.g. find all students with age > 22
- Critical to support such requests efficiently
    - why read all data from disk when we only need a small fraction of that data?


#### Heap File

- File is not sorted on any attribute

Student(sid: int, age: int, ...)

| sid | age |
| --- | --- |
| 30  | 18  |
| 70  | 21  |
| 20  | 20  |
| 40  | 19  |
| 80  | 19  |
| 60  | 18  |
| 10  | 21  |
| 50  | 22  |

Example:
- 10,000 students
- 10 student records per page
- Total number of pages: 1,000 pages
- Find student whose sid is 80
    - must read on average 500 pages
- Find all students older than 20
    - must read all 1,000 pages
- Can we do better?


#### Sequential File

- File sorted on an attribute, usually on primary key

Student(sid: int, age: int, ...)

| sid | age |
| --- | --- |
| 10  | 21  |
| 20  | 20  |
| 30  | 18  |
| 40  | 19  |
| 50  | 22  |
| 60  | 18  |
| 70  | 21  |
| 80  | 19  |

Example:
- Total number of pages: 1,000 pages
- Find student whose sid is 80
    - could do binary search, read $\log_2(1000)$ ≈ 10 pages
- Find all students older than 20
    - must still read all 1,000 pages
- Can we do even better?
- Note: sorted files are inefficient for inserts/deletes


#### Different Types of Files

- For the data inside base relations:
    - **heap file** (tuples stored without any order)
    - **sequential file** (tuples sorted on some attribute(s))
    - **indexed file** (tuples organized following an index)
- Then we can have additional index files that store (key, pointer) pairs
- Index can also be a "covering index"
    - index contains (search key + other attributes, pointer to table)
    - index suffices to answer some queries



## Indexes

- **Index**: data structure that organizes data records on disk to optimize selections on the search key fields for the index
- An index contains a collection of data entries, and supports efficient retrieval of all data entries with a given search key value k
- Indexes are also access methods!
    - so they provide the same API as we have seen for heap files
    - and efficiently support scans over tuples matching predicate on search key

Example: index file on age, data file is a sequential file sorted on sid

- Index File (search key: age): 18, 18, 19, 19, 20, 21, 21, 22
    - each entry points to the matching tuple in the data file
- Data File (sid, age): (10, 21), (20, 20), (30, 18), (40, 19), (50, 22), (60, 18), (70, 21), (80, 19)


#### Indexing

- Indexes can be assumed to be already loaded into memory
- An index does not have to contain all tuple data
    - only key values are stored in the index
    - if an index contains all tuple data it is called a "covering index"
- Indexes are access points for tables


#### Index Structures

- B+ Tree Index (most common)
- Hash Index
- R Tree
- Radix Tree
- Bloom Filter
- Hilbert Curves
- ...
- Type of index is usually determined by administrator. You don't need to choose as a user.



## Clustered vs. Unclustered Index

- An index is either clustered or unclustered, depending on how the actual data is sorted on disk
- **Clustered** = records close in index are close in data


#### Clustered Index

- A clustered index is one that has the same key ordering as what is on disk
- One per table
- Data file: sequential file


#### Unclustered Index

- An unclustered index may exist without any ordering on disk
- Any number per table
- Data file: sequential file with a different key or heap file
