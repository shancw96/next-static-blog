---
title: MySQL-handbook
categories: [数据库]
tags: [database, mysql]
toc: true
date: 2022/8/1
---

这篇文章覆盖了 mysql 的常用知识，比如常用的语句 Select,Where ，常用的操作符 IN,BETWEEN, AND...常用的连接如 Inner Join, Self Join, 等等等。。。

这篇文章是[YouTube: MySQL Tutorial for Beginner - Programming with Mosh](https://www.youtube.com/watch?v=7S_tz1z_5bA&list=WL&index=6&t=1881s&ab_channel=ProgrammingwithMosh)的笔记

<!-- more -->

# The SELECT Clause

## 筛选出特定的行

```sql
-- first_name, last_name 是表名对应的数据项,
select first_name, last_name
from customers
```

## 数学（加减乘除）计算 和 as 别名使用

```sql
select
  last_name,
  first_name,
  points,
  (points + 10) * 100 as 'discount factor'
from customers
```

## select 去重 - distinct

```sql
select state from customer;
-- VA VA CO FL TX
```

```sql
select distinct state from customer;
-- VA CO FL TX
```

## 练习：

返回数据库中所有的商品并标上打 9 折的价格

```sql
-- return all products
-- name
-- unit price
-- new price

select
  name,
  unit_price,
  unit_price * 1.1 as new_price
from product
```

# The WHERE Clause

mysql 的字符检索策略: utf8_general_ci 是不区分大小的,也就是说下面两个语法相同

```sql
select * from user where username = 'admin' and password = 'admin'
-- ==
select * from user where username = 'ADMIN' and password = 'Admin'
```

解决方法： https://blog.csdn.net/Veir_123/article/details/73730751

## 运算符

```sql
-- 大于/小于
-- > , >= , < <=,

-- 不等于
select * from Customer where state != 'va'
select * from Customer where state <> 'va'
-- !==, <>
```

## 多条件查询

## The AND, OR, and NOT Operators

and 并且： 找出出生年月在 1990/01/01 之后的并且 分数大于 1000

```sql
select * from customer
where birth_data > '1990-01-01' and points > 1000;
```

NOT 非 找出出生年月在 1990/01/01 之后, 分数不小于等于 1000 的人

```sql
select * from customer
where birth_data > '1990/01/01' not point <= 1000
```

我们可以使用 （）来提升优先级
注意：and 优先级是高于 OR 的，我们为了方便理解，增加了（）来主动提升优先级

```sql
select * from customer
where birth_data > '1990-01-01'
  OR (points > 1000 AND state = 'VA')

```

练习：

```sql
-- from the order_items table, get the order_items
-- for order #6
-- where the total price is greater than 30

select * from order_items
where order_id = 6 and unit_price * quantity > 30;
```

## The IN Operator

当多个 OR 语句来联合查询，我们可以使用 IN 来代替。
例子：找出在'VA'或者 'FL'或者 'GA'这三个州的顾客

OR

```sql
select *
from customer
where state = 'VA' OR state = 'FL' OR state = 'GA'
```

IN

```sql
select *
from customer
where state IN('VA', 'FL', 'GA')
```

例子：找出不在'VA'或者 'FL'或者 'GA'这三个州的顾客

```sql
select *
from customer
where state NOT IN('VA', 'FL', 'GA')
```

练习：

```sql
-- return product with
--  quantity in stock equal to 49, 38, 72

select *
from products
where quantity_in_stock in(49, 38, 72)
```

## The BETWEEN Operator

在什么之间

AND

```sql
select * from customer
where points >= 1000 AND points <= 3000
```

Between

```sql
select * from customer
where points between 1000 and 3000
```

## The LIKE Operator

模糊查询

- `%`符号代表 0 ～多个字符
  ```sql
  -- 找出所有last_name以admin开头的顾客
  SELECT * from customer where last_name like 'admin%'
  -- 找出所有last_name 包含了admin 的顾客
  SELECT * from customer where last_name like '%admin%'
  ```
- `_`表示 1 个字符
  ```sql
  -- 找出所有last_name 以y结尾，长度为5的 customer
  SELECT * from customer where last_name like '____y'
  ```

练习

```sql
-- get the customer whose
--  addresses contain TRAIL or AVENUE
--  phone numbers end with 9

select * from customer
where (address like '%TRAIL%' OR address like '%AVENUE%')
  and phone_number like '%9';
```

## The REGEXP Operator

正则表达式更加灵活，可以实现和 like 相同的效果

```sql
-- 找出所有last_name以admin开头的顾客
SELECT * from customer where last_name REGEXP '^admin'
-- 找出所有last_name 包含了admin 的顾客
SELECT * from customer where last_name REGEXP 'admin'
-- 找出所有last_name 以admin结尾 的顾客
SELECT * from customer where last_name REGEXP 'admin$'
```

```sql
-- get the customer whose
--  addresses contain TRAIL or AVENUE
select * from customer
where address REGEXP 'TRAIL|AVENUE'
```

## The IS NULL Operator

判断字段是否为 null

```sql
-- 找出手机号为空的用户
select * from customer where phone is null
-- 找出手机号不为空的用户
select * from customer where phone is not null
```

## The ORDER BY Operator

排序: 默认情况下以 id 排序，如果想要改变查询结果的排序规则，需要使用 order by 操作符号，如果想要倒序排，则需要额外加上 DESC

注意： order by 使用的字段是 select 设置的，支持使用 as 别名，进行动态计算，具体参考这块的练习

按照用户的出生日期倒序排列

```sql
select * from customer order by birth_date desc
```

如果用户出生日期相同按照，所在州进行再次排序

```sql
select * from customer
order by birth_data desc, state desc
```

练习： 按照订单 quantity 和 unit_price 构成的总价来排序订单

```sql
select *, quantity * unit_price as total_price
from order_items
where order_id =2
order by total_price desc
```

## The LIMIT Operator

限制数据库返回的 customer 个数

```sql
-- 限制返回的数量为3个

select * from customer limit 3
```

选择 6 条数据后的 3 条数据

```sql
select * from customer limit 6, 3 -- offset 6, pick 3
```

# Join

inner join 练习：https://sqlbolt.com/lesson/select_queries_with_joins

## 基本用法

join 可以实现将多张不同的表的数据关联在一起

```sql
select *
from orders
join customers on customer.customer_id = orders.customer_id
```

- on：两个表是如何关联在一起的, 上述代码表示 通过两边的 customer_id 进行关联

### join 返回 指定 table 下的 column

之间选择 customer_id 会抛出错误，因为 orders 和 customers 都有相同的 customer_id 选项，我们可以通过 customers.customer_id 来指定返回具体 customer_id

```sql
select orders.customer_id
from orders
join customers on customer.customer_id = orders.customer_id
```

### 为表名设置 alias

```sql
select o.customer_id
from orders o
join customers c on c.customer_id = o.customer_id
```

```sql
select p.product_id, product_name, unit_price
from order_items oi
join product p on p.product.product_id = oi.product_id
```

## Self Joins

self join 表示自己和自己 join ，有点像是递归那味，用处如下情景

有个雇员表，包括了雇员的信息和他所属的上级的 id，我们现在要返回 雇员的 id，姓名和他的上级 的名称

employees

| id   | name       | report_to |
| ---- | ---------- | --------- |
| 1    | 雇员 1     | 666       |
| 2    | 雇员 2     | 666       |
| 3    | 雇员 3     | 666       |
| 4    | 雇员 4     | 666       |
| 666  | 市场部经理 | 9527      |
| 11   | 雇员 11    | 777       |
| 22   | 雇员 22    | 777       |
| 33   | 雇员 33    | 777       |
| 44   | 雇员 44    | 777       |
| 777  | 技术部经理 | 9527      |
| 9527 | CEO        | null      |

```sql
select e.id, e.name, m.name as manage
from employees e
join employees m on e.report_to = m.id
```

得到

| id  | name       | manager    |
| --- | ---------- | ---------- |
| 1   | 雇员 1     | 市场部经理 |
| 2   | 雇员 2     | 市场部经理 |
| 3   | 雇员 3     | 市场部经理 |
| 4   | 雇员 4     | 市场部经理 |
| 666 | 市场部经理 | CEO        |
| 11  | 雇员 11    | 技术部经理 |
| 22  | 雇员 22    | 技术部经理 |
| 33  | 雇员 33    | 技术部经理 |
| 44  | 雇员 44    | 技术部经理 |
| 777 | 技术部经理 | CEO        |

## Joining Multiple Tables

table1: orders

| id  | name        | customer_id | status |
| --- | ----------- | ----------- | ------ |
| 1   | zlaorlaz_qe | 1           | 1      |

table2: customers

| id  | name   |
| --- | ------ |
| 1   | shancw |

table3: order_statuses

| id  | name      |
| --- | --------- |
| 1   | processed |
| 2   | shipped   |
| 3   | Delivered |

需要的效果

| id  | name        | customer_name | status    |
| --- | ----------- | ------------- | --------- |
| 1   | zlaorlaz_qe | shancw        | processed |

```sql
select o.id, o.name, c.customer_name as customer_name, os.name as status
from orders o
join customers c
  on o.customer_id = customers.id
join order_statuses os
  on o.status = order_statuses.id
```

## Compound Join Conditions

对于主键不止一个的情况，如果需要使用 join，那么需要额外使用 AND 操作

```sql
select * from order_items oi
join order_item_notes oin
  on oi.order_id = oin.order_id
  and oi.product_id = oin.product_id
```

## Implicit Join Syntax

使用 where 关键字实现 join，不推荐使用

```sql
select *
from orders o
join customers c
  on o.customer_id = c.customer_id

-- Implpicit Join Syntax
select *
from orders o, customers c
where o.customer_id = c.customer_id
```

## Outer Joins

### 基础使用

我们上面的所有 join 都是 inner join，我们使用个简单的例子来说明 order join 和 inner join 的区别

order:

| id  | name |
| --- | ---- |
| 1   | 进贡 |

customer:

| id  | name   | order_id |
| --- | ------ | -------- |
| 1   | shancw | 1        |
| 2   | john   | null     |

#### inner join

```sql
select order.id order.name as order_name customer.name as customer_name
from customer
join order
  on customer.order_id = order.id
```

得到:

| id  | order_name | customer_name |
| --- | ---------- | ------------- |
| 1   | 进贡       | shancw        |

因为我们的 on 是一个条件判断，只有带有 order_id 的 customer 才会被匹配出来

#### outer join

outer join 有两种，left join 和 right join

left join

保留左侧的所有行数据，即使没有正确匹配

```sql
select order.id order.name as order_name customer.name as customer_name
from customer
left join order
  on customer.order_id = order.id
```

保留右侧的所有行数据，即使没有正确匹配

right join

```sql
select order.id order.name as order_name customer.name as customer_name
from customer
left join order
  on customer.order_id = order.id
```

得到:

| id  | order_name | customer_name |
| --- | ---------- | ------------- |
| 1   | 进贡       | shancw        |
| 2   | null       | john          |

## The USING Clause

USING 语句是对 on 的一种简化，如果两个 table 的比较字段相同，那么可以用 USING 代替

```sql
select
  o.order_id,
  c.first_name
from orders o
join customers c
  -- on o.customer_id = c.customer_id
  USING (customer_id)
```

## Cross Joins

笛卡尔乘积, 将所有可能性相乘

table1 : a, b, c, d, e
table2 : A, B, C, D, E

cross join table: aA,aB,aC,aD,aE, ...., eA,eB,eC,eD,eE
![cross join pic](https://www.w3resource.com/w3r_images/cross-join-round.png)

```sql
select xxx, yyy
from table1
cross join table2

```

# Unions

UNION 操作符用于连接两个以上的 SELECT 语句的结果组合到一个结果集合中

```sql
SELECT expression1, expression2, ... expression_n
FROM tables
[WHERE conditions]
UNION [ALL | DISTINCT]
SELECT expression1, expression2, ... expression_n
FROM tables
[WHERE conditions];
```

# Inserting

新增数据

## Inserting a Single Row

```sql
insert into customers (
  first_name,
  last_name,
  phone,
  address
)
-- first_name, last_name, phone, address
values (
  'John',
  'Smith',
  188888888888,
  'New York'
)
```

## Inserting Multiple Rows

```sql
insert into customers (first_name)
-- first_name, last_name, phone, address
values ('John')
values ('Arche')
```

# Updating

UPDATE 语句

## Updating a Single Row

```sql
update invoices
set payment_total = invoice_total * 0.5, payment_data = due_date
where client_id = 3; -- 更新client_id 为3 或者是4
```

## Updating Multiple Rows

IN 操作符号

```sql
update invoices
set payment_total = invoice_total * 0.5, payment_data = due_date
where client_id in (3, 4); -- 更新client_id 为3 或者是4
```

# Using Subqueries in Updates

子表达式

```sql
update invoices
set payment_total = invoice_total * 0.5, payment_data = d(ue_date
where client_id in (
  select client_id
  from clients
  where state in ('CA', 'NY')
)
```

# Deleting Rows

```sql
delete from invoices
where client_id in (
  select client_id from clients
  where name = "Myworks"
)
```
