const UserModel = require('../models/user.model');
const Mailgun = require("mailgun.js");

class UserController {
    // Register a new user
    async register(req, res) {
        try {
            const {username, email, password, role} = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({message: 'Username, email, and password are required'});
            }

            const user = await UserModel.registerUser({username, email, password, role});
            res.status(201).json(user);
        } catch (err) {
            console.error('Registration error:', err);

            // Handle specific errors with appropriate status codes
            if (err.message.includes('already in use')) {
                return res.status(400).json({message: err.message});
            }

            if (err.message.includes('Password must be')) {
                return res.status(400).json({message: err.message});
            }

            res.status(500).json({message: 'Registration failed', error: err.message});
        }
    }

    // Login a user
    async login(req, res) {
        try {
            const {email, password} = req.body;

            if (!email || !password) {
                return res.status(400).json({message: 'Email and password are required'});
            }

            const user = await UserModel.loginUser({email, password});
            res.json(user);
        } catch (err) {
            console.error('Login error:', err);

            // Handle invalid credentials with 401
            if (err.message === 'Invalid credentials') {
                return res.status(401).json({message: 'Invalid credentials'});
            }

            res.status(500).json({message: 'Login failed', error: err.message});
        }
    }

    // Get user profile
    async getUserProfile(req, res) {
        try {
            const {id} = req.params;
            const user = await UserModel.getUserById(id);

            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }

            res.json(user);
        } catch (err) {
            console.error('Get user profile error:', err);
            res.status(500).json({message: 'Failed to fetch user profile', error: err.message});
        }
    }

    // Update user profile
    async updateUserProfile(req, res) {
        try {
            const {id} = req.params;
            const {username, email} = req.body;

            const user = await UserModel.updateUser(id, {username, email});

            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }

            res.json(user);
        } catch (err) {
            console.error('Update user error:', err);
            res.status(500).json({message: 'Failed to update user profile', error: err.message});
        }
    }

    // Request password reset and send email with reset link
    async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }

            // Generate a password reset token and expiration
            const resetToken = await UserModel.generatePasswordResetToken(email);

            if (!resetToken) {
                return res.status(404).json({ message: 'User with this email does not exist' });
            }

            // Create the reset link using environment variables
            const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

            // Configure Mailgun
            // Initialize Mailgun client

            const mailgun = new Mailgun(FormData);
            const mg = mailgun.client({
                username: 'api',
                key: process.env.MAILGUN_API_KEY || '',
            });

            // Prepare email data
            const emailData = {
                from: `CookAtlas <noreply@${process.env.MAILGUN_DOMAIN}>`,
                to: [email],
                subject: 'CookAtlas - Password Reset Request',
                html: `
                    <h2>Reset Your Password</h2>
                    <p>You requested a password reset for your Recipe App account.</p>
                    <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
                    <p><a href="${resetLink}">Reset Your Password</a></p>
                    <p>If you didn't request this, please ignore this email.</p>
                `
            };

            // Send email using the newer API
            await mg.messages.create(process.env.MAILGUN_DOMAIN, emailData);

            // In production, don't return the reset link
            const response = { message: 'Password reset link has been sent to your email' };

            // Only include reset link in development for testing
            if (process.env.NODE_ENV === 'development') {
                response.resetLink = resetLink;
            }

            res.status(200).json(response);
        } catch (err) {
            console.error('Password reset error:', err);
            res.status(500).json({ message: 'Failed to process password reset request', error: err.message });
        }
    }

    // Reset password with token
    async resetPasswordWithToken(req, res) {
        try {
            const { token, newPassword } = req.body;

            if (!token || !newPassword) {
                return res.status(400).json({ message: 'Token and new password are required' });
            }

            // Validate token and update password
            const result = await UserModel.resetPasswordWithToken(token, newPassword);

            if (!result.success) {
                return res.status(400).json({ message: result.message });
            }

            res.status(200).json({ message: 'Password has been reset successfully' });

        } catch (err) {
            console.error('Password reset with token error:', err);
            res.status(500).json({ message: 'Failed to reset password', error: err.message });
        }
    }

    async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      return res.status(200).json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Delete a user by id
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await UserModel.deleteUser(id);
      return res.status(200).json({ message: "User deleted", result });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new UserController();
