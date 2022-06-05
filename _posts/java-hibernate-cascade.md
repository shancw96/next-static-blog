---
title: hibernate cascade 方法
categories: [后端]
tags: [hibernate]
toc: true
date: 2021/11/16
---

JPA 允许将一个对象的更新操作联合到另一个对象的更新操作中，这样可以避免在更新一个对象时，还需要更新其他对象。

`javax.persistence.CascadeType` 有以下几种类型

- ALL: cascade 所有状态转换
- PERSIST: cascade 实体的持久化
- MERGE: cascade 实体的更新
- REMOVE: cascade 实体的删除
- REFRESH: cascade 实体的刷新
- DETACH: cascade 实体的分离

这篇文章通过具体例子介绍了 cascade 几种类型的效果

<!-- more -->

## ALL

> CascadeType.ALL 除了上述所有类型的效果外，还可以指定以下类型的效果
> SAVE_UPDATE: cascade 实体的 saveOrUpdate
> REPLICATE: cascade 实体的复制操作
> LOCK: cascade 实体的锁定

下面几种类型类型的效果，通过如下两个实体进行展示

```java
@Entity
public class Person {
  @Id
  private Long id;

  private String name;

  @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
  private List<Phone> phones = new ArrayList<>();

  //Getters and setters are omitted for brevity

  public void addPhone(Phone phone) {
      this.phones.add( phone );
      phone.setOwner( this );
  }
}

@Entity
public class Phone {

    @Id
    private Long id;

    @Column(name = "`number`")
    private String number;

    @ManyToOne(fetch = FetchType.LAZY)
    private Person owner;

    //Getters and setters are omitted for brevity
}

```

## PERSIST

当对 person 实体进行持久化操作时候，persist 操作会被传递给 phone

```java
Person person = new Person();
person.setId( 1L );
person.setName( "John Doe" );

Phone phone = new Phone();
phone.setId( 1L );
phone.setNumber( "123-456-7890" );

person.addPhone( phone );

entityManager.persist( person );
```

```sql
INSERT INTO Person ( name, id )
VALUES ( 'John Doe', 1 )

INSERT INTO Phone ( `number`, person_id, id )
VALUE ( '123-456-7890', 1, 1 )
```

## MERGE

当对 person 实体进行 merge 操作时候，merge 操作会被传递给 phone

```java
Phone phone = entityManager.find( Phone.class, 1L );
Person person = phone.getOwner();

person.setName( "John Doe Jr." );
phone.setNumber( "987-654-3210" );

entityManager.clear();

entityManager.merge( person );
```

```sql
SELECT
    p.id as id1_0_1_,
    p.name as name2_0_1_,
    ph.owner_id as owner_id3_1_3_,
    ph.id as id1_1_3_,
    ph.id as id1_1_0_,
    ph."number" as number2_1_0_,
    ph.owner_id as owner_id3_1_0_
FROM
    Person p
LEFT OUTER JOIN
    Phone ph
        on p.id=ph.owner_id
WHERE
    p.id = 1
```

## REMOVE

删除操作

```java
Person person = entityManager.find( Person.class, 1L );

entityManager.remove( person );
```

```sql
DELETE FROM Phone WHERE id = 1

DELETE FROM Person WHERE id = 1
```

## REFRESH

refresh 操作会抛弃现有的更改，并且重新从数据库中加载实体

```java
Person person = entityManager.find( Person.class, 1L );
Phone phone = person.getPhones().get( 0 );

person.setName( "John Doe Jr." );
phone.setNumber( "987-654-3210" );

entityManager.refresh( person );

assertEquals( "John Doe", person.getName() );
assertEquals( "123-456-7890", phone.getNumber() );
```

```sql
SELECT
    p.id as id1_0_1_,
    p.name as name2_0_1_,
    ph.owner_id as owner_id3_1_3_,
    ph.id as id1_1_3_,
    ph.id as id1_1_0_,
    ph."number" as number2_1_0_,
    ph.owner_id as owner_id3_1_0_
FROM
    Person p
LEFT OUTER JOIN
    Phone ph
        ON p.id=ph.owner_id
WHERE
    p.id = 1
```

## DETACH

```java
Person person = entityManager.find( Person.class, 1L );
assertEquals( 1, person.getPhones().size() );
Phone phone = person.getPhones().get( 0 );

assertTrue( entityManager.contains( person ));
assertTrue( entityManager.contains( phone ));

entityManager.detach( person );

assertFalse( entityManager.contains( person ));
assertFalse( entityManager.contains( phone ));
```
