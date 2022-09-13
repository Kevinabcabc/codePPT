import renderer from './renderer/index.js';
import KeepAlive from './components/keepAlive.js';

const Tab = {
  render() {
    return {
      type: 'div',
      children: 'keptAlive component1',
    };
  }
}

// 根组件
const App = {
  name: 'app',
  render() {
    return {
      type: KeepAlive,
      children: {
        default() {
          return {
            type: Tab,
          };
        }
      }
    }
  }
}

// 虚拟DOM
const componentVNode = {
  type: App,
}

// 渲染虚拟DOM
renderer.render(componentVNode, document.querySelector('#root'));
