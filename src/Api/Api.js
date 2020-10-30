const express = require("express");
//const cors = require("cors");
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");
const Positions = require("./Positions");
const SearchTerm = require("./SearchTerm");
const moment = require("moment");
const app = express();
require("dotenv").config();

//app.use(cors({ origin: process.env.CORS_ORIGIN }));
//app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.use((req, res, next) => {
  console.log("ACESSANDO MIDDLEWARE...");

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

app.get("/positions", async (req, res) => {
  try {
    const data = Number(moment(Date.now()).format("YYYYMMDD"));
    let list = [];
    if (req.query.search) {
      if (req.query.salary === "true") {
        list = await Positions.find({
          code: { $eq: req.query.search },
          salary: { $ne: null },
        });
      } else {
        list = await Positions.find({
          code: { $eq: req.query.search },
          insertDate: { $eq: 20201020 },
        });
      }
      res.json(list);
    } else {
      res.json(list);
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

app.get("/getAllSearchTerms", async (req, res) => {
  try {
    let result = [];
    const data = Number(moment(Date.now()).format("YYYYMMDD"));

    result = await SearchTerm.find({
      //createdAt: new Date("2020-10-15T05:11:21.957+00:00"),
      //createdAt: { $gte: "2020-10-14", $lte: "2020-10-15" },
      insertDate: { $eq: 20201020 },
    });

    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

app.get("/positions/detail", async (req, res) => {
  try {
    let result = [];

    if (req.query.link) {
      result = await getjobDetail(req.query.link);
      res.json(result.result);
    } else {
      res.json(result);
    }
  } catch (error) {
    console.log(error);
  }
});

const getjobDetail = async (link) => {
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(link);

    let result = await page.evaluate(async () => {
      let list = [];
      document.querySelectorAll("#jobDescriptionText").forEach((b) => {
        list.push(b.innerText);
      });
      document.querySelectorAll("#jobDescriptionText p").forEach((b) => {
        list.push(b.innerText);
      });
      document.querySelectorAll("#jobDescriptionText ul li").forEach((b) => {
        list.push(b.innerText);
      });
      return list;
    });
    page.close();
    result = result.join(" ");
    resolve({ result });
  });
};

app.get("/positions/getAll/:search", async (req, res) => {
  try {
    let result = [];
    result = await Positions.find({ code: { $eq: req.params.search } });
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log("server listening at port: " + PORT);
});
