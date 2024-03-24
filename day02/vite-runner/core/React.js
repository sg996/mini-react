function createTextNode (text) {
  return {
    type: 'TEXT_NODE',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function createElement (type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        return typeof child === 'string' ? createTextNode(child) : child
      })
    }
  }
}

function createDom (type) {
  return type === 'TEXT_NODE' ? document.createTextNode('') : document.createElement(type)
}

function updateProps (dom, props) {
  Object.keys(props).forEach(key => {
    if (key !== 'children') {
      dom[key] = props[key]
    }
  })
}

function initChildren (fiber) {
  const children = fiber.props.children
  let prevChild = null
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    prevChild = newFiber
  })
}

let nextUnitOfWork = null
function workLoop (deadline) {
  let shouldYield = false
  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}

function performUnitOfWork (fiber) {
  if (!fiber.dom) {
    // 1. 创建 dom
    const dom = (fiber.dom = createDom(fiber.type))
    fiber.parent.dom.append(dom)

    // 2. 处理 props
    updateProps(dom, fiber.props)
  }
  // 3.转换链表，处理好指针
  initChildren(fiber)

  // 4.返回下一个要执行的任务
  if (fiber.child) return fiber.child
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }
}

function render (el, root) {
  console.log(el);
  nextUnitOfWork = {
    dom: root,
    props: {
      children: [el]
    }
  }
  requestIdleCallback(workLoop)
  console.log(nextUnitOfWork)
}


export default {
  render,
  createElement
}
