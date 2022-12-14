import React, { useState, useEffect } from 'react';
import './index.css';
import Sandbox from './sandbox';
import Progress from './progress';
import versions from '../config/file.config';
import fetchFiles from '../service/fetchFiles';

function App() {
  // useEffect(() => {
  //   console.log('mount');

  //   return () => {
  //     console.log('umount')
  //   }
  // }, []);
  // return 'hello world';
  const [files, setFiles] = useState(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    fetchFiles(versions[idx]).then((res) => {
      setFiles(res);
    });
  }, [versions, idx]);
  
  if (!files) {
    return null;
  }

  return (
    <div className='wrapper'>
      <Sandbox files={files} />
      <Progress selectIdx={idx} versions={versions} setIdx={setIdx} />
    </div>
  );
}

export default App;
