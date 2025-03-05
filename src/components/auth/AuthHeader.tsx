
import React from 'react';
import { Link } from 'react-router-dom';

const AuthHeader = () => {
  return (
    <Link to="/" className="flex items-center gap-2 mb-8">
      <span className="text-xl font-bold">Grip</span>
    </Link>
  );
};

export default AuthHeader;
