function fetchFiles(fileData) {
  const { path, data: files, } = fileData;

  return new Promise((resolve, reject) => {
    const ps = [];
    files.forEach((element) => {
      ps.push(fetch(`http://localhost:3000/${element}`).then(res => res.text()))
    });

    Promise.all(ps).then((res) => {
      const fileMap = {};
      
      for (let i = 0; i < files.length; i++) {
        fileMap[files[i].replaceAll('\\', '/').replace(`/${path}`, '')] = {
          readOnly: false,
          code: res[i],
          hidden: false,
        };
      }
      resolve(fileMap);
    });
  });
}

export default fetchFiles;