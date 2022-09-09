/**
 * shouldSetAsProps
 * @param {*} el 
 * @param {*} key 
 * @param {*} value 
 * @returns boolean
 */
 export default function shouldSetAsProps(el, key, value) {
  // special form HTML Attribute readonly
  if (key === 'form' && el.tagName === 'INPUT') return false;
  // if key in el means DOM attribute 
  return key in el
}