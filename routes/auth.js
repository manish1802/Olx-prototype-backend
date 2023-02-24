import express, { Router } from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";

const authrouter = express.Router()
    
                   //    Create user     //
authrouter.post("/user", async (req, res) => {
 const q ="INSERT INTO user (`id`,`name`,`email`,`password`) VALUES (default,?,?,?) ";
 try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const [data] = await db.query(q, [req.body.name, req.body.email, hash]);
     if (data) return res.json("Singup success");
  } catch (errer) {
    if(errer) return res.json (errer)
  }
});

authrouter.get("/user/:id", async (req, res) => {
  const q = "SELECT * FROM user WHERE id = ?";
  const userId = req.params.id;
 try {
    const [data] = await db.query(q, [userId]);
  if (data) return res.json(data);
  } catch (error) {
    return res.json(error);
  }
});

                    // user login //
authrouter.post("/login", async (req, res) => {
 const q = "SELECT * FROM user WHERE email = ? ";
  try {

                 // CHEK EXITTING EMAIL  //
    const [data] = await db.query(q, [req.body.email]);
    if (data.length === 0) return res.status(404).json("USER NOT FOUND");

                // CHEK EXITTING PASSWORD  //
   const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!isPasswordCorrect)
      return res.status(400).json("WRONG USER OR PASSWORD");
    const token = Jwt.sign({ id: data[0].id }, "jwtkey");
    const { password, ...other } = data[0];
    // res.cookie("access_token",token, { httpOnly: true} )
     res.status(200).json(
      {
        status: "success",
        message: "Login successful",
        other : other,
        token: token,
         }
  );
    } catch (err) {
   if(err) return res.json(err)
  }
});

                 // user logout//
authrouter.post("/logout", async (req, res) => {
 res.clearCookie("jwtkey") 
      .status(200)
      .json("logout");
});


             //   reset password//
authrouter.post("/sendlink", async (req, res) => {
  const q = "SELECT * FROM user WHERE email = ?  ";
  const Update = "UPDATE  user SET `password` = ? WHERE `id` = ? ";
  try {
    const [data] = await db.query(q, [req.body.email]);
    // console.log(data);
    if (data.length === 0) return res.status(404).json("USER NOT FOUND");
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!isPasswordCorrect) {
       return res.status(400).json("WRONG USER OR PASSWORD");
    }
     const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.newPassword, salt);
    const Updatepassword = await db.query(Update, [hash, data[0].id]);
   if (Updatepassword) {
    return res.status(401).json("okkkkk");
    }
    if (err) return res.json(err);
 } catch (err) {
   if(err) return res.json(err)
  }
});

export default authrouter;
