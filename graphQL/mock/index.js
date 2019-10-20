const Mock = require('mockjs')
const path = require('path')
const fs = require('fs')

// mock 用户列表
let userList = []
for (let i = 0; i < 36; i ++) {
  let item = {
    id: i + 1,
    name: Mock.Random.cname(),
    age: Mock.Random.integer(18, 35),
    sex: Mock.Random.integer(0, 1),
    cardId: Mock.Random.id(),
    address: Mock.Random.province()
  }
  userList.push(item)
}
fs.writeFile(path.join(__dirname, './user.json'), JSON.stringify(userList), err => {
  if (err) {
    console.log(err)
  }
})

console.log(userList)