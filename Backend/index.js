// server.js
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import passport from "passport";
import session from "express-session";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import dotenv from "dotenv";
import cors from "cors";
import crypto from "crypto";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware ---------------------------------------------------------------------
// Allow both production and development origins

const allowedOrigins = ['https://myportfolify-bzq9.vercel.app'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // If using cookies or HTTP authentication
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // true in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  },
}));
app.use(passport.initialize());
app.use(passport.session());

const isAdmin = (req, res, next) => {
  const adminEmails = process.env.ADMIN_EMAILS.split(",");
  if (req.isAuthenticated() && adminEmails.includes(req.user.email)) {
    return next();
  }
  res.status(403).send("Access denied. Admins only.");
};

// Mongoose Setup -----------------------------------------------------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo connection error:", err));

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetToken: String,
  resetTokenExpiry: Date,
   lastLogin: Date,
  loginCount: { type: Number, default: 0 }
});

const User = mongoose.model("User", userSchema);

// Updated Project Schema with new fields
const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  projects: [{
    title: String,
    description: String,
    techStack: [String],
    images: [String],
    liveUrl: String,
    githubUrl: String,
    category: String,
    featured: Boolean,
    createdAt: { type: Date, default: Date.now }
  }],
  profile: {
    name: String,
    passionateText: String,
    bio: String,
    avatar: String,
    socialLinks: {
      github: String,
      linkedin: String,
      twitter: String,
      personalWebsite: String
    },
    skills: [{
      techName: String,
      skillsUsed: [String]
    }],
    education: [{
      collegeName: String,
      branch: String,
      course: String,
      yearOfPassout: Number
    }],
    workExperience: [{
      companyName: String,
      position: String,
      duration: String,
      description: String,
      currentlyWorking: Boolean
    }]
  },
  template: { type: String, default: 'default' }
});

const Project = mongoose.model('Project', projectSchema);

// Passport Config (unchanged) ----------------------------------------------------
passport.use(new LocalStrategy({ usernameField: "username" }, async (username, password, done) => {
  try {
    const user = await User.findOne({ email: username });
    if (!user) return done(null, false, { message: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? done(null, user) : done(null, false, { message: "Invalid credentials" });
  } catch (err) {
    return done(err);
  }
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://myportfolify.onrender.com/auth/google/callback",
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.email });
    if (!user) {
      user = await User.create({ email: profile.email, password: "google", isVerified: true });
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Email Transport (unchanged) ----------------------------------------------------
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
app.get('/', (req, res) => {
  res.send('Server Working!');
});
// Routes -------------------------------------------------------------------------

// Authentication Routes (unchanged) ----------------------------------------------
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: username });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      email: username,
      password: hashedPassword,
      verificationToken,
    });

