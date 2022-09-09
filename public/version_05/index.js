let retries = 0;
const maxRetries = 2;

function fetch() {
  return new Promise((resolve, reject) => {
    console.log('enter fetch promise');
    setTimeout(() => {
        console.log(' fetch promise reject err');
        reject('err');
    }, 1000);
  });
}

function load(onError) {
  const p = fetch();
  return p.catch(() => {
    console.log('load catch err');
    return new Promise((resolve, reject) => {
      const retry = () => {
        retries++;
        resolve(load(onError));
      };
      const fail = (msg) => reject(msg);
      onError(retry, fail);
    });
  });
}

load((retry, fail) => {
  console.log('retries ++', retries)
  if (retries >= maxRetries) {
    fail(`load fail after ${retries} times`);
    return;
  }
  retry();
})
.then((data) => {
  console.log('resolve data: ', data);
})
.catch(msg => {
  console.log(`catch err msg: ${msg}`);
})
.finally(() => {
  console.log('finally finished')
});
