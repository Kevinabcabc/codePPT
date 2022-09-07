/**
 * resolve props and attrs from propsData and component props options
 * @param {*} options 
 * @param {*} propsData 
 * @returns 
*/
export default function resolveProps(options, propsData) {
  const props = {};
  const attrs = {};

  for (const key in propsData) {
    if (key in options || key.startsWith('on')) {
      props[key] = propsData[key];
    } else {
      attrs[key] = propsData[key];
    }
  }

  return [props, attrs];
}