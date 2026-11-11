---
order: 3
---

## First Storage Principle: Pages

Read/write pages of data


1 page = 1 disk block = fixed size (e.g. 8KB)
Records:
	- fixed length
	- variable length


### RID

Record ID = RID
- like a pointer to a tuple
- typical RID - (PageID, SlotNumber)


### Page Format Approach

#### Fixed-Length Slots

packed representation
divide page into slots. each slot can hold one tuple


![[page-format.png]]
```
Page
--------------------------------
Slot1 | Slot2 | Slot3 | Slot4
--------------------------------
```


Insertion: find empty slot
	insert tuple

Deletion: mark slot empty

RID: (PageID, SlotNb)

Problem: RID would change


#### Slot Directory

RID: (PageID, SlotID)

Each slot contains <record offset, record length>


![[slot-directory.png|697]]

```
Page
---------------------------------
Header
Slot Directory
Free Space
Records (stored from end)
```



## Record formats

### Fixed Length

Each field has a fixed length (i.e. it has the same length in all the records)


![[fixed-length-record.png|697]]


Information about field lengths and types is in the catalog


### Variable Length

![[variable-length-record.png|697]]



## Heap Files

unordered collection of pages storing tuples
the simplest data storage


Design 1

![[heap-file-1.png|661]]


insert: scan pages until free space


Design 2

![[heap-file-2.png|554]]

separate pages into:
	full pages
		pages with free space


Design 3

![[heap-file-3.png|636]]


insert:
1. check directory
2. find page with enough space
3. insert



## Buffer Manager

- brings pages in from memory and caches them
- eviction policies
	- random page
	- LRU
	- the "clock" algorithm
- keep track of which pages are dirty
	- a dirty page has changes not reflected on disk
	- implementation: each page includes a dirty bit
	

![[buffer-manager.png|632]]