import renderer from './renderer/index.js';
import Transition from './components/transition.js';


// 根组件
const App = {
  name: 'app',
  render() {
    return {
      type: Transition,
      children: {
        default(key) {
          if (key) {
            return {
              type: 'div',
              props: {
                onClick: () => {
                  window.refreshKeepAlive();
                }
              },
              children: '我是要过渡的元素div'
            };
          } else {
            return { type: 'span', children: '' }
          }
        }
      },
    }
  }
}

// 虚拟DOM
const componentVNode = {
  type: App,
}

// 渲染虚拟DOM
renderer.render(componentVNode, document.querySelector('#root'));
