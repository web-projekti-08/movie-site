import {
  getAll,
  addOne,
  authenticateUser,
  saveRefreshToken,
  getUserByRefreshToken,
  getUserGroups,
  clearRefreshToken,
  deleteUser
} from "../models/auth_model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../utils/jwt.js";


export async function getUsers(req, res, next) {
  try {
    const users = await getAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function getCurrentUser(req, res, next) {
  try {
    const { userId, email } = req.user;

    // Get groups
    const groups = await getUserGroups(userId);

    res.status(200).json({
      userId,
      email,
      groups // [{ group_id, group_name, role }]
    });
  } catch (err) {
    next(err);
  }
}

export async function addUser(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await addOne(email, password);

    res.status(201).json({
      message: "User created successfully",
      user: { userId: user.userId, email: user.email }
    });
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "Email already exists" });
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await authenticateUser(email, password);
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const accessToken = generateAccessToken(user.userId, user.email);
    const refreshToken = generateRefreshToken(user.userId, user.email);

    await saveRefreshToken(user.email, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: { userId: user.userId, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}

export async function refreshAccessToken(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) return res.status(403).json({ error: "Invalid or expired refresh token" });

    const user = await getUserByRefreshToken(refreshToken);
    if (!user) return res.status(403).json({ error: "Invalid refresh token" });

    const groups = await getUserGroups(user.userId);

    const accessToken = generateAccessToken(user.userId, user.email);
    res.json({
      accessToken,
      user: {
        userId: user.userId,
        email: user.email,
        groups
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const user = await getUserByRefreshToken(refreshToken);
      if (user) await clearRefreshToken(user.email);
    }
    res.clearCookie("refreshToken");
    res.json({ message: "Logout successful" });
  } catch (err) {
    next(err);
  }
}

export async function deleteAccount(req, res, next) {
  try {
    const { email, userId } = req.user;

    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await clearRefreshToken(email);
    }

    const deleted = await deleteUser(email);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    
    res.clearCookie("refreshToken");
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    next(err);
  }
}

