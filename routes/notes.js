import express from "express";
import db from "../db.js";

const notesrouter = express.Router();

notesrouter.get("/getnote", async (req, res) => {
  const q = "SELECT * FROM  notes";
  try {
    // const userid = req.params.id
    const [data] = await db.query(q);

    if (data) return res.json(data);
  } catch (error) {
    return res.json(error);
  }
});
notesrouter.get("/getnote/:id", async (req, res) => {
  const q = "SELECT * FROM  notes WHERE notes.id = ? ";
  try {
    const userid = req.params.id;
  
    const [data] = await db.query(q, [userid]);

    if (data) return res.json(data);
  } catch (error) {
   return res.json(error);
  }
});
//
notesrouter.get("/getnote/:user_id", async (req, res) => {
  const q = "SELECT * FROM  notes  WHERE user_id = ? ";
  try {
    const userid = req.params.user_id;
    const [data] = await db.query(q, [userid]);
  
    if (data) return res.json(data);
  } catch (error) {
    return res.json(error);
  }
});

notesrouter.post("/", async (req, res) => {
  const q =
    "INSERT INTO notes ( `id`,`brand`,`year`,`title`, `description`,`price`,`kilometer`,`image`,`seller_name`,`seller_email`,`location`,`phone_no`,`city`,`state`,`pin_no`) VALUES (default,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

  try {
    const [data] = await db.query(q, [
      req.body.brand,
      req.body.year,
      req.body.title,
      req.body.description,
      req.body.price,
      req.body.kilometer,
      req.body.image,
      req.body.seller_name,
      req.body.seller_email,
      req.body.location,
      req.body.phone_no,
      req.body.city,
      req.body.state,
      req.body.pin_no,
    ]);
    if (data) return res.json("sucessssfulllllllllllllllllyyyyyyyyy");
    console.log("jnfj", data);
  } catch (error) {
    return res.json(error);
  }
});


notesrouter.delete("/:id", async (req, res) => {
  const q = "DELETE FROM notes WHERE id = ?  ";
  try {
    const notesid = req.params.id;
    const [data] = await db.query(q, [notesid]);
    if (data) return res.json("delete successfully");
  } catch (err) {
    return res.json(err);
  }
});

export default notesrouter;
