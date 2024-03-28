import React from './core/React'

let countFoo = 1
const Foo = () => {
  console.log('Foo return')
  function handleClick () {
    countFoo++
    React.update()()
  }
  return (
    <div >
      <button onClick={handleClick}>点击</button>
      <div>foo</div>
      {countFoo}
    </div>
  )
}

let countBar = 1
const Bar = () => {
  console.log('Bar return')
  function handleClick () {
    countBar++
    React.update()()
  }
  return (
    <div >
      <button onClick={handleClick}>点击</button>
      <div>bar</div>
      {countBar}
    </div>
  )
}

const App = () => (
  <div>
    <Foo></Foo>
    <Bar></Bar>
  </div>
)

export default App
