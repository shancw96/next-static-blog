---
title: python learn
categories: [python]
tags: []
toc: true
date: 2022/5/4
---

兴趣爱好，学点 python 用来写算法

资源：

w3schools: https://www.w3schools.com/python/python_conditions.asp

pythoncheatsheet: https://www.pythoncheatsheet.org/#Python-Basics

<!-- more -->

## Loop

The provided code stub reads and integer, ,n from STDIN. For all non-negative integers i<n, print n^2.

```python
print(*[num**2 for num in range(n)], sep='\n')
```

知识点

- arbitrary argument list.

类似于 js 的解构赋值 `...[argument]`

```python
>>> def concat(*args, sep="/"):
...     return sep.join(args)
...
>>> concat("earth", "mars", "venus")
'earth/mars/venus'
>>> concat("earth", "mars", "venus", sep=".")
'earth.mars.venus'
```

- list comprehension

  实现 map 的效果

  ```python
  def myfunc(n):
    return len(n)

  x = map(myfunc, ('apple', 'banana', 'cherry'))
  ```

  ```python
  >>> doubled_odds = map(lambda n: n * 2, filter(lambda n: n % 2 == 1, numbers))
  >>> doubled_odds = [n * 2 for n in numbers if n % 2 == 1]
  ```

## Operators

https://www.w3schools.com/python/python_operators.asp

重要的几个记录

逻辑操作符

| Operator | Description                                             | Example               | Try it                                                                                 |
| :------- | :------------------------------------------------------ | :-------------------- | :------------------------------------------------------------------------------------- |
| and      | Returns True if both statements are true                | x < 5 and x < 10      | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_oper_logical1) |
| or       | Returns True if one of the statements is true           | x < 5 or x < 4        | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_oper_logical2) |
| not      | Reverse the result, returns False if the result is true | not(x < 5 and x < 10) | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_oper_logical3) |

相等判断

| Operator | Description                                            | Example    | Try it                                                                                  |
| :------- | :----------------------------------------------------- | :--------- | :-------------------------------------------------------------------------------------- |
| is       | Returns True if both variables are the same object     | x is y     | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_oper_identity1) |
| is not   | Returns True if both variables are not the same object | x is not y | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_oper_identity2) |

属于性判断

| Operator | Description                                                                      | Example    | Try it                                                                                    |
| :------- | :------------------------------------------------------------------------------- | :--------- | :---------------------------------------------------------------------------------------- |
| in       | Returns True if a sequence with the specified value is present in the object     | x in y     | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_oper_membership1) |
| not in   | Returns True if a sequence with the specified value is not present in the object | x not in y | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_oper_membership2) |

算数运算

| Operator | Name                        | Example           | Try it                                                                                 |
| :------- | :-------------------------- | :---------------- | :------------------------------------------------------------------------------------- |
| /        | Division                    | 13/3 = 4.333      | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_oper_div)      |
| %        | Modulus 取余                | 13%3 = 4.333      | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_oper_mod)      |
| \*\*     | Exponentiation 次方         | 13\*\*2 == 13\*13 | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_oper_exp)      |
| //       | Floor division 向下取整除法 | 13/3 = 4          | [Try it »](https://www.w3schools.com/python/trypython.asp?filename=demo_oper_floordiv) |
