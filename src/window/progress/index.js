import React from 'react';
import './index.css';
import Card from './card';

function Progress({
  selectIdx,
  setIdx,
  versions,
}) {
  return (
    <div className='progress-box'>
      <div className='scroll-box'>
        {versions.map((version, idx) => <Card key={idx} selectIdx={selectIdx} setIdx={setIdx} versionInfo={version} idx={idx} />)}
      </div>
    </div>
  )
}

export default Progress;
