/** @jsx CReact.createElement */
import CReact from './core/React'

// const App = React.createElement('div', { id: 'app' }, 'hello', ' mini-react ', '666')

const App = (
  <ul>
    <li>hello, mini-react</li>
    <li>hello, mini-react</li>
    <li>hello, mini-react</li>
  </ul>
)

function appOne () {
  return (
    <ul>
      <li>hello, mini-react</li>
      <li>hello, mini-react</li>
      <li>hello, mini-react</li>
    </ul>
  )
}

console.log(appOne)

export default App
