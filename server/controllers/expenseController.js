const Expense = require("../models/Expense");

//POST
const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, type, isRecurring, userId } = req.body;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const expense = await Expense.create({
      userId: userId || null,
      title,
      amount,
      category,
      date,
      type: type || 'expense',
      isRecurring: isRecurring || false
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//GET
const getExpenses = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = {};
    if (userId) {
      filter.userId = userId;
    }
    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//GET - by ID
const getExpenseById = async(req,res) => {
  try{
    const expense = await Expense.findById(req.params.id);
  if(!expense){
    return res.status(404).json({message: "Expense not found"});
  }
  res.status(200).json(expense);
  } catch(error){
    res.status(500).json({message: "Invalid Expense ID"}, error.message);
  }
}

//PUT - by ID
const updateExpense = async(req,res) => {
  try{
    const {title, amount, category, date, type, isRecurring} = req.body;

    const expense = await Expense.findById(req.params.id);
    if(!expense){
      return res.status(404).json({message: "Expense not found"});
    }

    expense.title = title || expense.title;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.date = date || expense.date;
    if (type !== undefined) expense.type = type;
    if (isRecurring !== undefined) expense.isRecurring = isRecurring;

    const updatedExpense = await expense.save();
    res.status(200).json(updatedExpense);

  } catch(error){
    res.status(500).json({message: "Invalid Expense ID"});
  }
}

const deleteExpense = async(req,res) => {
  try{
    const expense = await Expense.findById(req.params.id);
    if(!expense){
      return res.status(404).json({message: "Expense not found"});
    }
    await expense.deleteOne();
    res.status(200).json({message: "Expense deleted successfully!"});
  } catch(error){
    res.status(500).json({message: "Invalid Expense ID"});
  }
}

module.exports = { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense };
