const { User } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 用户注册
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 验证必填字段
    if (!username || !password) {
      return res.status(400).json({
        message: '所有字段都是必填的',
        missingFields: [
          ...(!username ? ['username'] : []),
          ...(!password ? ['password'] : [])
        ]
      });
    }

    // 验证邮箱格式（非必填）
    if (email && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        message: '邮箱格式不正确',
        details: '请输入有效的邮箱地址，例如：user@example.com'
      });
    }

    // 检查用户名是否已存在
    const existingUser = await User.findOne({
      where: { username }
    });
    if (existingUser) {
      return res.status(400).json({
        message: '注册失败，用户名已存在'
      });
    }

    // 如果提供了非空邮箱，检查邮箱是否已存在
    if (email && email.trim()) {
      const existingEmail = await User.findOne({
        where: { email }
      });
      if (existingEmail) {
        return res.status(400).json({
          message: '注册失败，邮箱已被注册'
        });
      }
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建新用户
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'user',
      status: 'active'
    });

    // 生成 token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '注册失败，请重试' });
  }
};

// 用户登录
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 更新最后登录时间
    await user.update({ lastLogin: new Date() });

    // 生成 token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '登录失败，请重试' });
  }
};

// 获取用户信息
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'role', 'avatar', 'bio', 'lastLogin']
    });

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json(user);
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ message: '获取用户信息失败' });
  }
};

// 更新用户信息
const updateProfile = async (req, res) => {
  try {
    const { username, bio, avatar } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 如果要更新用户名，检查是否已存在
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ message: '用户名已存在' });
      }
    }

    await user.update({
      username: username || user.username,
      bio: bio || user.bio,
      avatar: avatar || user.avatar
    });

    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ message: '更新用户信息失败' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
}; 