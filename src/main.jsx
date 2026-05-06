import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import './animations.css';
import './scroll-anim.css';
import { initScrollAnimations } from './scroll-anim.js';

createRoot(document.getElementById('root')).render(<App />);

setTimeout(initScrollAnimations, 200);
