let root = null
let nextUnitOfWork = null

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
        const isTextNode = typeof child === 'string' || typeof child === 'number'
        return isTextNode ? createTextNode(child) : child
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

function initChildren (fiber, children) {
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

function commitRoot () {
  commitWork(root.child)
}

function commitWork (fiber) {
  if (!fiber) return
  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }
  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function workLoop (deadline) {
  let shouldYield = false
  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextUnitOfWork && root) {
    commitRoot()
    root = null
  }
  requestIdleCallback(workLoop)
}

function updateFunctionComponent (fiber) {
  // 3.转换链表，处理好指针
  const children = [fiber.type(fiber.props)]
  initChildren(fiber, children)
}

function updateHostComponent (fiber) {
  if (!fiber.dom) {
    // 1. 创建 dom
    const dom = (fiber.dom = createDom(fiber.type))
    // 2. 处理 props
    updateProps(dom, fiber.props)
  }
  // 3.转换链表，处理好指针
  const children = fiber.props.children
  initChildren(fiber, children)
}

function performUnitOfWork (fiber) {
  const isFunctionComponent = typeof fiber.type === 'function'
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  // 4.返回下一个要执行的任务
  if (fiber.child) return fiber.child
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }
}

function render (el, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [el]
    }
  }
  root = nextUnitOfWork
  requestIdleCallback(workLoop)
}


export default {
  render,
  createElement
}
