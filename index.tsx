import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 取得根元素
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("找不到根元素 (root element) 以進行掛載");
}

// 建立 React Root 並渲染應用程式
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);