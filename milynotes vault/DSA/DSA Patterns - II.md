---
order: 4
---

### Prefix Sum

If the sum of the subarray from index `i` to `j` is `k`, and:
```
prefixSum(j) - prefixSum(i-1) = k
```
then
```
prefixSum(i-1) = prefixSum(j) - k
```


### Backtracking

i.e. [#22](https://leetcode.com/problems/generate-parentheses/?envType=problem-list-v2&envId=plakya4j)
```
def generateParenthesis(self, n: int) -> List[str]:
    stack = []
    res = []

    def backTrack(openN, closeN):
        if openN == closeN == n:
            res.append(''.join(stack))
            return
            
        if openN < n:
            stack.append("(")
            backTrack(openN+1, closeN)
            stack.pop()
            
        if closeN < openN:
            stack.append(")")
            backTrack(openN, closeN+1)
            stack.pop()
            
    backTrack(0, 0)
    return res
```


### Graphs