const verifyLink = `https://myportfolify.onrender.com/verify-email/${verificationToken}`;
await transporter.sendMail({
  from: '"MyPortfolify" <myportfolify@gmail.com>', // Use your domain email
  to: username,
  subject: "Complete Your MyPortfolify Registration",
  text: `Hi ${username.split('@')[0]}!\n\nWelcome to MyPortfolify! To get started, please verify your email address by clicking the link below:\n\n${verifyLink}\n\nThis link will expire in 24 hours. If you didn't request this, please ignore this email.\n\nThanks,\nThe MyPortfolify Team`,
  html: `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="color: #2c3e50; font-size: 24px; margin: 0;">MyPortfolify</h1>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
          <h2 style="color: #2c3e50; font-size: 20px; margin-top: 0;">Welcome to MyPortfolify!</h2>
          <p style="line-height: 1.6;">Hi ${username.split('@')[0]},</p>
          <p style="line-height: 1.6;">Thank you for creating an account. Please verify your email address to complete your registration and start building your portfolio.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyLink}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 16px;">Verify Email Address</a>
          </div>
          
          <p style="line-height: 1.6; font-size: 14px; color: #666;">This verification link will expire in 24 hours. If you didn't create a MyPortfolify account, you can safely ignore this email.</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #777;">
          <p>© ${new Date().getFullYear()} MyPortfolify. All rights reserved.</p>
          <p style="margin-bottom: 0;">If you're having trouble with the button above, copy and paste this URL into your browser:</p>
          <p style="word-break: break-all;">${verifyLink}</p>
        </div>
      </div>
    </div>
  `,
});

    res.status(200).json({ message: "Registered, verify email sent", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/verify-email/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOneAndUpdate(
      { verificationToken: token },
      { isVerified: true, verificationToken: null },
      { new: true }
    );
    if (!user) return res.status(400).send("Invalid or expired token");
    res.redirect("https://myportfolify.vercel.app/login?verified=true");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });
    if (!user.isVerified) return res.status(403).json({ message: "Please verify your email first" });

    // Add the explicit session saving here:
    req.login(user, (err) => {
      if (err) return next(err);
      // Track login
      User.findByIdAndUpdate(user._id, { 
        $set: { lastLogin: new Date() },
        $inc: { loginCount: 1 }
      }).exec();
      
      // Explicitly save the session before sending response
      req.session.save(() => {
        res.status(200).json({ message: "Logged in", user });
      });
    });
  })(req, res, next);
});

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://myportfolify.vercel.app/login",
  }),
  (req, res) => {
    // Explicitly save session before redirect
    req.session.save(() => {
      res.redirect("https://myportfolify.vercel.app/");
    });
  }
);
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = Date.now() + 3600000;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    const resetLink = `https://myportfolify.vercel.app/reset-password/${token}`;
await transporter.sendMail({
  from: '"MyPortfolify Security" <security@myportfolify.com>', // Professional sender
  to: email,
  subject: "Password Reset Request for Your MyPortfolify Account",
  text: `Hi there,\n\nWe received a request to reset your MyPortfolify password. Click the link below to proceed:\n\n${resetLink}\n\nThis link expires in 1 hour for security reasons.\n\nIf you didn't request this, please ignore this email or contact support.\n\n- The MyPortfolify Team`,
  html: `
    <div style="font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2c3e50; margin: 0; font-size: 22px;">MyPortfolify</h1>
          <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Portfolio Management</p>
        </div>

        <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <h2 style="color: #1e293b; font-size: 18px; margin-top: 0;">Password Reset Request</h2>
          <p style="line-height: 1.6;">We received a request to reset the password for your account.</p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetLink}" 
               style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; 
                      text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 15px;
                      transition: background-color 0.3s ease;"
               onMouseOver="this.style.backgroundColor='#4f46e5'" 
               onMouseOut="this.style.backgroundColor='#6366f1'">
              Reset Password
            </a>
          </div>

          <p style="font-size: 14px; color: #64748b; line-height: 1.5;">
            <strong>Important:</strong> This link will expire in 1 hour for security reasons. 
            If you didn't request a password reset, please secure your account by 
            <a href="mailto:support@myportfolify.com" style="color: #6366f1;">contacting support</a>.
          </p>
        </div>

        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #94a3b8;">
          <p>© ${new Date().getFullYear()} MyPortfolify. All rights reserved.</p>
          <p style="margin: 5px 0;">For your security, do not share this email with anyone.</p>
          <p>If the button doesn't work, copy this URL to your browser:<br>
            <span style="word-break: break-all; color: #475569;">${resetLink}</span>
          </p>
        </div>
      </div>
    </div>
  `
});

    res.status(200).json({ message: "Reset link sent" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password" });
  }
});

app.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: "Logout error" });
    res.status(200).json({ message: "Logged out" });
  });
});

