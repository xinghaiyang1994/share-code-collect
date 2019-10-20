# 初探 GraphQL
GraphQL （Graph Query Language，字面意思是图表化查询语言） 既是一种用于 API 的查询语言也是一个满足你数据查询的运行时。 

GraphQL 是 Facebook 于 2012 年在内部开发的数据查询语言，在 2015 年开源，旨在提供 RESTful 架构体系的替代方案。

GraphQL 支持多种语言：Nodejs、Java、PHP、Go、Python 等

## RESTful 架构简介
RESTful架构主要特点：
* 每一个 URI 代表一种资源  
  一般 url 上带有版本。
  ```
  https://api.example.com/v1/animals
  ```
  如果资源过多还可以通过 url 参数进行过滤
  ```
  ?limit=10：指定返回记录的数量。
  ?page=2&per_page=100：指定第几页，以及每页的记录数。
  ```
* 客户端和服务器之间，传递这种资源的某种表现层  
  表现层根据资源不同有多种方式，如文本可以用 txt 格式、JSON、HTML、XML 等格式显示。
* 客户端通过四个 HTTP 动词，对服务器端资源进行操作，实现"表现层状态转化"  
  四个 HTTP 动词：
  * GET 从服务器取出资源（一项或多项）
  * POST 在服务器新建一个资源
  * PUT/PATCH 在服务器更新资源（客户端提供改变后的完整资源）
  * DELETE 从服务器删除资源

缺点：
* 字段臃肿，增大单次网络传输量  
  随着需求的变化，单个资源的属性可能会越来越多。比如最开始只有姓名、年龄，到后来可能添加身份证号、性别、籍贯等资源，这些字段在多个不同的请求下可能都是部分字段是有用的，其他字段都是没用的。
* 独立的资源需要多个请求，增大网络请求次数  
  多次传输消耗更多网络传输。

## GraphQL 优点
* 只有一个接口地址  
  需求变动带来的新增字段不影响老客户端，服务端也不需要版本号，接口地址始终唯一。
* 精确返回有用字段    
  例如只需要用户的姓名和年龄
  ```
  {
    user {
      name
      age
    }
  }
  ```
  返回
  ```
  {
    data: {
      user: {
        name: 'x',
        age: 18
      }
    }
  }
  ```
* 单次可获取多种不同类型的资源
  例如获取部门列表和用户列表，常规需要两次请求，graphQL 只需要一次
  ```
  {
    user {
      id
      name
    }
    department {
      id
      name
    }
  }
  ```
  返回
  ```
  {
    data {
      user: [
        {
          id: 1,
          name: 'x'
        },
        {
          id: 2,
          name: 'y'
        }
      ],
      department: [
        {
          id: 1,
          name: '技术部'
        },
        {
          id: 2,
          name: '产品部'
        }
      ]
    }
  }
  ```
* 参数类型强校验  
  确保了参数类型的合法性。
