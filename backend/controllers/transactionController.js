import Transaction from "../models/TransactionModel.js";
import User from "../models/UserSchema.js";
import moment from "moment";

// Add a new transaction
export const addTransactionController = async (req, res) => {
  try {
    const { title, amount, description, date, category, userId, transactionType } = req.body;

    if (!title || !amount || !description || !date || !category || !transactionType) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let newTransaction = await Transaction.create({
      title,
      amount,
      category,
      description,
      date,
      user: userId,
      transactionType,
    });

    user.transactions.push(newTransaction);
    await user.save();

    return res.status(201).json({ success: true, message: "Transaction Added Successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error adding transaction", error: err.message });
  }
};

// Get all transactions for a user with filters
export const getAllTransactionController = async (req, res) => {
  try {
    const { userId, type, frequency, startDate, endDate } = req.body;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const query = { user: userId };

    if (type !== "all") {
      query.transactionType = type;
    }

    if (frequency !== "custom") {
      query.date = { $gt: moment().subtract(Number(frequency), "days").toDate() };
    } else if (startDate && endDate) {
      query.date = { $gte: moment(startDate).toDate(), $lte: moment(endDate).toDate() };
    }

    const transactions = await Transaction.find(query);

    return res.status(200).json({ success: true, transactions });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error fetching transactions", error: err.message });
  }
};

// ✅ Get a single transaction by ID
export const getSingleTransactionController = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching transaction", error: error.message });
  }
};

// ✅ Delete multiple transactions by IDs
export const deleteMultipleTransactionsController = async (req, res) => {
  try {
    const { transactionIds, userId } = req.body;

    if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid transaction IDs" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const result = await Transaction.deleteMany({ _id: { $in: transactionIds } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "No transactions found to delete" });
    }

    user.transactions = user.transactions.filter(transaction => !transactionIds.includes(transaction._id.toString()));
    await user.save();

    res.status(200).json({ success: true, message: "Transactions deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting transactions", error: error.message });
  }
};

// Delete a single transaction
export const deleteTransactionController = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const userId = req.body.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const transactionElement = await Transaction.findByIdAndDelete(transactionId);
    if (!transactionElement) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    user.transactions = user.transactions.filter(transaction => transaction._id.toString() !== transactionId);
    await user.save();

    return res.status(200).json({ success: true, message: "Transaction successfully deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error deleting transaction", error: err.message });
  }
};

// Update a transaction
export const updateTransactionController = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const updateFields = req.body;

    const transaction = await Transaction.findByIdAndUpdate(transactionId, updateFields, { new: true });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    return res.status(200).json({ success: true, message: "Transaction Updated Successfully", transaction });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error updating transaction", error: err.message });
  }
};
