const Teleport = {
  __isTeleport: true,
  process(n1, n2, container, anchor, internals) {
    // 获取内部渲染方法
    const { patch, patchChildren } = internals;
    // 挂载
    if (!n1) {
      // 获取挂载节点
      const target = typeof n2.props.to === 'string' ? document.querySelector(n2.props.to) : n2.props.to;
      // 将n2.children渲染到指定挂载节点即可
      n2.children.forEach(c => patch(null, c, target, anchor));
      return;
    } else {
      // 更新
      patchChildren(n1, n2, container);
    }

    if (n2.props.to !== n1.props.to) {
      // 获取新的容器
      const newTarget = typeof n2.props.to === 'string' ? document.querySelector(n2.props.to) : n2.props.to;
      // 移动DOM到新的容器
      n2.children.forEach(c => move(c, newTarget));
    }
  }
};

export default Teleport;