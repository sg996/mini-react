## `01-实现最简 mini-react`

### 目标：在页面中呈现 app

- v01 一步步实现 vDom 创建和 render
- v02 jsx 版本

### FAQ

- 为什么 React vDom 对象中的 children 要设计在 props 中？
  - ~~为了更好地支持组件的组合和嵌套，提高开发效率和代码清晰度（龟腚）~~

### 收获

- 一步步实现 vDom 创建和 render
  - 封装 createElement 用于创建 vDom;
  - 初步了解到 render 方法功能：创建 dom，处理 props，过滤 children 进行递归调用 render， 添加父容器；
- Vite 内置了对 JSX 的支持，会在构建过程中将 JSX 转换为对应的 react.createElement 调用，得到 vDom 对象，该功能基于 [esbuild](https://esbuild.github.io/content-types/#jsx) 的处理；
- 可以通过[jsx pragma](https://www.gatsbyjs.com/blog/2019-08-02-what-is-jsx-pragma/) 自定义`react.createElement`名称；
- rest 参数，相关知识点[Rest 参数与 Spread 语法](https://zh.javascript.info/rest-parameters-spread)，基于此处想到日常工作中用到的小技巧点分享出来：
``` js
// 场景：在提交数据时，快速优雅过滤掉对象中的指定参数

const params = {
  id: '1',
  firstName: 'foo',
  lastName: 'bar',
  fullName: 'foo bar',
}

// 之前用法
const temp = cloneDeep(params)
delete temp.fullName
// 提交 temp

// 现在用法
const { fullName, ...spread } = params
// 提交 spread  { id: '1', firstName: 'foo', lastName: 'bar' }
```
