import React from 'react';
import { Link } from 'react-router-dom';

export const DefaultLayout = ({ children }) => (
  <div className="layout-default">
    <ul className="nav">
      <li><Link to="/">Dashboard</Link></li>
    </ul>
    { children }
  </div>
);
