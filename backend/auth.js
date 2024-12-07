const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const axios = require('axios');

const usersFilePath = path.join(__dirname, './database/user.json');

const getUsers = () => {
  if (!fs.existsSync(usersFilePath)) {
    return [];
  }
  const usersData = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(usersData);
};

const saveUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
};

const JWT_SECRET = 'your_jwt_secret';

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const users = getUsers();
  const user = users.find(u => u.username === username || u.phone === username || u.email === username);

  if (!user) return res.status(401).json({ message: 'Sai Tài Khoản Hoặc Mật Khẩu' });

  if (user.status === 0) {
    return res.status(403).json({ message: 'Tài khoản đã bị khóa' });
  }

  if (password === user.password) {
    const token = jwt.sign({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      phone: user.phone,
      email: user.email,
      dob: user.dob
    }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({
      id: user.id,
      token,
      username: user.username,
      name: user.name,
      role: user.role,
      phone: user.phone,
      email: user.email,
      dob: user.dob
    });
  } else {
    return res.status(401).json({ message: 'Sai Tài Khoản Hoặc Mật Khẩu' });
  }
});

router.post('/register', (req, res) => {
  const { username, password, phone, email, name, birthDate } = req.body;

  const users = getUsers();
  const userExists = users.find(u => u.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'Tài khoản đã tồn tại' });
  }

  const newUser = {
    id: users.length + 1,
    username,
    name,
    password,
    role: 'user',
    phone,
    email,
    dob: birthDate,
    status: 1
  };

  users.push(newUser);
  saveUsers(users);
  return res.status(201).json({ message: 'Đăng ký thành công', user: newUser });
});

router.get('/users', (req, res) => {
  const users = getUsers();
  res.json(users);
});
router.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'ID người dùng không hợp lệ' });
  }
  const { username, name, email, phone, dob, password } = req.body;

  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'Người dùng không tồn tại' });
  }

  console.log('Updating user:', users[userIndex]);
  console.log('New data:', { username, name, email, phone, dob, password });

  users[userIndex] = {
    ...users[userIndex],
    username,
    name,
    email,
    phone,
    dob,
    password: password || users[userIndex].password,
  };

  saveUsers(users);

  console.log('Updated user:', users[userIndex]);
  return res.json({ message: 'Thông tin người dùng đã được cập nhật', user: users[userIndex] });
});


router.put('/users/:id/status', (req, res) => {
  const userId = parseInt(req.params.id);
  const { status } = req.body;

  let users = getUsers();
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex !== -1) {
    users[userIndex].status = status;
    saveUsers(users);
    return res.json({ message: 'Cập nhật trạng thái thành công', user: users[userIndex] });
  } else {
    return res.status(404).json({ message: 'Không tìm thấy người dùng' });
  }
});

router.post('/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  const users = getUsers();
  const user = users.find(u => u.email == email);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản với email này' });
  }
  user.password = newPassword;
  saveUsers(users);

  return res.json({ success: true, message: 'Mật khẩu đã được thay đổi thành công' });
});

router.post('/registeradmin', (req, res) => {
  const { username, password, phone, email, name, birthDate } = req.body;

  const users = getUsers();
  const userExists = users.find(u => u.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'Tài khoản đã tồn tại' });
  }

  const newUser = {
    id: users.length + 1,
    username,
    name,
    password,
    role: 'admin',
    phone,
    email,
    dob: birthDate,
    status: 1
  };

  users.push(newUser);
  saveUsers(users);
  return res.status(201).json({ message: 'Đăng ký thành công', user: newUser });
});
router.get('/check-email', (req, res) => {
  const { email } = req.query;
  const users = getUsers();

  const userExists = users.some(user => user.email === email);

  if (userExists) {
    res.json({ exists: true });
  } else {
    res.json({ exists: false });
  }
});


module.exports = router;
