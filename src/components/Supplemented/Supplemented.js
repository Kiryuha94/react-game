import Button from 'components/Button';
import React, { useState } from 'react';
const Supplmented = (props) => {
  const [color, setColor] = useState(props.backgroundColor);
  const [cellColor, setCellColor] = useState(props.cellBackgroundColor);
  const [zoom, setZoom] = useState(props.zoom);
  const [stateAudio, setAudio] = useState(props.stateAudio);

  const onChange = (e) => {
    setColor(e.target.value);
  };

  const onChangeCell = (e) => {
    setCellColor(e.target.value);
  };

  const onChangeZoom = (e) => {
    setZoom(e.target.value);
  };
  const onChangeAudioState = (e) => {
    setAudio(e.target.checked);
  };

  const onClose = () => {
    props.onClose({
      backgroundColor: color,
      cellBackgroundColor: cellColor,
      zoom,
      stateAudio,
    });
  };

  const onClickOk = () => {
    props.onClickOk({ backgroundColor: color, cellBackgroundColor: cellColor, zoom, stateAudio });
  };

  return (
    <div className="supplmented">
      <div>
        <div onClick={onClose} className="close">
          +
        </div>
        <label>
          Color background:
          <input defaultValue={color} type="color" onChange={onChange} />
        </label>
        <label>
          Color cell:
          <input defaultValue={cellColor} type="color" onChange={onChangeCell} />
        </label>
        <label>
          Setting zoom:
          <input className="zoom" type="range" min="5" max="21" step="2" value={zoom} onChange={onChangeZoom} />
        </label>
        <label>
          Audio:
          <input className="audio" type="checkbox" checked={stateAudio} onChange={onChangeAudioState} />
        </label>
        <Button onClick={onClickOk} title="OK" />
      </div>
    </div>
  );
};
export default Supplmented;
