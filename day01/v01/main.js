// v1
// 1.创建一个 div 挂载到根容器上
// const dom = document.createElement('div')
// dom.id = 'app'
// document.querySelector('#root').append(dom)

// // 2.创建一个文本节点
// const textNode = document.createTextNode('')
// textNode.nodeValue = 'app'
// dom.append(textNode)


// v2  抽象vDom -> js对象 type props children
// const textEl = {
//   type: 'TEXT_NODE',
//   props: {
//     nodeValue: 'app',
//     children: [],
//   }
// }

// const el = {
//   type: 'div',
//   props: {
//     id: 'app',
//     children: [textEl]
//   }
// }

// const dom = document.createElement(el.type)
// dom.id = el.props.id
// document.querySelector('#root').append(dom)

// const textNode = document.createTextNode('')
// textNode.nodeValue = textEl.props.nodeValue
// dom.append(textNode)

// v3 封装
import ReactDom from './core/ReactDom.js'
import App from './App.js'

console.log(App)
ReactDom.createRoot(document.getElementById('root')).render(App)
