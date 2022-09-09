const fs = require('fs');  
const path = require('path');  
  
//解析需要遍历的文件夹，我这以E盘根目录为例  
const publicPath = path.resolve(__dirname);  
  
//调用文件遍历方法  
fileDisplay(publicPath);

const versions = [];

/** 
 * 文件遍历方法 
 * @param filePath 需要遍历的文件路径 
 */
function fileDisplay(filePath) {
  //根据文件路径读取文件，返回文件列表  
  fs.readdir(filePath, function(err, files) {
    if (err) {  
      console.warn(err)  
    } else {  
      //遍历读取到的文件列表  
      files.forEach(function(filename) {  
        let versionIdx = null;
        //获取当前文件的绝对路径
        const fileDir = path.join(filePath, filename);  
        if (filename.includes('version_')) {
          console.log(22, filename, fileDir);
          versionIdx = Number(filename.split('_').pop());
          readVersionPath(fileDir, versionIdx);
        }
      });  
    }
  });
}


function readVersionPath(versionPath, idx) {
  // 文件list
  const dirArr = [];
  // 版本信息
  let info = {};
  read(versionPath);
  /** 
   * 文件遍历方法 
   * @param filePath 需要遍历的文件路径 
   */  
  function read(filePath) {
    //根据文件路径读取文件，返回文件列表  
    fs.readdir(filePath, function(err, files) {
      if (err) {  
        console.warn(err)  
      } else {  
        //遍历读取到的文件列表  
        files.forEach(function(filename) {  
          //获取当前文件的绝对路径  
          const fileDir = path.join(filePath, filename);  
          //根据文件路径获取文件信息，返回一个fs.Stats对象  
          fs.stat(fileDir, function(error,stats){  
            if (error) {  
              console.warn('获取文件stats失败');  
            } else {
              const isFile = stats.isFile(); //是文件  
              const isDir = stats.isDirectory(); //是文件夹  
              if (isFile) {
                if (fileDir.replace(publicPath, '').split('\\').pop() === 'info.json') {
                  fs.readFile(fileDir, (err, data) => {
                    if (err) {
                      console.error(err);
                      return;
                    }
                    info = data.toString();
                    if (info) {
                      info = JSON.parse(info)
                    }
                  });
                }
                dirArr.push(fileDir.replace(publicPath, ''));
              }
              if (isDir) {
                read(fileDir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件  
              }
            }
          });
        });  
      }
    });
  }

  setTimeout(() => {
    versions[idx] = {
      data: dirArr,
      path: versionPath.split('\\').pop(),
      info: info,
    }
  }, 1000);
}

setTimeout(() => {
  fs.writeFile('../src/config/file.config.js', `
const versions = ${JSON.stringify(versions)};
export default versions; 
  `,'utf8',function(error){
    if (error) {
        console.log(error);
        return false;
    }
    console.log('写入成功');
  });
}, 2000);
