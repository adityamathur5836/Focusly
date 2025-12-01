const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');

const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (email && email !== req.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || req.user.name,
        email: email || req.user.email,
      },
      select: { id: true, name: true, email: true },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Failed to update password' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
};