* 调试方便，快速生成文档   
  GraphQL 提供 GraphQL Playground（或者 GraphiQL ），可以在线调试。  
  ![](https://tva1.sinaimg.cn/large/006y8mN6ly1g82h07snuqj30k60hvjsd.jpg)  
  GraphQL 会把 schema 定义和相关的注释生成可视化的文档。  
  生成文档相关的 npm 包：
  * graphdoc
  * graphql-markdown

## GraphQL 基础知识
GraphQL 是一种查询语言，它定义了一套类型系统，需要前后端都要学会。

在 GraphQL 项目中，前后端各自负责的内容：
* 后端  
  * 定义 schema ，可以理解为定义数据结构
  * 根据 schema 中定义的不同结构给出解析方法 resolver
* 前端  
  * 写查询 query（查询）、变更 mutation （新增、修改、删除）语句

### 标量类型
标量类型是解析到单个标量对象的类型，无法在查询中对它进行次级选择。 

前后端都需要了解。

分为默认标量类型和自定义标量类型，自定义标量类型是根据标量类型组合而成的。

GraphQL 自带一组默认标量类型：
* Int  
  有符号 32 位整数。
* Float  
  有符号双精度浮点值。
* String  
  UTF‐8 字符序列。
* Boolean   
  true 或者 false。
* ID  
  ID 标量类型表示一个唯一标识符，通常用以重新获取对象或者作为缓存中的键。

类型修饰符：
* !  
  代表非空
* []  
  代表数字

例
```
type Character {
  name: String!
  appearsIn: [Episode!]!
}
```
说明：  
* Character 是一个 GraphQL 对象类型，表示其是一个拥有一些字段的类型。
* name 和 appearsIn 是 Character 类型上的字段。
* String 是一个内置的标量类型。
* String! 表示这个字段是非空的，GraphQL 服务保证当你查询这个字段后总会给你返回一个值。
* [Episode!]! 表示一个 Episode 数组。因为它也是非空的，所以当你查询 appearsIn 字段的时候，你也总能得到一个数组（零个或者多个元素）。且由于 Episode! 也是非空的，你总是可以预期到数组中的每个项目都是一个 Episode 对象。

除了上面的类型外，还有如下功能：
* 枚举类型  
  枚举类型是一种特殊的标量，它限制在一个特殊的可选值集合内。  
  ```
  enum Episode {
    NEWHOPE
    EMPIRE
    JEDI
  }
  ```
  在 js 中上面代表是三个字符串中的一个。
* 联合类型  
  联合类型为多种类型的一种。
  ```
  union SearchResult = Human | Droid | Starship
  ```
* 输入类型  
  通过输入类型可以传递复杂对象，在变更（mutation）中特别有用。 
  ```
  input ReviewInput {
    stars: Int!
    commentary: String
  }
  ```
* 接口和实现接口  
  ```
  interface Character {
    id: ID!
    name: String!
    friends: [Character]
    appearsIn: [Episode]!
  }
  ```
  接口实现
  ```
  type Human implements Character {
    id: ID!
    name: String!
    friends: [Character]
    appearsIn: [Episode]!
    starships: [Starship]
    totalCredits: Int
  }
  ```

### 参数
* 后端使用参数  
  每一个字段都可能有零个或者多个参数，所有参数都是具名的（不是按数组顺序，必须有名称）。
  ```
  type Query {
    hello: String
    userAll: [User]!
    userDetail(id: Int!): User
    userList(current: Int! = 1, pageSize: Int! = 10): [User]!
  }
  ```  
* 前端使用参数  
  直接在字段后添加参数值
  ```
  query getList {
    userList(current: 2, pageSize: 3){
      name
      id
    }
  }
  ```  
  前端常结合变量使用，变量值放在请求参数的 variables 字段中
  ```
  query getList ($current: Int!, $pageSize: Int!) {
    userList(current: $current, pageSize: $pageSize){
      name
      id
    }
  }
  ```

### 操作类型
* query 查询
* mutation 修改
* subscribe 订阅

前两种在一般项目中常用，subscribe 可以用在聊天室等场景。

### 基本流程
![](https://tva1.sinaimg.cn/large/006y8mN6ly1g84yumi33jj31t40qigqf.jpg)

### 常用框架（以 Node 为例）
后端：
* graphql（基础）  
  GraphQL 规范的参考实现，设计用于在 Node.js 环境中运行。
* express-graphql  
  基于 Express webserver 服务器的一个 GraphQL API 服务端参考实现。
* apollo-server（提供前后端一套解决方案）   
  来自于 Apollo 的一套 GraphQL server 包，可用于多种 Node.js HTTP 框架（Express，Connect，Hapi，Koa 等）。

前端：
* apollo-client  
  一个全功能的 GraphQL 客户端，用于 React 、Angular、Vue 等的交互。
* relay   
  主要用于 React 。

## GraphQL 劣势
* 性能问题  
  按照官方 resolve 的写法，每一个字段都对数据库直接跑一个 query，会产生大量冗余 query，数据库查询可能会成为性能瓶颈。
* 增加后端成本  
  GraphQL 的利好主要是在于前端的开发效率，但落地却需要服务端的全力配合，增加服务端的学习成本
* 老项目改造成本高  
  现在主流的后端架构，集群间通讯还是http或者rpc的API，固定输入输出字段，根本不能满足 GraphQL 的需求，要上就都得改。

## 参考文档
* [GraphQL 为何没有火起来?](https://www.zhihu.com/question/38596306)
* [graphql 中文文档](https://graphql.cn/)
* [GraphQL和RESTful的比较](https://www.jianshu.com/p/9359188b952f)
* [什么是 GraphQL？](https://www.zhihu.com/question/264629587)