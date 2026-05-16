require(`dotenv`).config();
const express = require(`express`);
const app = express();
const PORT = process.env.PORT || 8000;

const connectDB = require(`./config/db`);
const routes = require(`./routes/auth.routes`);

app.use(express.json());

connectDB();

app.use(`/api/auth`,routes);
app.get(`/`,(req,res)=>{
    res.json({message:"API is running"})
})



app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`)
})