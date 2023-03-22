import React from 'react';

interface BackdropProps {
  show: boolean;
  onClick?: React.MouseEventHandler;
}

const Backdrop: React.FC<BackdropProps> = ({ show, onClick }) => {
  return <div className="modal-backdrop show" style={{ display: show ? 'block' : 'none' }} onClick={onClick} />;
};

export default Backdrop;
