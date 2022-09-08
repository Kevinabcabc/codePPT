const { ref, shallowRef } = VueReactivity;
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
      // 定义error，当错误发生时，用来储存错误对象
      const error = shallowRef(null);
      // loading 标识
      const loading = ref(false);

      let loadingTimer = null;
      // 如果配置项中存在delay，则开启一个定时器，当延迟到时后将loading.value设置为true
      if (options.delay) {
        loadingTimer = setTimeout(() => {
          loading.value = true;
        }, options.delay);
      } else {
        loading.value = true;
      }

      // 执行加载器函数（返回一个Promise实例）
      // 加载成功后，将加载成功的组件赋值给InnerComp, 并将loaded标记为true
      loader().then(c => {
        InnerComp = c;
        loaded.value = true;
      })
      // 捕获加载过程中的错误
      .catch((err) => error.value = err)
      .finally(() => {
        loading.value = false;
        // 加载完成后，清除定时器
        clearTimeout(loadingTimer);
      });

      let timer = null;
      if (options.timeout) {
        // 如果指定超时时长，则开启一个定时器计时
        timer = setTimeout(() => {
          // 超时后，创建一个错误对象，复制给error.value
          const err = new Error(`Async component timed  out after ${options.timeout}ms`)
          error.value = err;
        }, options.timeout);
      }

      // 卸载完成后清除定制器
      // onUmounted(() => clearTimeout(timer));

      // 占位内容
      const placeholder = { type: Text, children: '' };

      return () => {
        // 模拟 卸载完成后清除定制器
        if (loaded.value || error.value) clearTimeout(timer);

        if (loaded.value && !error.value) {
          // 异步组件加载成功
          return { type: InnerComp, key: 'async1' };
        } else if (error.value && options.errorComponent && !loaded.value) {
          // 如果加载超时，并且用户指定了Error组件，则渲染该组件
          return { type: options.errorComponent, props: { error: error.value}, key: 'async1' };
        } else if (loading.value && options.loadingComponent) {
          // 异步组件正在加载并且用户指定了Loading组件，则渲染Loading组件
          return { type: options.loadingComponent, key: 'async1' };
        }
        // 渲染一个占位容器
        return placeholder;
      }
    },
  }
}

export default defineAsyncComponent;
