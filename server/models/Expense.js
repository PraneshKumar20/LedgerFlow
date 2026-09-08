const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: null
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      default: 'expense'
    },
    isRecurring: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Expense", expenseSchema);
