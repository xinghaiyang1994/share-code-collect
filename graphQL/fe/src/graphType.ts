import { gql } from 'apollo-boost'

const GET_TASK_LIST = gql`
  query getTaskList {
    taskList {
      id
      name
      completed
    }
  }
`

const ADD_TASK = gql`
  mutation addTask($name: String!){
    addTask(name: $name) {
      id
    }
  }
`

const DELETE_TASK = gql`
  mutation deleteTask($id: Int!){
    deleteTask(id: $id) {
      name
    }
  }
`

const CTRL_TASK = gql`
  mutation ctrlTask($id: Int!, $completed: Boolean!){
    ctrlTask(id: $id, completed: $completed) {
      name
    }
  }
`

export {
  GET_TASK_LIST,
  ADD_TASK,
  DELETE_TASK,
  CTRL_TASK
}