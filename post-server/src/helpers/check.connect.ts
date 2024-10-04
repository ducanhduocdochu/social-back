'use strict';

import mongoose from 'mongoose';
import os from 'os';
import process from 'process';

const _SECONDS = 5000;

// Hàm đếm số kết nối
export const countConnect = (): void => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections: ${numConnection}`);
};

// Hàm kiểm tra quá tải kết nối
export const checkOverload = (): void => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    console.log(`Active connections: ${numConnection}`);
    console.log(`Memory usage: ${(memoryUsage / 1024 / 1024).toFixed(2)} MB`);

    const maxConnections = numCores * 5;
    if (numConnection > maxConnections) {
      console.log('Connection overload detected');
    }
  }, _SECONDS); // Kiểm tra mỗi 5 giây
};
