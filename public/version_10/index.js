import renderer from './renderer/index.js';
import KeepAlive from './components/keepAlive.js';

const Tab1 = {
  render() {
    return {
      type: 'div',
      props: {
        onClick: () => {
          window.refreshKeepAlive();
          console.log('隐藏容器：', window.storageContainer);
        },
      },
      children: 'keptAlive component1 (click switch component2)',
    };
  }
}

const Tab2 = {
  render() {
    return {
      type: 'div',
      props: {
        onClick: () => {
          window.refreshKeepAlive();
          console.log('隐藏容器：', window.storageContainer);
        },
      },
      children: 'keptAlive component2 (click switch component1)',
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
        default(key) {
          if (key === '1') {
            return {
              type: Tab1,
            };
          } else if (key === '2') {
            return {
              type: Tab2,
            };
          }
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
