import React from './core/React'

const Counter = ({ num }) => {
  return <div>num：{num}</div>
}

const App = () => (
  <ul>
    <Counter num={10}></Counter>
    <Counter num={20}></Counter>
    <li>hello, mini-react
      <div>我是 div</div>
    </li>
    <ul>
      <li>hello, mini-react</li>
      <ul>
        <li>hello, mini-react</li>
      </ul>
    </ul>
  </ul>
)

export default App
