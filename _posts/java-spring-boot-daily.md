---
title: java springboot开发杂记
categories: [后端]
tags: [Spring Boot, myBatis]
toc: true
date: 2022/11/9
---

个人开发笔记，从新手角度，发现问题，记录知识。最终会归档为文章

<!-- more -->

## Table of Content



## Spring Boot 开发相关

### 配置@SpringBootTest 进行集成测试

依赖`spring-boot-starter-test`

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
</dependency>
```



所有测试代码需要放在 `src/test/java`目录下,推荐和`src/main/java` 下结构保持一致。

比如对`src/main/java` 下 com.demo.ArticleService进行测试, 那么测试用例位置为  `src/test/java`下 com.demo.ArticleService

对ArticleService 进行测试：

```java
package com.fawkes.rtcms;

import com.demo.entity.Article;
import com.demo.mapper.ArticleMapper;
import com.demo.service.ArticleService;
import org.hamcrest.Matchers;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@SpringBootTest
@RunWith(SpringRunner.class)
public class ArticleServiceTest {

    @Autowired
    ArticleService articleService;

    @Autowired
    ArticleMapper articleMapper;

    @Test
    public void create() {
        Article article = articleService.create(new Article().setExt1("test"));

        Article article1 = articleMapper.selectByPrimaryKey(article.getId());

        Assert.assertThat(article1.getExt1(), Matchers.is("test"));
    }

}

```

**注解解释：**

`@SpringBootTest`：获取启动类，加载配置，寻找主配置启动类（被 @SpringBootApplication 注解的） `@RunWith(SpringRunner.class)`：让JUnit运行Spring的测试环境,获得Spring环境的上下文的支持



更多参考：https://cloud.tencent.com/developer/article/1779117

### `@Transaction`使用

[文章: 你真的会用@Transaction吗？](https://juejin.cn/post/6844904179341737991)

背景：

事务分为**编程式事务**和**声明式事务**两种。**编程式事务**指在代码中手动的管理事务的提交、回滚等操作，代码侵入性比较强。**声明式事务**是基于 AOP 面向切面的，它将具体业务与事务处理部分解耦，代码侵入性很低，声明式事务也有两种实现方式，一种是基于 TX 和 AOP 的 xml 配置文件方式，二种就是基于 @Transactional 注解

`@Transaction`的使用：

**使用位置**：类：当作用在类上，表示该类的所有public方法都配置相同的事务属性。方法：方法的事务会覆盖类的事务配置信息

**timeout属性：** 事务的超时时间，默认值为-1。如果超过该时间限制但事务还没有完成，则自动回滚事务。

**readOnly属性 ：** 指定事务是否为只读事务，默认值为false；为了忽略那些不需要事务的方法，比如读取数据，可以设置 read-only 为 true。

**rollbackFor属性 ：** 用于指定能够触发事务回滚的异常类型，可以指定多个异常类型。

默认不设置rollbackFor属性，会对 RuntimeException 类型和 Error 类型的才进行回滚。如果在事务中抛出其他类型的异常，却希望 Spring 能够回滚事务，就需要指定 rollbackFor 属性。

![image-20221118113050548](http://serial.limiaomiao.site:8089/public/uploads/image-20221118113050548.png)

**noRollbackFor属性：** 这个就是和上面相反的了，抛出指定的异常类型，不回滚事务，也可以指定多个异常类型。



**propagation属性：**

| 传播行为                 | 说明                                                         |
| ------------------------ | ------------------------------------------------------------ |
| Propagation.REQUIRED     | 如果当前存在事务，则加入该事务，如果当前不存在事务，则创建一个新的事务。 |
| Propagation.NESTED       | 和 Propagation.REQUIRED 效果一样。                           |
| Propagation.REQUIRES_NEW | 重新创建一个新的事务，如果当前存在事务，暂停当前的事务。     |

### 

### Liquibase 配置外键的方式：

涉及到的Liquibase 标签知识：

假设有文章表和评论表，文章. 1------n 评论

模版为：

```xml
<?xml version="1.0" encoding="utf-8"?>
<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.9.xsd">

