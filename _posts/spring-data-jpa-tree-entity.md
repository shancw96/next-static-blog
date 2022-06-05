---
title: 「spring data jpa」实现tree 结构
categories: [后端]
tags: [Spring Boot, jpa, ORM, database]
toc: true
date: 2021/05/01
---

这篇文章介绍了 JPA 实现树结构实体的方式。

比如文章评论功能。一条评论可以有多条回复。这条回复可能会有其他的回复

```java
-- commentA
  -- commentB: replay to commentA
    -- commentC: replay to commentB
```

<!-- more -->

# entity 设计

子 comment 和 父 comment 之间属于一对多的关系, 多条子 comment 只能对应一条父 comment。而一条父 comment 可以对应多条子 Comment

## 一对多关系设计

```java
@Entity
public class Comment extends Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    // 内容
    private String content;

    // 父节点
    @ManyToOne
    private Comment parent;

    // 子节点 This is the other side of the relationship defined by the parent field
    @OneToMany(mappedBy = "parent")
    private List<Comment> childComment;
}
```

上述结构，生成的效果如下

| id  | content | parent_id |
| --- | ------- | --------- |
| 1   | xxx     | null      |
| 2   | xxx     | 1         |
| 3   | xxx     | 1         |
| 4   | xxx     | 3         |

## 解决环引用

虽然我们正确定义了实体结构，但是从一个对象的角度看待这个 Comment，它是存在环引用的，这会导致在序列化和反序列化的时候无限递归下去。

对于这个 Comment 对象，parent 会包含 childComment,而 childComment 还会包含 parent，这就是一个环。那么我们只需要屏蔽 parent 内部的 childComment 和 comment 即可解决环引用

**@JsonIgnoreProperties**: 在序列化和反序列化的时候，忽略掉对象内部的特定属性或者方法。

**@JsonIgnore 的作用**: 在序列化和反序列化的时候，忽略掉当前被标注的属性或者方法。

## 删除父节点，自动删除关联节点

orphanRemoval: 删除 parent 实体，导致 child 实体成了孤儿，将会被一起删除。

## 最终 entity

```java
@Entity
public class Comment extends Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    // 内容
    private String content;

    // 父节点
    @ManyToOne
    @JsonIgnoreProperties({"childComment", "parent"})
    private Comment parent;

    // 子节点
    @OneToMany(mappedBy = "parent",  orphanRemoval = true)
    private List<Comment> childComment;
}
```

实体序列化后返回的 Comment 格式如下

```json
{
  "id": 21,
  "content": "评论",
  "parent": null,
  "childComment": [
    {
      "id": 22,
      "content": "评论",
      "parent": {
        "id": 21,
        "content": "评论"
      },
      "childComment": [
        {
          "id": 23,
          "content": "评论",
          "parent": {
            "id": 22,
            "content": "评论"
          },
          "childComment": [
            {
              "id": 24,
              "content": "评论",
              "parent": {
                "id": 23,
                "content": "评论"
              },
              "childComment": []
            }
          ]
        }
      ]
    }
  ]
}
```

# 组装数据

如上的 Comment 格式，已经是合格的树节点，当 Comment 的 parent_id 为 null，那么它就是一颗完整的树。所以对于 comment 列表我们只需要将 parent_id 为 null 的全部查询出来即可

```json
[
  {
    "id": 21,
    "content": "评论",
    "parent": null,
    "childComment": [...]
  },
  // ...
  {
    "id": 22,
    "content": "评论",
    "parent": null,
    "childComment": [...]
  }
]
```

## queryDsl 查询

```java
public List<Comment> findByArticleId(Long articleId) {
    QComment commentModel = QComment.comment;
    BooleanBuilder query = new BooleanBuilder();
    query.and(commentModel.article.id.eq(articleId)).and(commentModel.parent.id.isNull());
    return (List<Comment>)commentRepository.findAll(query);
}
```

# 更多阅读

- 手动组装扁平树结构：[数组转树](https://blog.shancw.net/2021/01/11/util-%E6%95%B0%E7%BB%84%E8%BD%AC%E6%A0%91/)

- [stackOverflow: How does JPA orphanRemoval=true differ from the ON DELETE CASCADE DML clause](https://stackoverflow.com/questions/4329577/how-does-jpa-orphanremoval-true-differ-from-the-on-delete-cascade-dml-clause)

- [Oracle: Orphan Removal in Relationships](https://docs.oracle.com/cd/E19798-01/821-1841/giqxy/)
