---
title: Vue2 - 组件
categories: [前端]
tags: [implement, vue]
date: 2022/8/8
---

组件是前端项目开发的核心内容,不仅是vue，React也有组件的概念。

那么什么是组件？

简单而言，组件是可复用的html + css + js 的集合，为了提高开发效率而产生的概念。

组件在vue中，类似于js的class。Person class 可以生成多个 实例，从而避免去手写多个对象。

同样，在vue中，使用了组件，就不必要手写过多重复冗余的代码

<!--more-->

## Table of Content

## 组件注册

以Todo列表为例，我们将todo具体的某一项抽成一个组件。

![image-20220808170813453](http://serial.limiaomiao.site:8089/public/uploads/image-20220808170813453.png)

1. 在componets目录下创建一个组件vue，命名为TodoItem.vue，并将相关代码复制过去

   ```vue
   <template>
     <div
       :key="item.id"
       class="todoBox"
       :class="[item.isFinish ? 'active' : '']"
       @click="() => handleClick(item)"
     >
       {{ item.title }}
     </div>
   </template>
   <script>
   export default {
     data() {
       return {
         item: {
           id: 1,
           title: "hello component",
           isFinish: false,
         },
       };
     },
     methods: {
       handleClick(item) {
         item.isFinish = !item.isFinish;
       },
     },
   };
   </script>
   ```

   

2. 在页面中使用

   组件的使用，需要先注册

   1. import将文件引入

      `import TodoItem from './TodoItem';`

   2. 将文件注册进入componets属性下

      ```js
      import TodoItem from './TodoItem';
      export default {
        components: {
          TodoItem
        }
      	data() {...}
      }
      ```

   3. 在template 中使用

      ```html
      <template>
        <div>
          ...
          <div class="hello">
            <TodoItem />
          </div>
        </div>
      </template>
      ```

   ![image-20220808172258067](http://serial.limiaomiao.site:8089/public/uploads/image-20220808172258067.png)

   到此，一个组件就创建完成了

   

   ## 组件通信

   接上一章，我们创建了todoItem组件，他的标题是固定的 Hello Component。

   这个章节，我们会讲如何将todoList，借助todoItem组件渲染出来。

   

   ### 父 -> 子  props

   首先todoList是todoItem的集合，那么我们需要使用v-for 创建多个组件，让他生成多个

   ![image-20220808172932719](http://serial.limiaomiao.site:8089/public/uploads/image-20220808172932719.png)

   但是，很明显，虽然组件生成了多个，但是内部的数据却没有发生比变化。这时候我们需要借助props，来将数据 传给todoItem组件。

   修改todoItem组件，增加props属性，用于接收外部数据。修改HelloWorld 文件，将item 作为数据传递过去

   ![image-20220808180602717](http://serial.limiaomiao.site:8089/public/uploads/image-20220808180602717.png)

   

   ### 子传父  $emit

   todoItem 状态发生改变后，通知todoList 改变对应的值

   TODO