app.get("/check-auth", (req, res) => {
  console.log('Session ID:', req.sessionID);
  console.log('Authenticated:', req.isAuthenticated());
  console.log('User:', req.user);
  console.log('Cookies:', req.headers.cookie);
  
  if (req.isAuthenticated()) {
    res.status(200).json({
      authenticated: true,
      user: {
        _id: req.user._id,
        email: req.user.email,
        isVerified: req.user.isVerified,
      },
    });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// Profile Routes -----------------------------------------------------------------
app.get('/api/profiles/check-username', async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const profile = await Project.findOne({ username });
    res.json({ exists: !!profile });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create or get user profile
app.post('/api/profiles', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const { username } = req.body;
    
    // Check if username is available
    const existingProfile = await Project.findOne({ username });
    if (existingProfile) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Create new profile with all fields
    const newProfile = await Project.create({
      userId: req.user._id,
      username,
      projects: [],
      profile: {
        name: req.user.email.split('@')[0],
        passionateText: '',
        bio: '',
        avatar: '',
        socialLinks: {
          github: '',
          linkedin: '',
          twitter: '',
          personalWebsite: ''
        },
        skills: [],
        education: [],
        workExperience: []
      }
    });

    res.status(201).json(newProfile);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get current user's profile
app.get('/api/profiles/me', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ 
      message: "Not authenticated",
      authenticated: false 
    });
  }

  try {
    const profile = await Project.findOne({ userId: req.user._id });
    
    if (!profile) {
      return res.status(404).json({ 
        message: "Profile not found",
        profileExists: false 
      });
    }
    
    res.json({
      ...profile.toObject(),
      authenticated: true,
      profileExists: true
    });
    
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ 
      message: "Server error",
      error: err.message 
    });
  }
});

// Update profile information
app.put('/api/profiles/me/profile', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const { profile } = req.body;
    
    const updatedProfile = await Project.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { profile } },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(updatedProfile);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update template preference
app.put('/api/profiles/me/template', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const validTemplates = ['default', 'minimal', 'professional'];
    const { template } = req.body;

    if (template && !validTemplates.includes(template)) {
      return res.status(400).json({ message: "Invalid template" });
    }

    const updatedProfile = await Project.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { template } },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(updatedProfile);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Public profile route
