const KeepAlive = {
  __isKeepAlive: true,
  props: {
    // 显式缓存应该被缓存的组件
    include: RegExp,
    // 显式缓存不应该被缓存的组件
    exclude: RegExp,
  },
  setup(props, { slot }) {
    // 创建缓存对象
    // key: vnode.type
    // value: vnode
    const cache = new Map();
    // 当前KeepAlive的实例
    const instance = currentInstance;
    // 对于KeepAlive组件来说，它的实例上存在特殊的KeepAliveCtx对象，该对象由渲染器注入
    // 该对象会暴露渲染器的一些方法，其中move函数用来将一段DOM移动到另一个容器中
    const { move, createElement } = instance.keepAliveCtx;

    // 创建隐藏容器
    const storageContainer = createElement('div');

    window.storageContainer = storageContainer;

    // keepAlive组件的实例上会被添加两个内部函数，分别是_deActivate和_activate
    // 这两个函数会在渲染器中被调用
    instance._deActivate = (vnode) => {
      move(vnode, storageContainer);
    }
    instance._activate = (vnode, container, anchor) => {
      move(vnode, container, anchor);
    }

    let key = '1';

    return () => {
      if (key === '1') {
        key = '2'
      } else if (key === '2') {
        key = '1'
      }
      // KeepAlive 默认插槽就是要被KeepAlive的组件
      let rawVNode = slot.default(key);

      // 如果不是组件，直接渲染即可，因为非组件的虚拟节点无法被KeepAlive
      if (typeof rawVNode.type !== 'object') {
        return rawVNode;
      }

      const name = rawVNode.type.name;

      if (name && (
        (props.include && !props.include.test(name)) ||
        (props.exclude && props.exclude.test(name))
      )) {
        return rawVNode;
      }

      // 在挂载时先获取缓存组件的vnode
      const cachedVNode = cache.get(rawVNode.type);

      if (cachedVNode) {
        // 如果有缓存内容，则说明不应该执行挂载，而应该执行激活
        // 继承组件实例
        rawVNode.component = cachedVNode.component;
        // 在vnode上添加keptAlive属性，标记为true，避免渲染器重新挂载它
        rawVNode.keptAlive = true;
      } else {
        // 如果没有缓存，则将其添加到缓存中，这样下次激活组件就不会执行新的挂载动作了
        cache.set(rawVNode.type, rawVNode);
      }

      // 在组件vnode上添加shouldKeepAlive属性，并标记为true，避免渲染器真的将组件卸载
      rawVNode.shouldKeepAlive = true;
      // 将KeepAlive组件的实例也添加到vnode上，以便在渲染器将组件真的卸载
      rawVNode.keepAliveInstance = instance;
      // 返回组件vnode
      return rawVNode;
    }
  }
};

export default KeepAlive;
