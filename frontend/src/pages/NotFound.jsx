/* eslint-disable no-unused-vars */
import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#f8f9fa',
        textAlign: 'center',
        padding: '40px',
      }}
    >
      <h1 style={{ fontSize: '72px', marginBottom: '0', color: '#ff4d4f' }}>
        404
      </h1>
      <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>
        Page Not Found
      </h2>
      <p style={{ marginBottom: '24px', maxWidth: '500px' }}>
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Button type="primary" onClick={() => navigate('/')}>
        Go to Home
      </Button>
    </div>
  );
}

export default NotFound;