</databaseChangeLog>
```



1. 创建表 user xml

   ```xml
   <databaseChangeLog ... >
     <changeSet id="20221121172000-1" author="shancw">
       <createTable tableName="article" remarks="文章表">
         <column name="id" type="bigint" remarks="文章表id" />
       </createTable>
     </changeset>
   </databaseChangeLog>
   ```

2. 创建评论表 xml

   ```xml
   <databaseChangeLog>
   	<changeSet id="20221121172000-2" author="shancw">
       <createTable tableName="comment" remarks="评论表">
         <column name="id" type="bigint" remarks="评论表id" />
         <column name="article_id" type="bigint" remarks="文章表id" />
       </createTable>
   	</changeset>
   </databaseChangeLog>
   ```

3. 在评论表上增加文章表的外键

   [liquibase: addForeignKeyConstraint文档介绍](https://docs.liquibase.com/change-types/add-foreign-key-constraint.html)

   

   `baseColumnNames`：主表的主键字段名

   `baseTableName`: 主表名

   `constraintName`: 外键名称，格式一般为  `fk_主表_从表_id`

   `referencedColumnNames`: 从表的主键字段名

   `referencedTableName`: 从表名

   

   ```xml
   <databaseChangeLog ...>
   	<changeSet id="20221121172000-3">
     	<addForeignKeyConstraint baseColumnNames="article_id"
                                baseTableName="comment"
                                constraintName="fk_comment_article_id"
                                referencedColumnNames="id"
                                referencedTableName="article"/>
       />
     </changeSet>
   </databaseChangeLog>
   ```

### Liquidate 一对多设置级联删

接上文，如果直接删除article，sql会报错，因为存在外键约束。

解决办法：为comment 设置级联删除，当删除文章表one，自动删除评论表many

修改 `addForeignKeyConstraint` 增加 `onDelete="CASCADE"`

>  `onDelete`: 当触发删除操作时，需要执行的操作。可选项`CASCADE`, `SET NULL`, `SET DEFAULT`, `RESTRICT`, `NO ACTION`。

```diff
<databaseChangeLog ...>
	<changeSet id="20221121172000-3">
  	<addForeignKeyConstraint baseColumnNames="id"
                             baseTableName="comment"
                             constraintName="fk_comment_article_id"
                             referencedColumnNames="id"
                             referencedTableName="article"
+														 onDelete="CASCADE"
    />
  </changeSet>
</databaseChangeLog>
```

comment 表生成的DDL为（倒数第二行）:

```sql
  CONSTRAINT `fk_comment_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`id`) ON DELETE CASCADE
```

完整DDL

```sql
CREATE TABLE `comment` (
  `id` bigint NOT NULL,
  `article_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_comment_article_id` (`article_id`),
  CONSTRAINT `fk_comment_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='修改日期';
```





### @JsonSerialize

@JsonSerialize 会在当前类被序列化时候，调用 using 指定的class，将当前annotation 标注的字段进行想要的操作。



例1：`ToStringSerializer.class` 解决和前端交互时 java long. -> js number 精度丢失 

将Long 类型的id在序列化时，转换成 String类型

```java
class Example {
    @JsonSerialize(using = ToStringSerializer.class)
    private Long projectId;
}
```

例2: 自定义class 作为using  将时间转换成秒

```java
/** 订单创建时间 */
@JsonSerialize(using = DateToLongSerializer.class)
private Date createTime;
```

```java
public class DateToLongSerializer extends JsonSerializer<Date> {
    @Override
    public void serialize(Date date, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeNumber(date.getTime() / 1000);
    }
}
```



### mybatis collection 嵌套

![image-20221122155656655](http://serial.limiaomiao.site:8089/public/uploads/image-20221122155656655.png)

info 1-------->n fileLog 1-------->n files

通过left join 将 info fileLog file关联起来，得到如下表结构

| infoId | info 相关字段 | fileLogId | fileLog相关字段 | fileId | file相关字段 |
| ------ | ------------- | --------- | --------------- | ------ | ------------ |
| 1      | ...           | a         | ...             | 1a-1   | ...          |
| 1      | ...           | b         | ...             | 1b-2   | ...          |
| 2      | ...           | c         | ...             | 2c-1   | ...          |
| 2      | ...           | d         | ...             | 2c-d   |              |

需要的格式为 infoVM:

```java
class InfoVM {
  Info info;
  List<FileLog> fileLogs
}

class FileLog {
  ...
  List<File> files
}
```

注意：resultMap需要唯一id来进行不同collection分组，如果resultMap不提供，则会组装失败。

