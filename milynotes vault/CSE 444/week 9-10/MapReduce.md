---
order: 12
---

Data Storage: GFS/HDFS

MapReduce job input is a file
Distributed file system:
- GFS: Google File System
- HDFS: Hadoop File System

File is split into “blocks” or “chunks”
Blocks are replicated & stored on random machines
Files are append only


A file = a bag of (key, value) pairs 
A MapReduce program:
Input: a bag of (inputkey, value)pairs
Output: a bag of (outputkey, value)pairs


#### Step 1 : the MAP phase

User provides the MAP-function:
- Input: (input key, value)
- Ouput: bag of (intermediate key, value)
System applies map function in parallel to all (input key, value) pairs in the input file


####  Step 2: the REDUCE Phase

User provides the REDUCE function:
- Input: (intermediate key, bag of values)
- Output:
	- Original MR paper: bag of output (values)
	- Hadoop: bag of (output key, values)
System groups all pairs with the same intermediate key, and passes the bag of values to REDUCE


![[mapreduce.png|527]]



## Workers 

A worker is a process that executes one task at a time
Typically there is one worker per processor
Often talk about “slots”


![[parallelmapreduce.png|561]]


#### MapReduce Implementation

- There is one master node
- Input file gets partitioned further into M’ splits
- Each split is a contiguous piece of the input file
- By default splits correspond to blocks
- Master assigns workers (=servers) to the M’ map tasks, keeps track of their progress
- Workers write their output to local disk
- Output of each map task is partitioned into R regions
- Master assigns workers to the R reduce tasks
- Reduce workers read regions from the map workers’ local disks

