import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetUser } from '../store/userSlice';
import { resetPoll } from '../store/pollSlice';
import './KickedOut.css';

const KickedOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleTryAgain = () => {
    dispatch(resetUser());
    dispatch(resetPoll());
    localStorage.removeItem('studentName');
    navigate('/');
  };

  return (
    <div className="kicked-out-container">
      <div className="kicked-out-card">
        <div className="tag-wrapper">
             <span className="poll-tag">✨ Intervue Poll</span>
        </div>
        <div className="kicked-out-content">
          <h1>You’ve been <strong>Kicked out !</strong></h1>
          <p>Looks like the teacher had removed you from the poll system. <br/>Please Try again sometime.</p>
        </div>
      </div>
    </div>
  );
};

export default KickedOut;