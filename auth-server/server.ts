import app from "./src/app"; // Import module theo cú pháp ES6
import constant from './src/configs/constant'; // Import phần config

const PORT: string | undefined = constant.app.port; // Định kiểu cho PORT là number

const server = app.listen(PORT, () => {
  console.log(`Auth server start with ${PORT}`);
});

// Xử lý sự kiện SIGINT (khi dừng server)
process.on("SIGINT", () => {
  server.close(() => {
    console.log(`Exit Server Express`);
  });
});