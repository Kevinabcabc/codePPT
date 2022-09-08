// tools
import queueJob from '../tools/queueJob.js';
import resolveProps from '../tools/resolveProps.js';
import hasPropsChanged from '../tools/hasPropsChanged.js'
import lis from '../tools/lis.js';
// symbol
import { Text, Comment, Fragment } from '../symbols/symbols.js';
const { reactive, effect, shallowReactive, shallowReadonly } = VueReactivity;

// global variable
let currentInstance = null;
function setCurrentInstance(instance) {
  currentInstance = instance;
}

export default function createRenderer(options) {
  const {
    createElement,
    insert,
    createText,
    createComment,
    setElementText,
    patchProps,
  } = options;

  function render(vnode, container) {
    if (vnode) {
      // new vnode exist patch with old vnode
      patch(container._vnode, vnode, container);
    } else {
      if (container._vnode) {
        unmount(container._vnode);
      }
    }
    // save old vnode
    container._vnode = vnode;
  }

  /**
   * onMounted
   * @param {*} fn 
   */
  function onMounted(fn) {
    if (currentInstance) {
      currentInstance.mounted.push(fn);
    } else {
      console.error('onMounted can only run in setup function')
    }
  }

  window.onMounted = onMounted;

  function mountComponent(vnode, container, anchor) {
    // get type
    const componentOptions = vnode.type;
    // options
    let {
      render, data, setup = () => {}, props: propsOption, beforeCreate, created, beforeMount, mounted, beforeUpdate, updated
    } = componentOptions;

    // get slot
    const slot = vnode.children;

    // beforeCreate
    beforeCreate && beforeCreate();

    // reactive data
    const state = data ? reactive(data()) : null;

    // get props and attrs
    const [props, attrs] = resolveProps(propsOption, vnode.props);

    // custom component instance
    const instance = {
      state,
      props: shallowReactive(props),
      isMounted: false,
      subTree: null,
      slot,
      // save mounted function
      mounted: [],
    };
    // set current instance
    setCurrentInstance(instance);
    // emit handler
    function emit(event, ...payload) {
      const eventName = `on${event[0].toUpperCase() + event.slice(1)}`;
      const handler = instance.props[eventName];
      if (handler) {
        handler(...payload);
      } else {
        console.error('handler not exist')
      }
    }

    const setupContext = { attrs, emit };
    // run setup function
    const setupResult = setup(shallowReadonly(instance.props), setupContext);
    // after setup clear current instance
    setCurrentInstance(null);

    let setupState = null;
    if (typeof setupResult === 'function') {
      if (render) console.error('setup return render function, render option will be ignored')
      render = setupResult;
    } else {
      setupState = setupContext;
    }

    // Mount the component instance to the vnode for subsequent updates
    vnode.component = instance;

    const renderContext = new Proxy(instance, {
      get(t, k, r) {
        const { state, props, slot } = t;
        if (k === '$slot') return slot;
        if (state && k in state) {
          return state[k];
        } else if (k in props) {
          return props[k]
        } else {
          console.error(`get ${k} error, not exist`)
        }
      },
      set(t, k, v, r) {
        const { state, props } = t;
        if (state && k in state) {
          state[k] = v
        } else if (k in props) {
          props[k] = v;
        } else {
          console.error(`set ${k} error not exist`)
        }
        return true;
      }
    });

    // instance created
    created && created.call(renderContext);

    effect(() => {
      const subTree = render.call(renderContext, renderContext);
      if (!instance.isMounted) {
        // beforeMount
        beforeMount && beforeMount.call(renderContext);

        patch(null, subTree, container, anchor);
        instance.isMounted = true;

        // mounted
        mounted && mounted.call(renderContext);
        instance.mounted && instance.mounted.forEach(hook => hook.call(renderContext));
      } else {
        // beforeUpdate
        beforeUpdate && beforeUpdate.call(renderContext);

        patch(instance.subTree, subTree, container, anchor);

        // updated
        updated && updated.call(renderContext);
      }
      instance.subTree = subTree;
    },{
      scheduler: queueJob,
    }
    );
  }

  function patchComponent(n1, n2, anchor) {
    // get component instance
    const instance = n2.component = n1.component;

    // get current props data
    const { props } = instance;
    // check if props changed if changed update
    if (hasPropsChanged(n1.props, n2.props)) {
      const [nextProps] = resolveProps(n2.type.props, n2.props);
      // update props
      for (const k in nextProps) {
        props[k] = nextProps[k];
      }
      // delete un exist props
      for (const k in props) {
        if (!(k in nextProps)) delete props[k];
      }
    }
  }

  function patch(n1, n2, container, anchor) {
    // if n1 exist, compare type
    if (n1 && n1.type !== n2.type && n1.key !== n2.key) {
      // if different type, unmount n1
      unmount(n1);
      n1 = null;
    }
    const { type } = n2;
    if (typeof type === 'string') {
      // normal tag
      if (!n1) {
        mountElement(n2, container, anchor);
      } else {
        patchElement(n1 , n2);
      }
    } else if (type === Text) {
      // text node
      if (!n1) {
        const el = n2.el = createText(n2.children);
        insert(el, container);
      } else {
        const el = n2.el = n1.el;
        el.newNodeValue = n2.children;
      }
    } else if (type === Comment) {
      // comment node
      if (!n1) {
        const el = n2.el = createComment(n2.children);
        insert(el, container);
      } else {
        const el = n2.el = n1.el;
        el.newNodeValue = n2.children;
      }
    } else if (type === Fragment) {
      // comment node
      if (!n1) {
        n2.children.forEach(c => patch(null, c, container));
      } else {
        patchChildren(n1, n2, container);
      }
    } else if (typeof type === 'object') {
      // means component node
      if (!n1) {
        mountComponent(n2, container, anchor);
        // 不同类型自定义组件卸载
      } else if (n1.type.name !== n2.type.name) {
        unmount(n1);
        mountComponent(n2, container, anchor);
      } else {
        patchComponent(n1, n2, anchor);
      }
    } else {
      // other type vnode
    }
  }

  function patchElement(n1, n2) {
    const el = n2.el = n1.el;
    const oldProps = n1.props || {};
    const newProps = n2.props || {};

    // first update properties
    for (const key in newProps) {
      if (newProps[key] !== oldProps[key]) {
        patchProps(el, key, oldProps[key], newProps[key]);
      }
    }
    for (const key in oldProps) {
      if (!(key in newProps)) {
        patchProps(el, key ,oldProps[key], null);
      }
    }

    // update children
    patchChildren(n1, n2, el);
  }

  function patchChildren(n1, n2, container) {
    if (typeof n2.children === 'string') {
      if (Array.isArray(n1.children)) {
        n1.children.forEach((c) => unmount(c));
      }
      setElementText(container, n2.children);
    } else if (Array.isArray(n2.children)) {
      if (Array.isArray(n1.children)) {
        patchKeyedChildren(n1, n2, container);
      } else {
        // old DOM is text node or null
        // clear current text node then patch children
        setElementText(container, '');
        n2.children.forEach((c) => patch(null, c, container));
      }
    } else {
      // means new vnode this node do not exist
      if (Array.isArray(n1.children)) {
        n1.children.forEach(c => unmount(c));
      } else if (typeof n1.children === 'string') {
        setElementText(container, '');
      }
      // if n1.children and n2.children all null do nothing
    }
  }

  function patchKeyedChildren(n1, n2, container) {
    const newChildren = n2.children;
    const oldChildren = n1.children;
    let j = 0;
    let oldVNode = oldChildren[j];
    let newVNode = newChildren[j];
    // handle same start node
    while (oldVNode && newVNode && oldVNode.key === newVNode.key) {
      patch(oldVNode, newVNode, container);
      j++;
      oldVNode = oldChildren[j];
      newVNode = newChildren[j];
    }
    // handle same end node
    let oldEnd = oldChildren.length -1;
    let newEnd = newChildren.length - 1;
    oldVNode = oldChildren[oldEnd];
    newVNode = newChildren[newEnd];
    while (oldVNode && newVNode && oldVNode.key === newVNode.key) {
      patch(oldVNode, newVNode, container);
      oldVNode = oldChildren[--oldEnd];
      newVNode = newChildren[--newEnd];
    }
    if (newEnd < 0 || oldVNode < 0) {
      return;
    }
    
    // handle new node
    if (j > oldEnd && j <= newEnd) {
      const anchorIndex = newEnd + 1;
      const anchor = anchorIndex < newChildren.length ? newChildren[anchorIndex].el : null;
      // mount new node
      while (j <= newEnd) {
        patch(null, newChildren[j++], container, anchor);
      }
    } else if (j > newEnd && j <= oldEnd) {
      // unmount old node
      while (j <= oldEnd) {
        unmount(oldChildren[j++]);
      }
    } else {
      // handle other case
      const count = newEnd - j + 1;
      // new list node's index in old list
      const source = new Array(count).fill(-1);

      const oldStart = j;
      const newStart = j;
      let move = false;
      let pos = 0;
      
      // construct new node key-newIndex map
      const keyIndex = {};
      for (let i = newStart; i <= newEnd; i++) {
        keyIndex[newChildren[i].key] = i;
      }
      // patched node num
      let patched = 0;
      // handle unhandled node
      for (let i = oldStart; i <= oldEnd; i++) {
        const oldVNode = oldChildren[i];
        // old node in new list index
        const k = keyIndex[oldVNode.key];
        if (typeof k !== 'undefined') {
          const newVNode = newChildren[k];
          // patch all already exist node
          patch(oldVNode, newVNode, container);
          patched++;
          // source index means new node list index in old node list
          source[k - newStart] = i;
          if (k < pos) {
            move = true;
          } else {
            pos = k;
          }
        } else {
          unmount(oldVNode);
        }
      }

      if (move) {
        const seq = lis(source);
        let s = seq.length - 1;
        let i = count - 1;
        for (i; i >= 0; i--) {
          if (source[i] === -1) {
            // mount new node
            const pos = i + newStart;
            const newVNode = newChildren[pos];
            const nextPos = pos + 1;
            const anchor = nextPos < newChildren.length ? newChildren[nextPos].el : null;
            patch(null, newVNode, container, anchor);
          } else if (i !== seq[s]) {
            // move old node
            const pos = i + newStart;
            const newVNode = newChildren[pos];
            const nextPos = pos + 1;
            const anchor = nextPos < newChildren.length ? newChildren[nextPos].el : null;
            insert(newVNode.el, container, anchor);
          } else {
            // same node continue
            s--;
          }
        }
      }
    }
  }

  function hydrate(vnode, container) {
    // hydrate
  }

  function unmount(vnode) {
    if (vnode.type === Fragment) {
      vnode.children.forEach(c => unmount(c));
      return;
    } else if (typeof vnode.type === 'object') {
      vnode.component?.subTree && unmount(vnode.component.subTree);
      return;
    }

    // old vnode exist means unmount operation
    // unmount exact element
    const parent = vnode.el?.parentNode;
    if (parent) parent.removeChild(vnode.el);
  }

  // simple mount function
  function mountElement(vnode, container, anchor) {
    // bind element to vnode.el
    const el = vnode.el = createElement(vnode.type);
  
    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children);
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach(child => {
        patch(null, child, el);
      });
    }

    if (vnode.props) {
      for (const key in vnode.props) {
        patchProps(el, key, null, vnode.props[key]);
      }
    }

    insert(el, container, anchor);
  }

  return {
    render,
    hydrate,
  }
}
