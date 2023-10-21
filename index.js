const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv');
env.config();

const app = express();
app.use(express.json());//converting the JSON data into javascript object and made available for req.body

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/satyam_db", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connection successful!!");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

// Building a schema blueprint
const databaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  rollNo: {
    type: Number,
    required: true,
    unique: true
  },
  class: {
    type: Number,
    required: true
  },
  tname: {
    type: String,
    required: true
  }
});

// Creating the model
const studentCollection = mongoose.model("studentCollection", databaseSchema);

// Entering data into the database api-----------------------------------------
app.post('/enterdata', (req, res) => {
  const data = req.body;
  console.log(data)
  if (!data) {
    return res.status(400).json({ message: "Please enter the data first" });
  }

  // You should add data validation here to ensure data matches your schema.

  const student = new studentCollection(data);
  console.log(student)
  student.save()
    .then(() => {
      console.log("Data saved");
      res.status(200).json({ message: "Data saved" });
    })
    .catch((error) => {
      console.error("Error saving data:", error);
      res.status(500).json({ message: "Error saving data" });
    });
});



//-------------read the data from the database----------------------------------

app.get('/getdata', async (req, res) => {
    try {
        const data = await studentCollection.find({ name: "satyam" }).select({ name: 1, _id: 0 });
        //console.log(data);
        res.json(data[0].name);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "An error occurred while fetching data" });
    }
});

//--------------------- update data stored in the database ------------------------------

app.post('/updatedata', async(req,res)=>{
    try{
        const data=await studentCollection.updateMany({tname:"hello"},{$set:{tname:"Dr. Sam"}})
        res.status(200).json({message:"Updated successfully"})
    }
    catch(error){
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "An error occurred while fetching data" });

    }
})

//----------------------delete api------------------------------------------

app.delete('/deletedata', async(req,res)=>{
    try{
       const data= await studentCollection.deleteOne({name:"satyam"});
       res.status(200).json({message:"Data deleted successfully"})
        
    }
    catch(error){
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "An error occurred while fetching data" });

    }
})


const PORT = process.env.PORT || 3000; // Set a default port if PORT is not defined in .env
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});


