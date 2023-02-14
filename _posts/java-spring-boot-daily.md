---
title: java springboot开发杂记
categories: [后端]
tags: [Spring Boot, myBatis]
toc: true
date: 2022/11/9
---

个人开发笔记，从新手角度，发现问题，记录知识。最终会归档为文章

TODO:

- @Resource 注解使用及原理

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

比如对`src/main/java` 下 com.demo.ArticleService 进行测试, 那么测试用例位置为 `src/test/java`下 com.demo.ArticleService

对 ArticleService 进行测试：

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

`@SpringBootTest`：获取启动类，加载配置，寻找主配置启动类（被 @SpringBootApplication 注解的） `@RunWith(SpringRunner.class)`：让 JUnit 运行 Spring 的测试环境,获得 Spring 环境的上下文的支持

更多参考：https://cloud.tencent.com/developer/article/1779117

### `@Transaction`使用

[文章: 你真的会用@Transaction 吗？](https://juejin.cn/post/6844904179341737991)

背景：

事务分为**编程式事务**和**声明式事务**两种。**编程式事务**指在代码中手动的管理事务的提交、回滚等操作，代码侵入性比较强。**声明式事务**是基于 AOP 面向切面的，它将具体业务与事务处理部分解耦，代码侵入性很低，声明式事务也有两种实现方式，一种是基于 TX 和 AOP 的 xml 配置文件方式，二种就是基于 @Transactional 注解

`@Transaction`的使用：

**使用位置**：类：当作用在类上，表示该类的所有 public 方法都配置相同的事务属性。方法：方法的事务会覆盖类的事务配置信息

**timeout 属性：** 事务的超时时间，默认值为-1。如果超过该时间限制但事务还没有完成，则自动回滚事务。

**readOnly 属性 ：** 指定事务是否为只读事务，默认值为 false；为了忽略那些不需要事务的方法，比如读取数据，可以设置 read-only 为 true。

**rollbackFor 属性 ：** 用于指定能够触发事务回滚的异常类型，可以指定多个异常类型。

默认不设置 rollbackFor 属性，会对 RuntimeException 类型和 Error 类型的才进行回滚。如果在事务中抛出其他类型的异常，却希望 Spring 能够回滚事务，就需要指定 rollbackFor 属性。

![image-20221118113050548](https://pic.limiaomiao.site:8443/public/uploads/image-20221118113050548.png)

**noRollbackFor 属性：** 这个就是和上面相反的了，抛出指定的异常类型，不回滚事务，也可以指定多个异常类型。

**propagation 属性：**

| 传播行为                 | 说明                                                                     |
| ------------------------ | ------------------------------------------------------------------------ |
| Propagation.REQUIRED     | 如果当前存在事务，则加入该事务，如果当前不存在事务，则创建一个新的事务。 |
| Propagation.NESTED       | 和 Propagation.REQUIRED 效果一样。                                       |
| Propagation.REQUIRES_NEW | 重新创建一个新的事务，如果当前存在事务，暂停当前的事务。                 |



### Liquibase 配置外键的方式：

涉及到的 Liquibase 标签知识：

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

   [liquibase: addForeignKeyConstraint 文档介绍](https://docs.liquibase.com/change-types/add-foreign-key-constraint.html)

   `baseColumnNames`：主表的主键字段名

   `baseTableName`: 主表名

   `constraintName`: 外键名称，格式一般为 `fk_主表_从表_id`

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

接上文，如果直接删除 article，sql 会报错，因为存在外键约束。

解决办法：为 comment 设置级联删除，当删除文章表 one，自动删除评论表 many

修改 `addForeignKeyConstraint` 增加 `onDelete="CASCADE"`

> `onDelete`: 当触发删除操作时，需要执行的操作。可选项`CASCADE`, `SET NULL`, `SET DEFAULT`, `RESTRICT`, `NO ACTION`。

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

comment 表生成的 DDL 为（倒数第二行）:

```sql
  CONSTRAINT `fk_comment_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`id`) ON DELETE CASCADE
```

完整 DDL

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

@JsonSerialize 会在当前类被序列化时候，调用 using 指定的 class，将当前 annotation 标注的字段进行想要的操作。

例 1：`ToStringSerializer.class` 解决和前端交互时 java long. -> js number 精度丢失

将 Long 类型的 id 在序列化时，转换成 String 类型

```java
class Example {
    @JsonSerialize(using = ToStringSerializer.class)
    private Long projectId;
}
```

例 2: 自定义 class 作为 using 将时间转换成秒

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

![image-20221122155656655](https://pic.limiaomiao.site:8443/public/uploads/image-20221122155656655.png)

info 1-------->n fileLog 1-------->n files

通过 left join 将 info fileLog file 关联起来，得到如下表结构

| infoId | info 相关字段 | fileLogId | fileLog 相关字段 | fileId | file 相关字段 |
| ------ | ------------- | --------- | ---------------- | ------ | ------------- |
| 1      | ...           | a         | ...              | 1a-1   | ...           |
| 1      | ...           | b         | ...              | 1b-2   | ...           |
| 2      | ...           | c         | ...              | 2c-1   | ...           |
| 2      | ...           | d         | ...              | 2c-d   |               |

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

注意：resultMap 需要唯一 id 来进行不同 collection 分组，如果 resultMap 不提供，则会组装失败。



### @Schedule 定时任务

在 Spring Boot 中实现定时任务可以通过使用 `@Scheduled` 注解来实现。首先，在启动类中添加 `@EnableScheduling` 注解开启定时任务功能，然后在需要执行定时任务的方法上添加 `@Scheduled` 注解，并配置定时任务的执行周期。

示例代码：

```java
@EnableScheduling
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }

    @Scheduled(fixedRate = 1000)
    public void scheduleTaskWithFixedRate() {
        // ...
    }
}
```

在这个示例代码中，定时任务 `scheduleTaskWithFixedRate` 每隔 1000 毫秒执行一次。



在每天的0点执行：

```java
@Scheduled(cron = "0 0 0 * * ?")
public void scheduleTaskWithCronExpression() {
    // ...
}
```



cron表达式的格式：

```
秒 分 小时 一个月中的第几天 月 一周中的第几天 年 (选填)
```

比如：

+ 每天的 23：59:59执行：`"59 59 23 * * ?`