app.get('/api/profiles/:username', async (req, res) => {
  try {
    const profile = await Project.findOne({ username: req.params.username });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Project CRUD Routes (unchanged) ------------------------------------------------
app.post('/api/profiles/me/projects', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const profile = await Project.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.projects.push(req.body);
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put('/api/profiles/me/projects/:projectId', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const profile = await Project.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const projectIndex = profile.projects.findIndex(
      p => p._id.toString() === req.params.projectId
    );

    if (projectIndex === -1) {
      return res.status(404).json({ message: "Project not found" });
    }

    profile.projects[projectIndex] = {
      ...profile.projects[projectIndex].toObject(),
      ...req.body
    };

    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.delete('/api/profiles/me/projects/:projectId', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const profile = await Project.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.projects = profile.projects.filter(
      p => p._id.toString() !== req.params.projectId
    );

    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin Routes (unchanged) -------------------------------------------------------
// Updated Admin Routes -------------------------------------------------------
app.get("/admin", isAdmin, async (req, res) => {
  try {
    // Get all users with their profiles
    const users = await User.find().lean();
    const profiles = await Project.find().lean();
    
    // Get statistics
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const usersWithProfiles = await Project.countDocuments();
    const totalProjects = await Project.aggregate([
      { $unwind: "$projects" },
      { $count: "total" }
    ]);
    
    // Combine user data with their profiles
    const userData = users.map(user => {
      const userProfile = profiles.find(p => p.userId && p.userId.toString() === user._id.toString());
      return {
        ...user,
        hasProfile: !!userProfile,
        username: userProfile?.username || 'N/A',
        projectCount: userProfile?.projects?.length || 0
      };
    });

    res.json({
      users: userData,
      stats: {
        totalUsers,
        verifiedUsers,
        usersWithProfiles: usersWithProfiles || 0,
        totalProjects: totalProjects[0]?.total || 0,
        activeSessions: req.sessionStore?.length || 'N/A'
      },
      currentAdmin: {
        email: req.user.email,
        lastLogin: req.session.cookie._expires
      }
    });
  } catch (err) {
    console.error("Admin error:", err);
    res.status(500).json({ message: "Error loading admin data" });
  }
});

// Enhanced Admin User Management
app.post("/admin/users/:id", isAdmin, async (req, res) => {
  try {
    const { action, data } = req.body;
    const userId = req.params.id;

    switch (action) {
      case 'delete':
        await User.findByIdAndDelete(userId);
        await Project.deleteMany({ userId });
        break;
      
      case 'verify':
        await User.findByIdAndUpdate(userId, { 
          isVerified: true, 
          verificationToken: null 
        });
        break;
      
      case 'reset-password':
        const hashed = await bcrypt.hash(data.newPassword, 10);
        await User.findByIdAndUpdate(userId, {
          password: hashed,
          resetToken: null,
          resetTokenExpiry: null,
        });
        break;
      
      case 'update-email':
        await User.findByIdAndUpdate(userId, { email: data.newEmail });
        break;
      
      case 'toggle-admin':
        // This would require adding an isAdmin field to the User schema
        // await User.findByIdAndUpdate(userId, { isAdmin: data.isAdmin });
        // For now using the existing ADMIN_EMAILS approach
        return res.status(400).json({ message: "Admin status is managed via ADMIN_EMAILS in .env" });
      
      case 'impersonate':
        // Only allow if in development
        if (process.env.NODE_ENV === 'development') {
          const user = await User.findById(userId);
          req.login(user, (err) => {
            if (err) throw err;
            return res.json({ message: `Now impersonating ${user.email}` });
          });
        } else {
          return res.status(403).json({ message: "Impersonation only allowed in development" });
        }
        break;
      
      default:
        return res.status(400).json({ message: "Invalid action" });
    }

    res.json({ message: `Action ${action} completed successfully` });
  } catch (err) {
    console.error("Admin user action error:", err);
    res.status(500).json({ message: "Error performing admin action" });
  }
});

// Admin Profile Management
app.get("/admin/profiles", isAdmin, async (req, res) => {
  try {
    const { search, sort = 'createdAt', order = 'desc' } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { 'profile.name': { $regex: search, $options: 'i' } },
        { 'profile.socialLinks.github': { $regex: search, $options: 'i' } }
      ];
    }

    const sortOption = {};
    sortOption[sort] = order === 'desc' ? -1 : 1;

    const profiles = await Project.find(query)
      .sort(sortOption)
      .populate('userId', 'email isVerified');

    res.json(profiles);
  } catch (err) {
    console.error("Admin profiles error:", err);
    res.status(500).json({ message: "Error fetching profiles" });
  }
});

app.post("/admin/profiles/:id", isAdmin, async (req, res) => {
  try {
    const { action, data } = req.body;
    const profileId = req.params.id;

    switch (action) {
      case 'delete':
        await Project.findByIdAndDelete(profileId);
        break;
      
      case 'update':
        await Project.findByIdAndUpdate(profileId, data);
        break;
      
      case 'feature-project':
        await Project.updateOne(
          { _id: profileId, "projects._id": data.projectId },
          { $set: { "projects.$.featured": data.featured } }
        );
        break;
      
      case 'transfer-ownership':
        const newUser = await User.findById(data.newUserId);
        if (!newUser) {
          return res.status(404).json({ message: "New user not found" });
        }
        await Project.findByIdAndUpdate(profileId, { userId: data.newUserId });
        break;
      
      default:
        return res.status(400).json({ message: "Invalid action" });
    }

    res.json({ message: `Profile action ${action} completed` });
  } catch (err) {
    console.error("Admin profile action error:", err);
    res.status(500).json({ message: "Error performing profile action" });
  }
});

// Admin System Controls
app.get("/admin/system", isAdmin, async (req, res) => {
  try {
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      databaseStats: await mongoose.connection.db.stats(),
      sessionCount: req.sessionStore?.length || 'N/A',
      environment: process.env.NODE_ENV,
      adminEmails: process.env.ADMIN_EMAILS.split(',')
    };

    res.json(systemInfo);
  } catch (err) {
    console.error("Admin system error:", err);
    res.status(500).json({ message: "Error fetching system info" });
  }
});

app.post("/admin/system/maintenance", isAdmin, async (req, res) => {
  try {
    const { mode, message } = req.body;
    // In a real app, you would set this in a way that all routes can check it
    // For example using a global variable or database flag
    if (mode === 'enable') {
      // Set maintenance mode
      res.json({ message: `Maintenance mode enabled: ${message}` });
    } else {
      // Disable maintenance mode
      res.json({ message: "Maintenance mode disabled" });
    }
  } catch (err) {
    console.error("Admin maintenance error:", err);
    res.status(500).json({ message: "Error toggling maintenance mode" });
  }
});
// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});