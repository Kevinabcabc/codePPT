import React, { useState, useMemo } from 'react';
import { Checkbox, Label } from '@rebass/forms';
import './index.css';

function Card({
  versionInfo,
  idx,
  setIdx,
  selectIdx,
}) {
  // const [checked, setChecked] = useState(false);
  return (
    <div className='progress-card-wrapper' onClick={() => setIdx(idx)}>
      <div className={`progress-card ${selectIdx === idx ? 'progress-card-active' : ''}`}>
        <div className='progress-title'>
          <div className='progress-title-num'>{idx + 1}.</div>
          <div className='progress-title-text'>{versionInfo.info.title}: {versionInfo.info.info}</div>
        </div>
        {/* <div className='progress-checkbox'>
          <Label
            onChange={() => setChecked(!checked)}
          >
            <Checkbox
              id='done'
              name='done'
              size="16px"
              color="white"
              className='progress-checkbox'
            />
          </Label>
        </div> */}
      </div>
    </div>
  );
}

export default Card;
