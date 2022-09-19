import renderer from './renderer/index.js';
import Teleport from './components/teleport.js';


// 根组件
const App = {
  name: 'app',
  render() {
    return {
      type: 'div',
      props: {
        class: 'wrapper'
      },
      children: [
        { type: 'div', children: 'app' },
        {
          type: Teleport,
          props: {
            to: 'body',
          },
          children: [
            { type: 'h1', children: 'Title' },
            { type: 'p', children: 'content' },
          ],
        }
      ],
    }
  }
}

// 虚拟DOM
const componentVNode = {
  type: App,
}

// 渲染虚拟DOM
renderer.render(componentVNode, document.querySelector('#root'));
