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
      <div className='scroll-box' style={{width: `${versions.length * 184 + 8}px`}}>
        {versions.map((version, idx) => <Card key={idx} selectIdx={selectIdx} setIdx={setIdx} versionInfo={version} idx={idx} />)}
      </div>
    </div>
  )
}

export default Progress;
