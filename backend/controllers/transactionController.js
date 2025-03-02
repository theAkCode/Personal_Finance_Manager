import Transaction from "../models/TransactionModel.js";
import User from "../models/UserSchema.js";
import moment from "moment";

// Controller to add a transaction
export const addTransactionController = async (req, res) => {
  try {
    const { title, amount, description, date, category, userId, transactionType } = req.body;

    if (!title || !amount || !description || !date || !category || !transactionType) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
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

    return res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      transaction: newTransaction,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Controller to get all transactions for a user
export const getAllTransactionController = async (req, res) => {
  try {
    const { userId, type, frequency, startDate, endDate } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const query = { user: userId };

    if (type !== 'all') {
      query.transactionType = type;
    }

    if (frequency !== 'custom') {
      query.date = { $gt: moment().subtract(Number(frequency), "days").toDate() };
    } else if (startDate && endDate) {
      query.date = { $gte: moment(startDate).toDate(), $lte: moment(endDate).toDate() };
    }

    const transactions = await Transaction.find(query);

    return res.status(200).json({
      success: true,
      transactions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Controller to get a single transaction by ID
export const getSingleTransactionController = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      transaction,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Controller to delete a single transaction
export const deleteTransactionController = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    user.transactions = user.transactions.filter(
      (transactionId) => transactionId.toString() !== id
    );
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Transaction successfully deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Controller to delete multiple transactions
export const deleteMultipleTransactionsController = async (req, res) => {
  try {
    const { transactionIds, userId } = req.body;

    if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide an array of transaction IDs",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const result = await Transaction.deleteMany({ _id: { $in: transactionIds } });

    user.transactions = user.transactions.filter(
      (transactionId) => !transactionIds.includes(transactionId.toString())
    );
    await user.save();

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} transactions deleted successfully`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Controller to update a transaction
export const updateTransactionController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, description, date, category, transactionType } = req.body;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    if (title) transaction.title = title;
    if (description) transaction.description = description;
    if (amount) transaction.amount = amount;
    if (category) transaction.category = category;
    if (transactionType) transaction.transactionType = transactionType;
    if (date) transaction.date = date;

    await transaction.save();

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
