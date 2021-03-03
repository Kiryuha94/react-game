import React from 'react';

const Button = (props) => {
  const { onClick, className } = props;

  return <button className={className} onClick={onClick}>{props.title}</button>;
};
export default Button;
