import React, { PureComponent } from 'react';

class Field extends PureComponent {
  onClick = (i) => () => {
    const { onCellClick } = this.props;
    onCellClick(i);
  };

  render() {
    const { field, cellColor } = this.props;
    const color = { background: cellColor };
    return (
      <>
        <div className="field">
          {field.map((value, index) => {
            return (
              <div style={color} key={index} className="sell" onClick={this.onClick(index)}>
                {value ? value : ''}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

export default Field;
