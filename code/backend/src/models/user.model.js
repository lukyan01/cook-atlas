const { getPool } = require("../config/db.config");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const crypto = require("crypto");

class UserModel {
  // Check if password meets strength requirements
  isPasswordStrong(password) {
    // At least 8 characters, contains numbers and letters
    return (
      password.length >= 8 &&
      password.length <= 100 &&
      /[A-Za-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  }

  // Register a new user
  async registerUser({ username, email, password, role = "registered" }) {
    // Check if email already exists
    const emailCheck = await getPool().query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (emailCheck.rows.length > 0) {
      throw new Error("Email already in use");
    }

    // Check if username already exists
    const usernameCheck = await getPool().query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (usernameCheck.rows.length > 0) {
      throw new Error("Username already in use");
    }

    // Validate password strength
    if (!this.isPasswordStrong(password)) {
      throw new Error(
        "Password must be at least 8 characters and contain both letters and numbers"
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user
    const result = await getPool().query(
      "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING user_id, username, email, role",
      [username, email, hashedPassword, role]
    );

    return result.rows[0];
  }

  // Login a user
  async loginUser({ email, password }) {
    // Get user with password field for comparison
    const result = await getPool().query(
      "SELECT user_id, username, email, role, password_hash FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error("Invalid credentials");
    }

    const user = result.rows[0];

    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(
      String(password),
      String(user.password_hash)
    );

    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    // Remove the password from the user object before returning
    delete user.password;
    return user;
  }

  // Get user profile
  async getUserById(id) {
    const result = await getPool().query(
      "SELECT user_id, username, email, role FROM users WHERE user_id = $1",
      [id]
    );
    return result.rows[0];
  }

  // Update user profile
  async updateUser(id, { username, email }) {
    const result = await getPool().query(
      "UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email) WHERE user_id = $3 RETURNING user_id, username, email, role",
      [username, email, id]
    );
    return result.rows[0];
  }

  // get all users

  async getAllUsers() {
    try {
      const pool = getPool();
      const result = await pool.query(
        "SELECT user_id AS id, username, email, role FROM users"
      );
      return result.rows;
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      throw error;
    }
  }

  // Delete a user by id
  async deleteUser(id) {
    try {
      const pool = getPool();
      const result = await pool.query("DELETE FROM users WHERE user_id = $1", [
        id,
      ]);
      return result;
    } catch (error) {
      console.error("Error in deleteUser:", error);
      throw error;
    }
  }
  // Generate password reset token
  async generatePasswordResetToken(email) {
    // Check if user exists
    const userResult = await getPool().query(
      "SELECT user_id FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return null; // User not found
    }

    // Generate random token
    const token = crypto.randomBytes(32).toString("hex");

    // Set expiration time (+1 hour)
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    // Store token in database
    await getPool().query(
      "UPDATE users SET pw_reset_token = $1, pw_token_expiry = $2 WHERE email = $3",
      [token, expiryDate, email]
    );

    return token;
  }

  // Reset password with user provided token
  async resetPasswordWithToken(token, newPassword) {
    // Find user with this token
    const result = await getPool().query(
      "SELECT user_id, pw_token_expiry FROM users WHERE pw_reset_token = $1",
      [token]
    );

    if (result.rows.length === 0) {
      return { success: false, message: "Invalid or expired token" };
    }

    const user = result.rows[0];

    // Check if token has expired
    if (new Date() > new Date(user.pw_token_expiry)) {
      return { success: false, message: "Token has expired" };
    }

    // Validate password strength
    if (!this.isPasswordStrong(newPassword)) {
      return {
        success: false,
        message:
          "Password must be at least 8 characters and contain both letters and numbers",
      };
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user's password and clear reset token
    await getPool().query(
      "UPDATE users SET password_hash = $1, pw_reset_token = NULL, pw_token_expiry = NULL WHERE user_id = $2",
      [hashedPassword, user.user_id]
    );

    return { success: true, message: "Password updated successfully" };
  }
}

module.exports = new UserModel();
