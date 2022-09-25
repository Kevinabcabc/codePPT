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

// 异步组件loader
const loader = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('error component'));
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
  }, 2000);
});

const CustomErrorComponent = {
  name: 'CustomErrorComponent',
  render() {
    return {
      type: 'div',
      children: `custom error component: timeout`,
    }
  }
};

// 异步组件
const AsyncComponent = defineAsyncComponent({
  loader,
  timeout: 3000,
  errorComponent: CustomErrorComponent,
});

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
