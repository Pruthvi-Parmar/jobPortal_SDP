import jwt from "jsonwebtoken";

export const googleAuthCallback = async (req, res) => {
  try {
    const user = req.user;

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Authentication failed" });
  }
};

export const getCurrentUser = (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
};
