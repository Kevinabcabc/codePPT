const { ref } = VueReactivity;
import { Text } from '../symbols/symbols.js';

// 返回一个自定义组件，接受一个异步组件加载器作为参数
const defineAsyncComponent = (loader) => {
  // 一个变量用来储存异步加载组件
  let InnerComp = null;
  // 返回一个包装组件
  return {
    name: "AsyncComponentWrapper",
    setup() {
      // 异步加载是否成功
      const loaded = ref(false);
      // 执行加载器函数（返回一个Promise实例）
      // 加载成功后，将加载成功的组件赋值给InnerComp, 并将loaded标记为true
      loader().then(c => {
        InnerComp = c;
        loaded.value = true;
      });

      return () => {
        // 如果异步加载成功，则渲染该组件，否则渲染一个占位容器
        return loaded.value ? { type: InnerComp } : { type: Text, children: '' };
      }
    },
  }
}

export default defineAsyncComponent;
