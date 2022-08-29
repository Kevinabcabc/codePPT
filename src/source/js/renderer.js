const { reactive, effect } = VueReactivity;

const Text = Symbol();
const Comment = Symbol();
const Fragment = Symbol();

/** Returns an array of longest increasing subsequences
 * @param {number[]} nums
 * @return {number}
 */
const lis = function(nums) {
  const list = new Array(nums.length).fill(1);
  const lisList = [];
  let max = 1;

  for (let i = 0; i < nums.length; i++) {
      let currentOpsMax = list[i];
      for (j = i; j >= 0; j--) {
          const sum = list[i] + list[j];
          if (nums[i] > nums[j] && sum > currentOpsMax) {
              currentOpsMax = sum;
          }
      }
      list[i] = currentOpsMax;
      if (currentOpsMax > max) {
          max = currentOpsMax;
      }
  }

  for (let i = list.length - 1; i >= 0; i--) {
      if (list[i] === max) {
        lisList.unshift(i);
          max--;
      }
  }
  return lisList;
};

function createRenderer(options) {

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
    console.log(213, container)
    container._vnode = vnode;
  }

  function mountComponent(vnode, container, anchor) {
    // get type
    const componentOptions = vnode.type;
    // get render function
    const { render, data } = componentOptions;
    // get data
    const state = reactive(data());
    effect(() => {
      // get vnode
      const subTree = render.call(state, state);
      patch(null, subTree, container, anchor)
    });

  }

  function patchComponent() {

  }

  function patch(n1, n2, container, anchor) {
    // if n1 exist, compare type
    if (n1 && n1.type !== n2.type) {
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
        patchProps(el, key, oldProps[key], newProps[key])
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
    while (oldVNode.key === newVNode.key) {
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
    while (oldVNode.key === newVNode.key) {
      patch(oldVNode, newVNode, container);
      oldVNode = oldChildren[--oldEnd];
      newVNode = newChildren[--newEnd];
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
      let moved = false;
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
    }
    // old vnode exist means unmount operation
    // unmount exact element
    const parent = vnode.el.parentNode;
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

function shouldSetAsProps(el, key, value) {
  // special form HTML Attribute readonly
  if (key === 'form' && el.tagName === 'INPUT') return false;
  // if key in el means DOM attribute 
  return key in el
}

const renderer = createRenderer({
  createElement(tag) {
    return document.createElement(tag);
  },
  setElementText(el, text) {
    el.textContent = text;
  },
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor);
  },
  createText(text) {
    return document.createTextNode(text);
  },
  createComment(text) {
    return document.createComment(text);
  },
  patchProps(el, key, preValue, nextValue) {
    if (/^on/.test(key)) {
      const invokers = el._vei || (el._vei = {});
      const name = key.slice(2).toLowerCase();
      let invoker = invokers[name];
      if (nextValue) {
        if (!invoker) {
          invoker = el._vei[name] = (e) => {
            if (e.timeStamp < invoker.attached) return
            // event maybe multiple
            if (Array.isArray(invoker.value)) {
              invoker.value.forEach((fn) => fn(e))
            } else {
              invoker.value(e);
            }
          }
          invoker.value = nextValue;
          // add invoker bind event time
          invoker.attached = performance.now();
          el.addEventListener(name, invoker);
        } else {
          invoker.value = nextValue;
        }
      } else if (invoker) {
        el.removeEventListener(name, invoker);
      }
    } else if (key === 'class') {
      el.className = nextValue || '';
    } else if (shouldSetAsProps(el, key, nextValue)) {
      const type = typeof el[key];
      // if property is boolean and value is '', so it's true
      if (type === 'boolean' && nextValue === '') {
        el[key] = true;
      } else {
        el[key] = nextValue;
      }
    } else {
      // set HTML Attribute
      el.setAttribute(key, nextValue);
    }
  }
});

export default renderer;