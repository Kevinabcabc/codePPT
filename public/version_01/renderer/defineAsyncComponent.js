const { ref } = VueReactivity;
import { Text } from '../symbols/symbols.js';

/**
 * 返回一个自定义组件，接受一个异步组件加载器作为参数
 * @param {*} options options 可以是配置项也可以是加载器
 * @returns 包装组件
 */
const defineAsyncComponent = (options) => {
  // 如果options是加载器将其格式化为配置项形式
  if (typeof options === 'function') {
    options = {
      loader: options,
    }
  }

  const { loader } = options;

  // 一个变量用来储存异步加载组件
  let InnerComp = null;
  // 返回一个包装组件
  return {
    name: "AsyncComponentWrapper",
    setup() {
      // 异步加载是否成功
      const loaded = ref(false);
      // 代表是否超时，默认为false，即没有超时
      const timeout = ref(false);

      // 执行加载器函数（返回一个Promise实例）
      // 加载成功后，将加载成功的组件赋值给InnerComp, 并将loaded标记为true
      loader().then(c => {
        InnerComp = c;
        loaded.value = true;
      });

      let timer = null;
      if (options.timeout) {
        // 如果指定超时时长，则开启一个定时器计时
        timer = setTimeout(() => {
          // 超时后
          timeout.value = true;
        }, options.timeout);
      }

      // 卸载完成后清除定制器
      // onUmounted(() => clearTimeout(timer));

      // 占位内容
      const placeholder = { type: Text, children: 'loading...' };

      return () => {
        if (loaded.value && !timeout.value) {
          // 异步组件加载成功
          return { type: InnerComp };
        } else if (timeout.value) {
          // 如果加载超时，并且用户指定了Error组件，则渲染该组件
          return options.errorComponent ? { type: options.errorComponent } : placeholder;
        }
        // 渲染一个占位容器
        return loaded.value ? { type: InnerComp } : placeholder;
      }
    },
  }
}

export default defineAsyncComponent;
