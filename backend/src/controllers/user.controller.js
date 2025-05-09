const UserModel = require("../models/user.model");

class UserController {
  // Register a new user
  async register(req, res) {
    try {
      const { username, email, password, role } = req.body;

      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ message: "Username, email, and password are required" });
      }

      const user = await UserModel.registerUser({
        username,
        email,
        password,
        role,
      });
      res.status(201).json(user);
    } catch (err) {
      console.error("Registration error:", err);

      // Handle specific errors with appropriate status codes
      if (err.message.includes("already in use")) {
        return res.status(400).json({ message: err.message });
      }

      if (err.message.includes("Password must be")) {
        return res.status(400).json({ message: err.message });
      }

      res
        .status(500)
        .json({ message: "Registration failed", error: err.message });
    }
  }

  // Login a user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const user = await UserModel.loginUser({ email, password });
      res.json(user);
    } catch (err) {
      console.error("Login error:", err);

      // Handle invalid credentials with 401
      if (err.message === "Invalid credentials") {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.status(500).json({ message: "Login failed", error: err.message });
    }
  }

  // Get user profile
  async getUserProfile(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.getUserById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (err) {
      console.error("Get user profile error:", err);
      res
        .status(500)
        .json({ message: "Failed to fetch user profile", error: err.message });
    }
  }

  // Update user profile
  async updateUserProfile(req, res) {
    try {
      const { id } = req.params;
      const { username, email } = req.body;

      const user = await UserModel.updateUser(id, { username, email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (err) {
      console.error("Update user error:", err);
      res
        .status(500)
        .json({ message: "Failed to update user profile", error: err.message });
    }
  }

  // Get all users
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
