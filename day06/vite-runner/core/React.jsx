let wipRoot = null
let nextUnitOfWork = null
let wipFiber = null
let deletions = []

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

function updateProps (dom, nextProps, prevProps = {}) {
  // 1、old 有，new 没有 删除
  Object.keys(prevProps).forEach(key => {
    if (key !== 'children') {
      if (!(key in nextProps)) {
        dom.removeAttribute(key)
      }
    }
  })
  // 2、new 有，old 没有 添加
  // 3、new 有， old 有 更新
  Object.keys(nextProps).forEach(key => {
    if (key !== 'children') {
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith('on')) {
          const eventType = key.slice(2).toLocaleLowerCase()
          dom.removeEventListener(eventType, prevProps[key])
          dom.addEventListener(eventType, nextProps[key])
        } else {
          dom[key] = nextProps[key]
        }
      }
    }
  })
}

function reconcileChildren (fiber, children) {
  let oldFiber = fiber.alternate?.child
  let prevChild = null
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type
    let newFiber
    if (isSameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        effectFlag: 'update',
        alternate: oldFiber
      }
    } else {
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          parent: fiber,
          sibling: null,
          dom: null,
          effectFlag: 'placement'
        }
      }
      if (oldFiber) {
        deletions.push(oldFiber)
      }
    }
    if (oldFiber) {
      oldFiber = oldFiber?.sibling
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    if (newFiber) {
      prevChild = newFiber
    }
  })

  // 删除多余老节点
  while (oldFiber) {
    deletions.push(oldFiber)
    oldFiber = oldFiber.sibling
  }
}

function commitDeletion (fiber) {
  if (fiber.dom) {
    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent
    }
    fiberParent.dom.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child)
  }
}

function commitRoot () {
  deletions.forEach(commitDeletion)
  commitWork(wipRoot.child)
  wipRoot = null
  deletions = []
}

function commitWork (fiber) {
  if (!fiber) return
  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }
  if (fiber.effectFlag === 'update') {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
  } else if (fiber.effectFlag === 'placement') {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom)
    }
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function workLoop (deadline) {
  let shouldYield = false
  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)

    if (wipFiber?.sibling?.type === nextUnitOfWork?.type) {
      console.log(wipFiber?.sibling?.type, nextUnitOfWork?.type);
      nextUnitOfWork = undefined
    }

    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}

function updateFunctionComponent (fiber) {
  wipFiber = fiber
  // 3.转换链表，处理好指针
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
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
  reconcileChildren(fiber, children)
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
  wipRoot = {
    dom: container,
    props: {
      children: [el]
    }
  }
  nextUnitOfWork = wipRoot
}

function update () {
  let currentFiber = wipFiber
  return () => {
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber
    }
    nextUnitOfWork = wipRoot
  }
}

requestIdleCallback(workLoop)

export default {
  update,
  render,
  createElement
}
