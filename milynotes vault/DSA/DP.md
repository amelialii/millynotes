---
order: 2
---

## Top 5 Dynamic Programming Patterns for Coding Interviews

DP: method for solving problems by breaking them down into smaller overlapping sub problems, solving each subproblem once, and storing the results to avoid redundant computation


### 1. Fibonacci Numbers

- 1-dimensional size of n problem
- only care about the last 2 computed values

recursion:
```
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
```
Time: $O(2^N)$

bottom-up:
```
def fib(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
```
Time: $O(N)$


### 2. Zero / One Knapsack

each item can either be taken once (1) or not at all (0)

i.e. [#494](https://leetcode.com/problems/target-sum/description/)
```
def findTargetSumWays(self, nums: List[int], target: int) -> int:
    dp = {}
        
    def backtrack(i, total):
        if i == len(nums):
            return 1 if total == target else 0
        if (i, total) in dp:
            return dp[(i, total)]
            
        dp[(i, total)] = backtrack(i+1, total+nums[i]) +
					    backtrack(i+1, total-nums[i])

        return dp[(i, total)]
        
    return backtrack(0, 0)
```


### 3. Unbounded Knapsack

still want to sum up to target value, but use each item as many times as you want

i.e. [#322](https://leetcode.com/problems/coin-change/description/)
```
def coinChange(self, coins: List[int], amount: int) -> int:
    dp = [amount+1] * (amount + 1)
    dp[0] = 0

    for a in range (1, amount+1):
        for coin in coins:
            if a - coin >= 0:
                dp[a] = min(dp[a], 1+dp[a-coin])
        
    return dp[amount] if dp[amount] != amount+1 else -1
```


### 4. Longest Common Subsequence

i.e. [#1143](https://leetcode.com/problems/longest-common-subsequence/description/)
```
def longestCommonSubsequence(self, text1: str, text2: str) -> int:
    dp = [[0 for j in range(len(text2)+1)] for i in range(len(text1)+1)]

    for i in range(len(text1)-1, -1, -1):
        for j in range(len(text2)-1, -1, -1):
            if text1[i] == text2[j]:
                dp[i][j] = 1 + dp[i+1][j+1]
            else:
                dp[i][j] = max(dp[i+1][j], dp[i][j+1])

    return dp[0][0]
```


### 5. Palindromes

i.e. [#5](https://leetcode.com/problems/longest-palindromic-substring/description/)
```
def longestPalindrome(self, s: str) -> str:
        
    res = ''
    resLen = 0

    for i in range(len(s)):
        l, r = i, i
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if (r - l + 1) > resLen:
                resLen = r - l + 1
                res = s[l:r+1]
            l -= 1
            r += 1

        l, r = i, i+1
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if (r - l + 1) > resLen:
                resLen = r - l + 1
                res = s[l:r+1]
            l -= 1
            r += 1

    return res
```


**Source:** [Top 5 Dynamic Programming Patterns for Coding Interviews](https://www.youtube.com/watch?v=mBNrRy2_hVs) (NeetCode)