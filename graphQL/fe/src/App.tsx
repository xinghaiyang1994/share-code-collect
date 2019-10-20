import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'

import {
  GET_TASK_LIST,
  ADD_TASK,
  DELETE_TASK,
  CTRL_TASK
} from './graphType'

const App: React.FC = () => {
  const [value, setValue] = useState('')
  const [taskList, setTaskList] = useState([])
  const { data: taskListData, refetch: refetchTaskList } = useQuery(GET_TASK_LIST)
  const [addTask] = useMutation(ADD_TASK)
  const [deleteTask] = useMutation(DELETE_TASK)
  const [ctrlTask] = useMutation(CTRL_TASK)

  const chgInput = (e: any) => {
    setValue(e.target.value)
  }
  const addItem = (e: any) => {
    if (e.keyCode !== 13) {
      return
    }
    if (value === '') {
      return alert('不能为空!')
    }
    addTask({
      variables: {
        name: value
      }
    })
    setValue('')
    refetchTaskList()
  }
  const deleteItem = (id: Number) => {
    deleteTask({
      variables: {
        id
      }
    })
    refetchTaskList()
  }
  const chgComplete = (id: number ,e: any) => {
    // console.log(e.target.checked)
    ctrlTask({
      variables: {
        id,
        completed: e.target.checked
      }
    })
    refetchTaskList()
  }

  useEffect(() => {
    if (taskListData && taskListData.taskList) {
      setTaskList(taskListData.taskList)
    }
  }, [taskListData])
  return (
    <div className="App">
      <div className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input onKeyDown={addItem} value={value} onChange={chgInput} type="text" className="new-todo" placeholder="请输入"/>
        </header>
        <section className="main">
          <ul className="todo-list">
            {
              taskList.map((el: any, index: number) => {
                return (
                  <li className={el.completed ? 'completed' : ''} key={index}>
                    <div className="view">
                      <input onChange={(e) => { chgComplete(el.id, e) }} checked={el.completed} id={`btn${el.id}`} type="checkbox" className="toggle"/>
                      <label htmlFor={`btn${el.id}`}>{el.name}</label>
                      <button onClick={() => { deleteItem(el.id) }} className="destroy"></button>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </section>
        {
          taskList.length > 0 && (
            <footer className="footer">
              <span className="todo-count">
                <strong>{taskList.length}个</strong>
              </span>
            </footer>
          )
        }
      </div>
    </div>
  );
}

export default App;
