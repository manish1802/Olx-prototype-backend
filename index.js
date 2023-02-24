import express   from 'express';
import authrouter from "./routes/auth.js";
import notesrouter from './routes/notes.js';
 import cors  from "cors";
 import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path'

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "password",
//   database: "note",
// });
// export default db;
// app.get("/",(req,res)=>{
//     res.json("hello manish")
// })
const app = express()
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      
      cb(null, Date.now()+ path.extname(file.originalname))
    }
  })
  
const upload = multer({ storage: storage })
app.post('/api/uploads', upload.single('file'), function (req, res,) {
     const file = req.file
     res.status(200).json(file.filename)
  })





app.use("/api/auth" ,authrouter)
app.use("/api/notes",notesrouter)

app.use(express.json())
app.listen(5000,() =>{
    console.log("Connected to Backend!")})
