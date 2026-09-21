const express = require("express");
const app = express();
const PORT = 3000;

// set ejs as view engine
app.set("view engine", "ejs");

// static files
app.use(express.static("public"));

// route
app.get("/", (req, res) => {
  const restaurants = [
    {
      name: "Dominos",
      rating: "3.9",
      cuisine: "Biryani, Chinese, North Indian",
      price: "₹150 for one",
      time: "30 min",
      offer: "Flat 15% OFF"
    },
    {
      name: "KFC",
      rating: "4.2",
      cuisine: "North Indian, Mughlai",
      price: "₹400 for one",
      time: "25 min",
      offer: ""
    },
    {
      name: "MC Donalds",
      rating: "4.1",
      cuisine: "North Indian, Mughlai, Kebab",
      price: "₹400 for one",
      time: "41 min",
      offer: "₹100 OFF"
    },
    {
      name: "Paradise Biryani",
      rating: "4.2",
      cuisine: "Biryani, Kebab",
      price: "₹400 for one",
      time: "23 min",
      offer: "40% OFF"
    }
  ];

  res.render("menu", { restaurants });
});

// start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