+ 每月的第15天 23:59:59执行：`59 59 23 15 * ?`

+ 根据报价表整理出来已完成内容，双方确认是否有异议

+ 有异议或未完成功能，甲方明确给到需求的时间

+ 甲方的验收流程，我们这儿除了开发完功能还需要准备什么？
  + 就是我们合同后签的，功能是先开发完的，现在做的这个验收，能用在后续合同付款验收吗。就到时候需不需要再做一次验收？

+ 是否有后续计划，二期？



```
REPOSITORY                                        TAG                            IMAGE ID            CREATED             SIZE
fawkes.tencentcloudcr.com/fawkes/sys-form         2.0.0-RELEASE                  e15fb2671aa0        5 months ago        263MB
fawkes.tencentcloudcr.com/fawkes/sys-bpm          2.0.0-RELEASE                  045da27ddf65        5 months ago        252MB
fawkes.tencentcloudcr.com/fawkes/sys-system       2.0.0-RELEASE                  110a65895f43        5 months ago        239MB
nginxdemos/hello                                  latest                         729220f0c1ea        6 months ago        23.6MB
openjdk                                           8-jre-slim                     85b121affedd        6 months ago        194MB
fawkes.tencentcloudcr.com/basic/minio             RELEASE.2022-07-26T00-53-03Z   8e56d2760289        6 months ago        220MB
keking/kkfileview                                 latest                         6771b555ede5        6 months ago        1.6GB
fawkes.tencentcloudcr.com/fawkes/sys-auth         2.0.0-RELEASE                  a14c57b1d376        7 months ago        479MB
fawkes.tencentcloudcr.com/fawkes/sys-gateway      2.0.0-RELEASE                  a1aca95dde46        8 months ago        229MB
fawkes.tencentcloudcr.com/fawkes/sys-msg          2.0.0-RELEASE                  37ec528acc06        9 months ago        253MB
fawkes.tencentcloudcr.com/fawkes/sys-user         2.0.0-RELEASE                  312a6b0e15c5        9 months ago        471MB
fawkes.tencentcloudcr.com/fawkes/bpm-designer     2.0.0-RELEASE                  26e525fc3e78        9 months ago        167MB
fawkes.tencentcloudcr.com/fawkes/central-system   2.0.0-RELEASE                  9621130e7f02        9 months ago        204MB
fawkes.tencentcloudcr.com/fawkes/sys-storage      2.0.0-RELEASE                  5d79f6c72a23        9 months ago        646MB
fawkes.tencentcloudcr.com/fawkes/sys-socket       2.0.0-RELEASE                  f71b28c986c1        9 months ago        267MB
fawkes.tencentcloudcr.com/fawkes/sys-monitor      2.0.0-RELEASE                  599aa66c5f32        9 months ago        286MB
```

将上述docker image 列表中以 fawkes.tencentcloudcr.com 开头的 image，全部保存到 /root/downloads/fawkes-images 路径
