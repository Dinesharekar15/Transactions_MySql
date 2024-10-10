
const { getDb } = require("../config/Db");


const balance = async (req, res) => {
    try {
      const userId = req.userId; // Assuming userId is extracted via JWT in auth middleware
  
      const db = getDb(); // Get MySQL connection
  
      // Fetch the account from the 'accounts' table using the userId
      const [accountRows] = await db.query('SELECT balance FROM accounts WHERE userId = ?', [userId]);
  
      // Check if account exists
      if (accountRows.length === 0) {
        return res.status(404).json({
          message: "Account not found"
        });
      }
  
      const account = accountRows[0]; // Extract the first (and only) row
  
      // Send the account balance as the response
      res.json({
        balance: account.balance
      });
  
    } catch (error) {
      console.error("Error fetching account balance:", error);
      res.status(500).json({
        message: "Server error"
      });
    }
  };
  

  const transfer = async (req, res) => {
    try {
      const { amount, to } = req.body;
      const db = getDb(); // Get MySQL connection
      const userId = req.userId; // The ID of the sender (extracted from JWT)
  
      // Validate that 'amount' is positive and a valid number
      if (amount <= 0) {
        return res.status(400).json({ message: "Transfer amount must be greater than 0" });
      }
  
      // Check if the recipient exists
      const [recipientRows] = await db.query('SELECT * FROM accounts WHERE userId = ?', [to]);
      if (recipientRows.length === 0) {
        return res.status(400).json({ message: "Invalid recipient account" });
      }
  
      // Fetch the sender's account
      const [senderRows] = await db.query('SELECT * FROM accounts WHERE userId = ?', [userId]);
      if (senderRows.length === 0) {
        return res.status(400).json({ message: "Sender account not found" });
      }
  
      const senderAccount = senderRows[0];
  
      // Check if the sender has enough balance
      if (senderAccount.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
  
      // Start MySQL transaction for transfer process
      await db.beginTransaction();
  
      try {
        // Deduct the amount from the sender's account
        await db.query('UPDATE accounts SET balance = balance - ? WHERE userId = ?', [amount, userId]);
  
        // Add the amount to the recipient's account
        await db.query('UPDATE accounts SET balance = balance + ? WHERE userId = ?', [amount, to]);
  
        // Commit the transaction after both updates
        await db.commit();
  
        // Send success response
        res.status(200).json({ message: "Transfer successful" });
      } catch (error) {
        // Rollback the transaction if any error occurs
        await db.rollback();
        console.error("Transfer failed:", error);
        return res.status(500).json({ message: "Transfer failed", error });
      }
  
    } catch (error) {
      console.error("Transfer failed:", error);
      return res.status(500).json({ message: "Transfer failed", error });
    }
  };
  
  

module.exports={balance,transfer}

