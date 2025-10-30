const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  // Due date/time for the task
  dueDate: {
    type: Date,
    default: null
  },
  // Optional reminder time (client can set to X minutes before due)
  reminderAt: {
    type: Date,
    default: null
  },
  // Tags / categories
  tags: {
    type: [String],
    default: []
  },
  // Category: Work, Personal, Shopping, Health, etc.
  category: {
    type: String,
    enum: ['Work', 'Personal', 'Shopping', 'Health', 'Study', 'Other'],
    default: 'Personal'
  },
  // Priority: low, medium, high
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  // Attachments: store filenames or URLs
  attachments: {
    type: [String],
    default: []
  },
  // Recurring rule (simple): { interval: 'daily'|'weekly'|'monthly', count: Number }
  recurring: {
    type: {
      interval: { type: String, enum: ['none', 'daily', 'weekly', 'monthly'], default: 'none' },
      every: { type: Number, default: 1 }
    },
    default: { interval: 'none', every: 1 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Task', taskSchema);
