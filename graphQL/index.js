const Koa = require('koa')
const { ApolloServer, gql } = require('apollo-server-koa')

const userData = require('./mock/user')
let taskId = 1
let taskData = [
  {
    id: 1,
    name: '第一个',
    completed: true
  }
]

const app = new Koa()

const typeDefs = gql`
  type User {
    id: Int
    name: String
    age: Int
    sex: Int
    cardId: String
    address: String
  }

  type Task {
    id: Int
    name: String!
    completed: Boolean!
  }

  type Query {
    hello: String
    userAll: [User]!
    userDetail(id: Int!): User
    userList(current: Int! = 1, pageSize: Int! = 10): [User]!

    taskList: [Task]
  }

  type Mutation {
    addTask(name: String!): Task
    deleteTask(id: Int!): Task
    ctrlTask(id: Int!, completed: Boolean!): Task
  }
`

const resolvers = {
  Query: {
    hello() {
      return 'Hello world!'
    },
    userAll() {
      return userData
    },
    userDetail(obj, { id }) {
      for (let i = 0; i < userData.length; i ++) {
        if (userData[i].id === id) {
          return userData[i]
        }
      }
      return {}
    },
    userList(obj, { current, pageSize }) {
      let startIndex = (current - 1) * pageSize
      return userData.slice(startIndex, startIndex + pageSize)
    },


    taskList() {
      return taskData
    }
  },
  Mutation: {
    addTask(obj, { name }) {
      const newTask = {
        id: ++taskId,
        name,
        completed: false
      }
      taskData.unshift(newTask)
      return newTask
    },
    deleteTask(obj, { id }) {
      let indexDelete 
      let taskDelete
      taskData.forEach((el, index) => {
        if (el.id === id) {
          indexDelete = index
          taskDelete = el
        }
      })
      taskData.splice(indexDelete, 1) 
      return taskDelete
    },
    ctrlTask(obj, { id, completed }) {
      let taskCtrl
      taskData.forEach(el => {
        if (el.id === id) {
          el.completed = completed
        }
      })
      return taskCtrl
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })
app.use(server.getMiddleware())

app.listen(4000, () =>
  console.log(`http://localhost:4000${server.graphqlPath}`)
)