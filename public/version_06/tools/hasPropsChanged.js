/**
 * check if props changed
 * @param {*} prevProps 
 * @param {*} nextProps 
 */
 export default function hasPropsChanged(prevProps = {}, nextProps = {}) {
  const nextKeys = Object.keys(nextProps);
  // if length different return true
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  // if key-value not match return true
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key]) return true;
  }
  return false;
}
