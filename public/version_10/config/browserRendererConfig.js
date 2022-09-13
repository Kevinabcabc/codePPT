export const Text = Symbol();
export const Comment = Symbol();
export const Fragment = Symbol();
import shouldSetAsProps from "../tools/shouldSetAsProps.js";

const browserRendererConfig = {
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
    console.log(111,  el,key,nextValue);
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
}

export default browserRendererConfig;