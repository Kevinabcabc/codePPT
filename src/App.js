import './App.css';
import { Sandpack } from "@codesandbox/sandpack-react";
import renderer from './source/js/renderer.js?raw-loader';

const index = `
  import renderer from './renderer.js';
  const { effect, ref } = VueReactivity;

const bol = ref(true);

effect(() => {
  const oldNode = {
    type: 'div',
    props: {
      onClick() {
        bol.value = false;
      },
    },
    children: [
      { type: 'p', children: '1', key: 1 },
      { type: 'p', children: '2', key: 2 },
      { type: 'p', children: '6', key: 6 },
      { type: 'p', children: '5', key: 5 },
      { type: 'p', children: '3', key: 3 },
      { type: 'p', children: '4', key: 4 },
    ],
  }

  const newNode = {
    type: 'div',
    children: [
      { type: 'p', children: '11', key: 1 },
      { type: 'p', children: '55', key: 5 },
      { type: 'p', children: '33', key: 3 },
      { type: 'p', children: '66', key: 6 },
      { type: 'p', children: '22', key: 2 },
      { type: 'p', children: '77', key: 7 },
      { type: 'p', children: '44', key: 4 },
    ],
  }

  const MyComponent = {
    name: 'MyComponent',
    data() {
      return {
        foo: 'Kevin',
      }
    },
    render() {
      console.log(333, this)
      return {
        type: 'div',
        props: {
          onClick: () => {
            console.log(11, this);
            this.foo = 'Tom';
            this.foo = 'Terry';
          }
        },
        children: this.foo,
      }
    }
  }

  const componentVNode = {
    type: MyComponent,
  }

  // renderer.render(bol.value ? oldNode : newNode, document.querySelector('#app'));
  renderer.render(componentVNode, document.querySelector('#app'));
});
`;


function App() {
  return (
    <Sandpack 
      theme="dark"
      files={{
        "/index.js": index,
        "/renderer.js": renderer,
      }}
      options={{
        showTabs: true,
        editorHeight: window.innerHeight - 50,
        externalResources: [
          "https://unpkg.com/@vue/reactivity@3.0.5/dist/reactivity.global.js",
        ],
      }}
      customSetup={{
        entry: "/index.js",
      }}
    />
  );
}

export default App;
