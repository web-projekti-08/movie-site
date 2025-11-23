
import {
  getAll,
  addOne,
  authenticateUser,
  saveRefreshToken,
  getUserByRefreshToken,
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



export async function addUser(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = await addOne(username, password);
    res.status(201).json({ message: "User created successfully", username: user.username });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Username already exists" });
    }

    next(err);
  }
}


export async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and Password are required" });
    }

    const user = await authenticateUser(username, password);

    if (!user) {
      return res.status(401).json({ error: "invalid username or password" });
    }


    const accessToken = generateAccessToken(user.username);
    const refreshToken = generateRefreshToken(user.username);

    await saveRefreshToken(user.username, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    res.json({
      message: "Login successful",
      username: user.username,
      accessToken
    });
  } catch (err) {
    next(err);
  }
}


export async function refreshAccessToken(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return res.status(403).json({ error: "Invalid or expired refresh token" });
    }

    const user = await getUserByRefreshToken(refreshToken);

    if (!user) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(user.username);

    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}


export async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const user = await getUserByRefreshToken(refreshToken);

      if (user) {
        await clearRefreshToken(user.username);
      }
    }

    res.clearCookie("refreshToken");

    res.json({ message: "Logout successful" });
  } catch (err) {
    next(err);
  }
}


export async function deleteAccount(req, res, next) {
  try {
    const username = req.user.username;

    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const user = await getUserByRefreshToken(refreshToken);
      if (user) {
        await clearRefreshToken(user.username);
      }
    }

    await deleteUser(username);

    res.clearCookie("refreshToken");

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    next(err);
  }
}

