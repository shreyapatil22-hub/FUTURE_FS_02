// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow your index.html to talk to this server
app.use(express.json());

// 1. Connect to MongoDB (Replace with your local or Atlas URL)
mongoose.connect('mongodb://localhost:27017/freshgrocer', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect", err));

// 2. Define a Schema for your Products
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    rating: Number,
    category: String // e.g., 'featured', 'latest'
});

const Product = mongoose.model('Product', productSchema);

// 3. Create an API Endpoint to get data
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. (Optional) Endpoint to seed dummy data so your DB isn't empty
app.get('/seed', async (req, res) => {
    const sampleData = [
        { name: "Organic Red Apples", price: 3.00, image: "images/Gemini_Generated_Image_red_apples.png", rating: 4, category: "featured" },
        { name: "Fresh Bananas", price: 1.50, image: "images/Gemini_Generated_Image_fresh_bananas.png", rating: 5, category: "featured" },
        { name: "Broccoli Heads", price: 2.00, image: "images/Gemini_Generated_Image_brocoli.png", rating: 4, category: "featured" },
        { name: "Fresh Carrots", price: 1.20, image: "images/Gemini_Generated_Image_carrots.png", rating: 3, category: "featured" }
    ];
    await Product.insertMany(sampleData);
    res.send("Database seeded!");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});