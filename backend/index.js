const express = require("express");
const {connectDb} = require('./config/Db');
const userRoutes=require('./Routes/userRoutes');
const accountRouter=require('./Routes/AccountRoutes')
const cors=require("cors")


const app=express();
connectDb();
app.use(
  cors()
);

app.use(express.json()); 
// 
app.get('/', (req, res) => {
  res.send('Hello');
});


app.use('/api/users',userRoutes)

app.use('/api/account',accountRouter)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





