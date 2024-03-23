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

function render (el, container) {
  // 1. 创建 dom 节点
  const dom = el.type === 'TEXT_NODE' ? document.createTextNode('') : document.createElement(el.type)
  // 2. 添加 props
  Object.keys(el.props).forEach(key => {
    if (key !== 'children') {
      dom[key] = el.props[key]
    }
  })
  const children = el.props.children
  children.forEach(child => {
    return render(child, dom)
  })
  // 3. 添加父容器
  container.append(dom)
}

export default {
  render,
  createElement,
}
