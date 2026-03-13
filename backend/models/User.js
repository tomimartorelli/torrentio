import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  website: {
    type: String,
    trim: true,
    default: ''
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'super-admin', 'admin-dev', 'admin-game'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: false },
    marketingEmails: { type: Boolean, default: false },
    theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'light' },
    language: { type: String, enum: ['es', 'en', 'fr'], default: 'es' },
    privacy: { type: String, enum: ['public', 'friends', 'private'], default: 'public' }
  },
  securitySettings: {
    twoFactorAuth: { type: Boolean, default: false },
    loginAlerts: { type: Boolean, default: true },
    deviceHistory: { type: Boolean, default: true }
  },
  activityLog: [{
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    details: { type: Object, default: {} },
    ip: { type: String, default: 'Unknown' }
  }]
});

const User = mongoose.model('User', UserSchema);
export default User;
