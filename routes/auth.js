import express from "express";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";

const router = express.Router();
dotenv.config();

// Add session middleware before passport middleware
router.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      ttl: 60 * 60,
    }),
  })
);
// Initialize Passport.js and add session middleware
router.use(passport.initialize());
router.use(passport.session());

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, isCreator } = req.body;
    // console.log(req.body)

    // Check if a user with the same username or email already exists
    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });
    if (existingUsername) {
      return res.status(400).json({
        message: "Username already taken",
      });
    } else if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    } else if (existingEmail && existingUsername) {
      return res.status(400).json({
        message: "User with the same username and email already exists",
      });
    } else {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create and save the new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        isCreator,
      });

      const user = await newUser.save();
      res.status(200).json(user);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Configure Passport to use local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "Invalid email" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return done(null, false, { message: "Invalid password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize and deserialize user for login sessions
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: true }, (err, user, info) => {
    if (err) {
      // Handle any error that occurred during authentication
      return res.status(500).json({
        error: "Server error. Please contact support if the error persists!",
      });
    }

    if (!user) {
      // User doesn't exist or authentication failed
      return res.status(400).json({ error: "Email not registered!" });
    }

    // Generate a JWT token with user information
    // console.log("login endpoint hit");
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        isCreator: user.isCreator,
        isS_C: user.isS_C
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, { httpOnly: true, secure: true }); // send cookie
    res.status(200).json({ token }); // send token
  })(req, res, next);
});

// Authentication middleware
function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Set the user ID in the request object for future use
    req.userId = decoded.id;
    next();
  });
}

// Logout endpoint with authentication middleware
router.post("/logout", authenticateUser, (req, res) => {
  // Destroy the user's session
  req.logout(() => {
    req.session.destroy();

    // Clear the cookie containing the JWT token
    res.clearCookie("token");

    res.status(200).json({ message: "Logged out successfully" });
  });
});

export default router;
