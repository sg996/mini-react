import React from './core/React'

let count = 10
let props = { id: 123 }
const Counter = ({ num }) => {
  function handleClick () {
    count += 1
    props = {}
    React.update()
  }


  return (
    <div {...props}>
      <div> num：{count}</div>
      <button onClick={handleClick}>点击</button>
    </div>
  )
}

const App = () => (
  <Counter num={10}></Counter>
)

export default App
