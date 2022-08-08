---
title: Liquibase简单使用
categories: [后端]
tags: [hibernate, liquibase]
toc: true
date: 2021/11/15
---

这篇文章介绍了使用 JPA 与 Liquibase 来生成实体的基本方式。

详细配置参考[JPA 快速适配多种数据库](https://zeral.cn/persistence/jpa-%E5%BF%AB%E9%80%9F%E9%80%82%E9%85%8D%E5%A4%9A%E7%A7%8D%E6%95%B0%E6%8D%AE%E5%BA%93/)

| Liquibase data type | SQL Server data type | Oracle data type | MySQL     | PostgreSQL                 | Java 类型            |
| ------------------- | -------------------- | ---------------- | --------- | -------------------------- | -------------------- |
| bigint              | bigint               | number(38,0)     | bigint    | bigint/bigserial           | java.math.BigInteger |
| currency            | money                | number(15,2)     | decimal   | decimal                    | java.math.BigDecimal |
| decimal             | decimal              | decimal          | decimal   | decimal                    | java.math.BigDecimal |
| number              | numeric              | number           | numeric   | numeric                    | java.math.BigDecimal |
| double              | float                | float(24)        | double    | double precision           | java.lang.Double     |
| float               | float                | float            | float     | float                      | java.lang.Float      |
| int                 | int                  | integer          | int       | integer/serial             | java.lang.Integer    |
| mediumint           | int                  | mediumint        | mediumint | mediumint                  | java.lang.Integer    |
| smallint            | smallint             | number(5)        | smallint  | smallint/smallserial       | java.lang.Integer    |
| tinyint             | tinyint              | number(3)        | tinyint   | smallint                   | java.lang.Integer    |
| blob                | varbinary(max)       | blob             | blob      | oid                        | java.lang.byte[]     |
| boolean             | bit                  | number(1)        | bit       | bit                        | java.lang.Boolean    |
| char                | char                 | char             | char      | character                  | java.lang.String     |
| clob                | nvarchar(max)        | clob             | longtext  | text                       | java.lang.String     |
| uuid                | uniqueidentifier     | raw(16)          | char(36)  | uuid                       | java.lang.String     |
| varchar             | varchar              | varchar2         | varchar   | varchar/character(varying) | java.lang.String     |
| nchar               | nchar                | nchar            | nchar     | nchar                      | java.lang.String     |
| nvarchar            | nvarchar             | nvarchar2        | nvarchar  | varchar                    | java.lang.String     |
| datetime            | datetime             | timestamp        | timestamp | timestamp                  | java.sql.Timestamp   |
| timestamp           | datetime             | timestamp        | timestamp | timestamp                  | java.sql.Timestamp   |
| time                | time                 | date             | time      | time                       | java.sql.Time        |
| date                | date                 | date             | date      | date                       | java.sql.Date        |

<!-- more -->

liquibase 通过增加 changelog 的方式来生成或修改实体。

changelog 存放 位置：resources/config/liquibase/changelog/...

changlog 定义好后，需要在 master.xml 中添加对应的 changelog： resources/config/liquibase/master.xml

## 实体相关操作

### 基本结构

- 每个 changelog 文件都必须通过 databaseChangeLog 包裹。
- changeSet 用于定义一个变更，可以有多个 changeSet。changeSet 必须要有 id 来标识，id 必须唯一。
  此外 author 可以指定变更人，date 可以指定变更时间。
  id 的指定一般格式为: YYYYMMDDHHMM-第几个 changeSet，比如 202111150854-1

```xml
<?xml version="1.0" encoding="utf-8"?>
<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.8.xsd">
  <changeSet id="202111150854-0" author="wu_sc">
  </changeSet>
</databaseChangeLog>
```

### 建表

通过 createTable 标签可以生成表，具体操作如下：

- `column` 标签用于定义列，其中 name 属性用于指定列名，type 属性用于指定列类型和长度。
- `constraints` 标签可以对 column 的描述进行丰富，比如是否为空，是否为主键等。

```xml
<?xml version="1.0" encoding="utf-8"?>
<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.8.xsd">
  <changeSet id="202111150854-0" author="wu_sc">
    <createTable tableName="t_user">
      <column name="id" type="bigint">
          <constraints primaryKey="true" nullable="false"/>
      </column>
    </createTable>
  </changeSet>
</databaseChangeLog>
```

### 添加/删除 列

`addColum` 和 dropColumn 标签可以添加或删除列，具体操作如下：

```xml
...
  <changeSet id="202111150854-1" author="wu_sc">
      <dropColumn tableName="t_work_order" columnName="backflush_flag"/>
      <addColumn tableName="t_work_order">
          <column name="sync_status" type="varchar(50)" remarks="同步状态"/>
      </addColumn>
  </changeSet>
...
————————————————
```

### 添加外键约束

addForeignKey 标签可以添加外键约束，具体操作如下：

```xml
<addForeignKeyConstraint
  baseTableName="file_info"
  baseColumnNames="record_attach_id"
  constraintName="fk_file_info_warehousing_record_attch_id"
  referencedTableName="warehousing_record"
  referencedColumnNames="id"
/>
```

baseTableName 和 referenceTableName 分别代表外键约束的主表和外键约束的外表。

#### 下面通过具体例子来进行演示（jpa entity）：

文件实体

```java
public class FileInfo {
    private Long id;
    private String fileName;
}
```

出入库记录实体

```java
public class WarehousingRecord {
    private Long id;
    private String recordNo;
}
```

##### 建立 jpa 实体关联

```java
@Entity
@Table(name = "warehousing_record")
public class WarehousingRecord {

    private Long id;

    private String recordNo;

    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.REMOVE}, mappedBy = "warehousingRecordForReport" )
    private Set<FileInfo> inspectionReport = new HashSet<>();
}

@Table(name = "file_info")
public class FileInfo {
    private Long id;
    private String fileName;

    @ManyToOne
    @JoinColumn("record_report_id")
    private WarehousingRecord warehousingRecordForReport;
}
```

##### 设计 liquibase changelog

owner 端为 warehousing_record，使用 referenceTableName 指定
从属端为 file_info，使用 baseTableName 指定
从属端的外键为 record_report_id，使用 baseColumnNames 指定，指向 warehousing_record 的 id
file_info.record_report_id 与 warehousing_record.id 的约束使用 constraintName 指定

```xml
<?xml version="1.0" encoding="utf-8"?>
<databaseChangeLog
    xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.9.xsd">
    <changeSet id="2021111110531103-01" author="wu_sc">
        <addColumn tableName="file_info">
            <column name="record_report_id" type="bigint">
                <constraints nullable="true"/>
            </column>
        </addColumn>
    </changeSet>
    <changeSet id="2021111110531103-03" author="wu_sc">
        <addForeignKeyConstraint baseTableName="file_info"
                                 baseColumnNames="record_report_id"
                                 constraintName="fk_file_info_warehousing_record_report_id"
                                 referencedColumnNames="id"
                                 referencedTableName="warehousing_record"/>
    </changeSet>
</databaseChangeLog>
```

![例子](/images/java/liquibase-jpa-example.png)
