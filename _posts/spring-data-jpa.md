---
title: 【长期更新】spring-data-jpa 使用
categories: [后端]
tags: [database, ORM]
toc: true
date: 2021/3/8
---

JPA 允许开发者直接和 java 对象交互，而不是通过 SQL 语句。

java 对象与 数据库表的相互映射 叫做 对象关系映射(ORM - object relational mapping)。JPA 是 ORM 框架的一种规范。通过 JPA，开发者能够从数据库数据映射，存储，更新，恢复数据。

JPA 是一种规范，它有几种实现方式: [Hibernate](https://hibernate.org/)，EclipseLink and Apache OpenJPA

> 译者注: EclipseLink and Apache OpenJPA 现在已经处于淘汰状态

<!-- more -->

## QUICK GUIDE

### Entity 实体

一个应该被数据库保存的类，它必须通过 `javax.persistence.Entity`进行注解，一张表对应一个实体。

所有的实体类必须定义一个主键，并且有一个<u>无参数的构造方法</u>或者不是 final 修饰的类。

> [hibernate 为什么持久化类时必须提供一个不带参数的默认构造函数](https://www.cnblogs.com/langjunnan/p/6035188.html)
> 因为 hibernate 框架会调用这个默认构造方法来构造实例对象。。
> 即 Class 类的 newInstance 方法 这个方法就是通过调用默认构造方法来创建实例对象的 ，
> 另外再提醒一点，如果你没有提供任何构造方法，虚拟机会自动提供默认构造方法（无参构造器），
> 但是如果你提供了其他有参数的构造方法的话，虚拟机就不再为你提供默认构造方法，这时必须手动把无参构造器写在代码里

通过@GeneratedValue 能够在数据库中自动生成主键

默认情况下，类名对应表名，通过`@Table(name="NEWTABLENAME")`能够指定表名

### 字段持久性

Entity 实体的字段将会保存在数据库中，JPA 既可以使用你的实例变量也可以使用对应的 getters，setters 来访问字段。但是不能混合两种方式，如果要使用 setter 和 getter 方法，则 Java 类必须遵循 Java Bean 命名约定。JPA 默认会保留实体的所有字段，**如果想要某一个字段不被保存，那么需要通过`@Transient` 标记**

| annotation      | description                         |
| --------------- | ----------------------------------- |
| @Id             | 实体的唯一标识                      |
| @GeneratedValue | 与实体的 ID 一起使用，表示自动生成. |
| @Transient      | Field will not be saved in database |

### CrudRepository Interface

CrudRepository 接口为 entity class 提供了最基础的 CRUD 功能。

```java
public interface CrudRepository<T, ID> extends Repository<T, ID> {
    // 保存单个
    <S extends T> S save(S var1);
    // 保存多个
    <S extends T> Iterable<S> saveAll(Iterable<S> var1);
    // 根据Id 查找
    Optional<T> findById(ID var1);
    // 判断是否存在
    boolean existsById(ID var1);
    // 获取所有
    Iterable<T> findAll();
    // id List 查找
    Iterable<T> findAllById(Iterable<ID> var1);
    // 获取保存的数量
    long count();
    // 根据ID 删除
    void deleteById(ID var1);
    // 根据实体删除
    void delete(T var1);
    // 根据实体集合删除
    void deleteAll(Iterable<? extends T> var1);

    void deleteAll();
}
```

### JpaRepository Interface

JpaRepository 和 CrudRepository 的关系:

`JpaRepository extends PagingAndSortingRepository, QueryByExampleExecutor`

`PagingAndSortingRepository extends CrudRepository`

JpaRepository 继承了分页接口，而分页接口继承了 Crud 接口。因此 JpaRepository 功能更加强大, 一般项目首选。

## 关系映射

JPA 可以定义类与类之间的映射，对应的 annotation 如下

- @OneToOne 一对一
- @OneToMany 一对多
- @ManyToOne 多对一
- @ManyToMany 多对多

### oneToMany

学生和笔记本的关系:

1. 一个学生可以有多个笔记本
2. 一个笔记本只能对应一个学生

```java
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rollno;

    private String name;

    private int marks;

    @OneToMany
    private List<Laptop> laptop = new ArrayList<>();
}

@Entity
public class Laptop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lid;

    private String lname;
}
```

生成的 ER 图如下，此时会产生一个中间表 student_laptop，用于关联。
![](/images/hibernate/oneToMany.png)

如果不想生成中间表，将 student 的 id 交给 laptop 来维护，则可以使用 mappedBy 或者是 Join Column。

#### mappedBy

使用 mappedBy 将当前的 student 映射到每一台 laptop 上。

mappedBy 用于指定具有双向关系的两个实体中，哪个负责管理双方管理。如下代码，由 laptop 管理 student<->laptop 之间的关系，laptop 表中将会多处 student_id 这个外键指向 Student 表 id

```java
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rollno;

    private String name;

    private int marks;

    // laptop 这个实体被它的student属性所管理
    @OneToMany(mappedBy="student")
    private List<Laptop> laptop = new ArrayList<>();
}
@Entity
public class Laptop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lid;

    private String lname;
    @ManyToOne
    private Student student;
}
```

![](/images/hibernate/oneToMany-mappedBy.png)

#### JoinColumn

[JoinColumn API Doc](https://docs.oracle.com/javaee/6/api/javax/persistence/JoinColumn.html)

@JoinColumn

> Specifies a column for joining an entity association or element collection

用于定义外键，JoinColumn 可选的配置字段如下

| type             | description                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| java.lang.String | _referencedColumnName_ 引用表对应的字段 [详细解释](https://blog.csdn.net/Xu_JL1997/article/details/103018249) |
| java.lang.String | _name_ (Optional) 外键名称.                                                                                   |
| java.lang.String | _columnDefinition_ (Optional) SQL 语句，用于定义某一个 Column 的属性                                          |
| boolean          | _insertable_ (Optional) 是否可插入.                                                                           |
| boolean          | _nullable_ (Optional) 外键是否可以为空.                                                                       |
| java.lang.String | _table_ (Optional) 外键所属的表名                                                                             |
| boolean          | _unique_ (Optional) 是否是唯一值                                                                              |
| boolean          | _updatable_ (Optional) JPA 更新操作是否包含当前行.                                                            |

使用 JoinColumn 将当前 Laptop 关联到 student

```java
@Entity
public class Laptop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lid;
    private String lname;

    @ManyToOne
    @JoinColumn(name="rollno")
    private Student student;
}
```

### ManyToMany

多对多必须要借助中间表实现，如果不使用 mappedBy 会生成两个中间表`laptop_student`和 `student_laptop`
![](/images/hibernate/manyToMany2.png)

使用了 mappedBy 后，则只需要维护一个中间表,代码如下

```java
@Getter
@Setter
@Accessors
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rollno;

    private String name;

    private int marks;

    @ManyToMany(mappedBy = "student")
    private List<Laptop> laptop = new ArrayList<>();
}

@Getter
@Setter
@Accessors
@Entity
public class Laptop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lid;

    private String lname;

    @ManyToMany
    private List<Student> student = new ArrayList<>();
}

```

![](/images/hibernate/manyToMany.png)

## fetchType

FetchType.LAZY 和 FetchType.EAGER 有什么区别 ？

有时候，你有两个实体，并且他们之间有关联。比如，你有一个实体 名称叫 大学，还有另外一个实体叫 学生。

他们之间的关系如下：

一个大学可能有很多个学生。但是一个学生只能属于一个大学

![](/images/hibernate/fetchType.png)

```java
public class University {
   private String id;
   private String name;
   private String address;
   private List<Student> students;

   // setters and getters
}
```

现在，当你从数据库中加载一个大学，JPA 加载了它的 id, name, address。但是对于 student 字段怎么加载 你有两种选择

1. 和其他字段一起加载 FetchType.EAGER
2. 按需加载，当调用 university's getStudents() 方法的时候加载 FetchType.Lazy

## 为什么在 spring 项目中 Entity 需要实现 Serializable?

> 参考文章: [Java 对象为啥要实现 Serializable 接口？](https://mp.weixin.qq.com/s/Zpb2OuZxJpWX2mow3qd-xg#cmid=307770)

Serializable 是 java.io 包中定义的、用于实现 Java 类的序列化操作而提供的一个语义级别的接口。

### 有什么用？

实现了 Serializable 接口的类可以被 ObjectOutputStream 转换为字节流，同时也可以通过 ObjectInputStream 再将其解析为对象

### 详细解释

无论什么编程语言，其**底层涉及 IO 操作的部分还是由操作系统其帮其完成的，而底层 IO 操作都是以字节流的方式进行的**，所以写操作都涉及将编程语言数据类型转换为字节流，而读操作则又涉及将字节流转化为编程语言类型的特定数据类型。

而 Java 作为一门面向对象的编程语言，为了完成对象数据的读写操作，通过 Serializable 接口来让 JVM 知道在进行 IO 操作时如何将对象数据转换为字节流，以及如何将字节流数据转换为特定的对。

### 主要使用场景

1. 需要把内存中的对象状态数据保存到一个文件或者数据库，例如 ORM 框架编写 entity 将其保存到数据库。
2. 网络通信时需要用套接字在网络中传送对象时，JSON

### 序列化与反序列化的唯一标识: serialVersionUID

如果我们在序列化中没有显示地声明 serialVersionUID，则序列化运行时将会根据该类的各个方面计算该类默认的 serialVersionUID 值。但是，Java 官方强烈建议所有要序列化的类都显示地声明 serialVersionUID 字段。

我们在实现 Serializable 接口的时候，要去尽量显示地定义义 serialVersionUID，如：

```java
private static final long serialVersionUID = 1L;
```

在反序列化的过程中，如果接收方为对象加载了一个类，如果该对象的 serialVersionUID 与对应持久化时的类不同，那么反序列化的过程中将会导致 InvalidClassException 异常。

## [传送门:「spring data jpa」实现 tree 结构](https://blog.shancw.net/2021/05/01/spring-data-jpa-tree-entity/)
