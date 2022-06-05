---
title: JPA：从一个关系中删除child 或者 parent 的注意事项
categories: [后端]
tags: [JPA]
toc: true
date: 2021/7/5
---

JPA 如果有 cascade 关系存在，需要从维护方进行删除，如果从被维护方直接删除，删除命令会被忽略

<!--  -->

例子：

Relationships :

```js

PanCard-->Employee (Ono To One)

Employee-->ProjectManger (bi-directional many-to-one association to Employee)

Projects -->ProjectManager(bi-directional many-to-one association to Projects)
```

员工卡和员工一一对应，员工和经理属于多对一关系（员工维护关系），项目和项目经理属于多对一关系（项目维护关系）

![](/images/hibernate/jpa-example-1.jpeg)

对应实体如下

PanCard

```java
@OneToOne(cascade=CascadeType.ALL,fetch=FetchType.EAGER)
@JoinColumn(name="EId")
private Employee employee;
```

Employee.java

```java
@ManyToOne(cascade=CascadeType.ALL, fetch=FetchType.EAGER)
@JoinColumn(name="pmId")
private ProjectManager projectManager;
```

ProjectManager.java

```java
@OneToMany(mappedBy="projectManager",cascade = CascadeType.ALL)
private List<Employee> employee;

@OneToMany(mappedBy="projectManager",cascade = CascadeType.ALL)
private List<Projects> projects;

```

Projects.java

```java
@ManyToOne(cascade=CascadeType.ALL, fetch=FetchType.EAGER)
@JoinColumn(name="pmId")
private ProjectManager projectManager;
```

复现问题：

- 如果我想删除 PanCard，那么我首先得删除 ProjectManager，因为 Employee 有外键存在。
- 如果我想删除 ProjectManager，它应该删除 Employee 和 Projects，但是 Employee 和 PanCard 存在一对一的关系，所以它无法删除。

* 如果我想删除 project，他应该删除 ProjectManager，但是 ProjectManager 和 Employee 是多对一的关系，因此无法删除

**我想要执行删除，要从哪开始删除？**

解决：

在 JPA 中，如果删除操作存在约束冲突，可以进行从维护关系的一方进行删除 （mappedBy xxx）

比如上面的例子：

- PanCard <---> Employee，PanCard 是关系的维护者
- Employee <----> ProjectManager Employee 是关系的维护者

* Project <----> ProjectManger，Project 是关系的维护者

使用 cascade 的最佳实践：不要在 many 侧使用 cascade，因为这会导致约束冲突。

如果删除 Employee，那么 ProjectManager 会被级联删除。因为一个 manager 可以有多个 employee，那么这么删除会产生外键冲突。因此，需要将 Employee 和 ProjectManager 的 CascadeType.REMOVE 给去掉。
