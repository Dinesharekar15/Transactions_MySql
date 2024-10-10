require("dotenv").config();

const jwt = require("jsonwebtoken");
const zod = require("zod");
const { getDb } = require("../config/Db");

const signupBody = zod.object({
  username: zod.string(),
  firstname: zod.string(),
  lastname: zod.string(),
  password: zod.string(),
});
const signInBody = zod.object({
  username: zod.string(),
  password: zod.string(),
});


//signup
const signUpUser = async (req, res) => {
  
  const { username, firstname, lastname, password } = req.body; // Ensure 'firstname' is used consistently

  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect input",
    });
  }

  const db = getDb();
  const checkUserQuery = "SELECT * FROM users WHERE username = ?";

  try {
    // Check if the username already exists
    const [result] = await db.query(checkUserQuery, [username]);
    
    
    if (result.length > 0) {
      return res.status(411).json({ message: "Username already taken" });
    }

    // Continue with signup process if user does not exist
    const insertUserQuery = "INSERT INTO users (username, firstname, lastname, password) VALUES (?, ?, ?, ?)";
    const values = [username, firstname, lastname, password];
    const [userResult] = await db.query(insertUserQuery, values);

    const userId = userResult.insertId; // Get the auto-incremented ID for the newly created user

    // Now create the associated account
    const accountName = username; // Assuming account name is the same as the username
    const initialBalance = 1 + Math.random() * 10000; // Random initial balance

    const insertAccountQuery = "INSERT INTO accounts (userId, accountname, balance) VALUES (?, ?, ?)";
    const accountValues = [userId, accountName, initialBalance];
    await db.query(insertAccountQuery, accountValues);

    // Generate JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);

    res.status(201).json({
      message: "User and account created successfully",
      userId,
      token,
    });
  } catch (err) {
    console.error("Database operation failed:", err);
    return res.status(500).json({ message: "Server error, please try again later." });
  }
};




//user signin
const signInUser = async (req, res) => {
  
  const { username, password } = req.body;

  const { success } = signInBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({ message: "Incorrect input" });
  }

  const db = getDb();
  const checkUserQuery = "SELECT * FROM users WHERE username = ?";

  try {
    const [result] = await db.query(checkUserQuery, [username]);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result[0];

    // Check if the password is correct (you might want to hash your passwords)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Sign-in successful",
      userId: user.id,
      token,
    });
  } catch (err) {
    console.error("Database operation failed:", err);
    return res.status(500).json({ message: "Server error, please try again later." });
  }
};

// user information 
const getInfo = async (req, res) => {
  try {
    // Assuming the userId is stored in req.userId after JWT verification
    const userId = req.userId;
    

    const db = getDb(); // Get the MySQL connection

    // Fetch the user from the 'users' table based on the userId
    const [userRows] = await db.query('SELECT firstname, lastname, username FROM users WHERE id = ?', [userId]);
    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userRows[0]; // Extract the first (and only) row

    // Fetch the account from the 'accounts' table based on the userId
    const [accountRows] = await db.query('SELECT balance FROM accounts WHERE userId = ?', [userId]);
    if (accountRows.length === 0) {
      return res.status(404).json({ message: "Account not found" });
    }

    const account = accountRows[0]; // Extract the first (and only) row

    // Send the user and account info back to the client
    res.json({
      name: `${user.firstname} ${user.lastname}`,
      email: user.username,
      balance: account.balance,
    });

  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// find user by search
const findUser = async (req, res) => {
  const filter = req.query.filter || "";
  

  try {
    const db = getDb();

    // Construct the query to search for users by first name or last name
    const searchQuery = `
      SELECT username, firstname, lastname, id 
      FROM users 
      WHERE firstname LIKE ? OR lastname LIKE ?`;

    // The filter needs to be surrounded by '%' for the LIKE operation
    const filterValue = `%${filter}%`;

    // Execute the query using the mysql2 package
    const [users] = await db.query(searchQuery, [filterValue, filterValue]);

    // Map over the result to return the desired response structure
    res.json({
      user: users.map((user) => ({
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        id: user.id, // Adjust the _id field to the correct column name in your MySQL table
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while searching for users",
      error,
    });
  }
};

module.exports = { signUpUser,signInUser,findUser,getInfo};
