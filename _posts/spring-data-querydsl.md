---
title: JPA with QueryDsl
categories: [后端]
tags: [database, ORM, JPA]
toc: true
date: 2021/4/25
---

这篇文章包括了 queryDsl - JPA 的常用功能。

<!-- more -->

使用 queryDsl 在 JPA 中查询的通用模版

```java
QCustomer customer = =QCustomer.customer;
queryFactory.selectFrom(customer)
  .where(...)
  .fetch();
```

- QCustomer: 配置 querydsl 后，自动生成的查询实体
- queryFactory: JPAQueryFactory 实例。一般通过@Bean 全局配置
  ```java
    @Configuration
    public class JpaQueryConfig {
        @Bean
        public JPAQueryFactory jpaQuery(EntityManager entityManager) {
            return new JPAQueryFactory(entityManager);
        }
    }
  ```

# 使用

## 基础使用例子

- 查询 firstName 是 Bob 的顾客
  ```java
    QCustomer customer = QCustomer.customer;
    Customer bob = queryFactory.selectFrom(customer)
      .where(customer.name.eq("Bob"))
      .fetchOne();
  ```
- 多表查询
  ```java
    QCustomer customer = QCustomer.customer;
    QCompany company = QCompany.company;
    query.from(customer, company);
  ```
- 多条件过滤
  ```java
    // ***************and***************
    // version1
    queryFactory.selectFrom(customer)
      .where(customer.firstName.eq("Bob"), customer.lastName.eq("Wilson"));
    // version2 use and
    queryFactory.selectFrom(customer)
      .where(customer.firstName.eq("Bob").and(customer.lastName.eq("Wilson")))
    // **************or ****************
    queryFactory.selectFrom(customer)
      .where(customer.firstName.eq("Bob").or(customer.lastName.eq("Wilson")))
  ```
- Join: 不是太理解
  http://www.querydsl.com/static/querydsl/4.4.0/reference/html_single/#d0e307

  ```java
  QCat cat = QCat.cat;
  QCat mate = new QCat("mate");
  QCate kitten = new QCat("kitten");
  query.from(cat)
      .innerJoin(cat.mate, mate)
      .leftJoin(cat.kitten, kitten)
      .list(cat);
  // ... jpql
  from Cat as cat
  inner join cat.mate as mate
  left outer join cat.kitten as kitten

  query.from(cat)
    .leftJoin(cat.kittens, kitten)
    .on(kitten.bodyWeight.gt(10.0))
    .list(cat);
  from Cat as cat
    left join cat.kittens as kitten
    on kitten.bodyWeight > 10.0
  ```

* Ordering 排序
  ```java
    QCustomer customer = QCustomer.customer;
    queryFactory.selectFrom(customer)
      .orderBy(customer.lastName.asc(), customer.firstName.desc)
      .fetch()
  ```
* grouping 分组
  ```java
    queryFactory.select(customer.lastName).from(customer)
      .groupBy(customer.lastName)
      .fetch();
  ```

- 删除 delete-where-execute
  ```java
    queryFactory
      .delete(customer)
      .where(customer.name.eq("Bob"))
      .execute();
  ```
- 更新 update-set/where-execute
  ```java
    queryFactory.update(customer)
      .where(customer.name.eq("Bob"))
      .set(customer.name, "Bobby")
      .execute();
  ```
- subQuery 嵌套查询: JPAExpression

  ```java
    QDepartment department = QDepartment.department
    QDepartment d = new QDepartment("d")
      .where(department.size.eq(
        JPAExpression.select(d.size.max().find(d))
      ))
      .fetch();
  ```

- 自定义组合查询 (tune)
  ```java
    Query jpaQuery = queryFactory.selectFrom(employee).createQuery();
    // ... custom query
    List results = jpaQuery.getResultList();
  ```

* 复杂断言操作

  为了实现复杂的条件判断，可以使用 BooleanBuilder 类，它拓展自 Predicate 接口

  ```java
    public List<Customer> getCustomer(String... names) {
      QCustomer customer = QCustomer.customer;
      JAPQuery<Customer> query = queryFactory.selectFrom(Customer);
      BooleanBuilder builder = new BooleanBuilder();
      for(String name: names) {
        builder.or(customer.name.eq(name));
      }
      query.where(builder);// customer.name eq name1 Or customer.name eq name2 Or ...
      return query.fetch();
    }
  ```

## queryDsl 实现分页

### 为 repository 增加 QuerydslPredicateExecutor 实现

```java
public interface ArticleRepository extends
  CrudRepository<Comment, Long>,
  QuerydslPredicateExecutor<Article>,
  {}
```

### controller

```java
 @GetMapping("/query")
  public Page<Article> queryAllArtilce(Pageable page, @RequestParam(required = false) String query) {
    return articleService.findAll(page, query);
  }
```

### service

```java
// 文章列表模糊查询 + 分页
public Page<Article> findAll(Pageable pageable, String query) {
    QArticle articleModel = QArticle.article;
    BooleanBuilder booleanBuilder = new BooleanBuilder();
    if (StringUtils.isNotEmpty(query)) {
        booleanBuilder.and(articleModel.content.likeIgnoreCase("%" + query + "%"));
    };
    // Page<T> findAll(Predicate predicate, Pageable pageable);
    return articleRepository.findAll(booleanBuilder, pageable);
}
```

## BooleanBuilder 是什么？

BooleanBuilder 用于构建 Predicate 表达式。和 StringBuilder 类似，StringBuilder 生成 String 类型，BooleanBuilder 生成 Predicate 类型数据

```java
public final class BooleanBuilder extends Object implements Predicate, Cloneable {}
```

常用的方法:
and，or，not

剩余可选方法:
orNot, orAllOf,andNot, andAnyOf
