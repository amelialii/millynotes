---
order: 6
---

## Query Optimizer

three components:
- cost estimation
	- cardinality estimation $T(R)$ each immediate result
	- cost = CPU + I/O + Network, all dependent on $T(R)$
- search space
	- which plans do we consider?
- search algorithm
	- how do we search the space?



for each operator, cost is function of CPU, IO, network bw
	$total\_cost = CPUCost + w_{IO}IOCost + w_{BW}BWCost$
cost of plan is total for all operators


![[queryoptimizationsummary.png|531]]


Eg. $Cost(V \bowtie T) = 3B(V) + 3B(T)$
$B(V) = T(V)$ / PageSize
$T(V) = T(\sigma(R) \bowtie S)$



## Database Statistics

- collect statistical summary of stored data
- estimate size (= cardinality) is a bottom-up fashion
- estimate cost by using the estimated size



- $T(R)$ number of tuples (cardinality)
- $V(R, a)$ indexes, number of keys in the index 
- $B(R)$ number of physical pages 
- statistical information on attributes
	- min value, max value, $V(R, a)$
- histograms



## Size Estimation Problem

- each condition reduces the size of by some factor, called **selectivity factor**
- assuming independence, multiply the selectivity factors


```
T(Q) = T(R₁) × T(R₂) × ... × T(Rₙ) × s₁ × s₂ × ... × sₖ
       └─────── tables ──────┘     └── conditions ──┘
```

1. **Multiply all the table sizes together** — this gives you the Cartesian product (every possible combination of tuples from every table)
2. **Multiply by each selectivity factor** — each WHERE condition shrinks the result


- $A = c$
		selectivity = $\frac{1}{V(R, A)}$
- $A < c$
		selectivity = $\frac{c - Low(R, A)}{High(R, A) - Low(R, A)}$
- $A = B$
		selectivity = $\frac{1}{max(V(R,A), V(S, B))}$


#### assumptions

- containment of values: if $V(R, A) \le V(S, B)$, then all values $R.A$ occur in $S.B$
- preservation of values: for any other attribute $C$, $V(R \bowtie_{A = B} S, C) = V(R < C)$ (or $V(S, C)$)



## Compute the Cost of a Plan

step 1: estimate cardinality in a bottom-up fashion
step 2: estimate cost by using the estimated cardinalities


plan 1
![[physicalplan1.png|514]]


plan 2
![[physicalplan2.png|513]]


plan 3
![[physicalplan3.png|508]]



## Histograms

![[employeehistogram.png|499]]


types of histograms
- eqwidth
- eqdepth
- v-optimal: minimize error