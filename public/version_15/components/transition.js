const Transition = {
  __isTransition: true,
  setup(props, { slot }) {
    let key = true;
    return () => {
      // 获取默认插槽
      const innerVNode = slot.default(key);
      key = false;
      innerVNode.transition = {
        beforeEnter(el) {
          el.style.height = '100px';
          el.style.width = '100px';
          el.style.backgroundColor = 'red';
  
          el.style.transition = 'transform 1s ease-in-out';
          el.style.transform = 'translateX(0)';
        },
        enter(el) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.transform = 'translateX(200px)';
              el.addEventListener('transitionend', () => {
                el.style.transition = '';
              });
            });
          });
        },
        leave(el, performRemove) {
          el.style.transition = 'transform 1s ease-in-out';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.transform = 'translateX(0)';
              el.addEventListener('transitionend', () => {
                el.style.transform = '';
                el.style.transition = '';
                performRemove();
              });
            });
          });
        }
      }
      return innerVNode;
    }
  }
};

export default Transition;
