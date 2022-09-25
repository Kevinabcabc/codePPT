import defineAsyncComponent from './components/defineAsyncComponent.js';
import renderer from './renderer/index.js';

// 同步组件
const SyncComponent = {
  name: 'syncComponent',
  data() {
    return {
      name: 'Tom',
    }
  },
  render() {
    return {
      type: 'div',
      props: {
        onClick: () => {
          this.name = 'Terry';
        }
      },
      children: `Sync Component:  My name is ${this.name}`,
    }
  }
}

// 异步组件
const AsyncComponent = defineAsyncComponent(() => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      name: 'AsyncComponent',
      data() {
        return {
          name: 'Kangkang',
        }
      },
      render() {
        return {
          type: 'div',
          props: {
            onClick: () => {
              this.name = 'Maria';
            }
          },
          children: `Async Component:  My name is ${this.name}`,
        }
      }
    });
  }, 1000);
}));

// 根组件
const App = {
  name: 'app',
  render() {
    return {
      type: 'div',
      children: [
        {
          type: SyncComponent,
        },
        {
          type: AsyncComponent,
        },
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
