import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import collection from "./src/mongo.js";
import bcrypt from "bcrypt";

const app = express();
const port = 4320;
const salt=10;

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});

app.get("/main", (req, res) => {
    res.render("main.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.get("/loginform", (req, res) => {
    res.render("loginform.ejs");
});

app.post("/submit", async(req, res) => {
   bcrypt.hash(req.body.password,salt,async(err,hash)=>{
    const data={
        name:req.body.username,
        password:hash,
        date:req.body.date
       }
    const query= await collection.insertMany(data);
    if(query){
        res.render("main.ejs");
    }
    else{
        res.send("there was an error");
    }

   });
});

app.post("/submit1", async (req, res) => {
    const loginPassword = req.body.password;

    try {
        const query = await collection.findOne({ "name": req.body.username });

        if (query) {
            const dbPassword = query.password;

            // Use bcrypt.compare as a promise
            const result = await new Promise((resolve, reject) => {
                bcrypt.compare(loginPassword, dbPassword, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });

            if (result) {
                res.render("main.ejs");
            } else {
                res.send("Incorrect Password");
            }
        } else {
            res.send("User not found");
        }
    } catch (error) {
        console.error("Error querying the database or comparing passwords:", error);
        res.status(500).send("Internal Server Error");
    }
});

   
   
   
  


//    const query = await collection.findOne({ "name": req.body.username });
//    if(query){
//     res.render("about.ejs");
//    }
//    else{
//     console.log("error");
//    }

   
   


app.listen(port, () => {
    console.log("Server is running on port", port);
});
