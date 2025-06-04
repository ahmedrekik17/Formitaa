const mongoose = require("mongoose");
const dbName= process.env.db;
const pw=process.env.ATLAS_PASSWORD;

const uri = `mongodb+srv://root:${pw}@cluster0.qefb4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(uri)
    .then(()=>
        console.log("✅✅✅✅ database connect to " + dbName)
    )
    .catch((err)=>
        console.log("❌❌❌❌ something wrong to connect",err)
    );