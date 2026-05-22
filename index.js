const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const db = require("./db");
// const pgp = require("pg-promise")({});
// // const db = pgp('postgres://username:password@host:port/database');
// const db = pgp("postgres://postgres:12345678@localhost:5432/crud_db");

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.get("/", (req, res) => {
  res.json({
    msg: "Hello World",
  });
});

app.get("/merks", (req, res) => {
  db.many(`select * from merk order by id asc`).then((data) => {
    res.json({
      success: true,
      message: "data retrieved successfully",
      data: data,
    });
  });
});

app.get("/products", (req, res) => {
  db.many("select * from product order by product_id asc")
    .then((data) => {
      // console.log(data);

      res.json({
        success: true,
        message: "Data retrieved successfully",
        data: data,
      });
    })
    .catch((error) => {
      res.json({
        success: false,
        message: "Error occurred while retrieving data",
        error,
      });
    });
});

app.get("/products/:product_id", (req, res) => {
  const { product_id } = req.params;
  db.one("select * from product where product_id = $1", [product_id])
    .then((data) => {
      // console.log(data.price);

      res.json({
        success: true,
        message: "Data retrieved successfully",
        data: data,
      });
    })
    .catch((error) => {
      res.json({
        success: false,
        message: "Error occurred while retrieving data",
        error,
      });
    });
});

app.post("/products", (req, res) => {
  const product_name = req.body.product_name;
  const price = req.body.price;
  const expire_date = req.body.expire_date;
  const type = req.body.type;
  console.log(type);

  db.one(
    "insert into product (product_name, price, expire_date, created_at) values ($1, $2, $3, $4) returning *",
    [product_name, price, expire_date, new Date().toISOString()],
  )
    .then((data) => {
      // console.log(data.price);

      res.json({
        success: true,
        message: "Data inserted successfully",
        data: data,
      });
    })
    .catch((error) => {
      res.json({
        success: false,
        message: "Error occurred while inserting data",
        error,
      });
    });
});

app.put("/products/:product_id", (req, res) => {
  const { product_id } = req.params;
  const product_name = req.body.product_name;
  const price = req.body.price;
  const expire_date = req.body.expire_date;

  db.one(
    "update product set product_name = $1, price = $2, expire_date = $3 where product_id = $4 returning *",
    [product_name, price, expire_date, product_id],
  )
    .then((data) => {
      console.log(data.price);

      res.json({
        success: true,
        message: "Data updated successfully",
        data: data,
      });
    })
    .catch((error) => {
      res.json({
        success: false,
        message: "Error occurred while updating data",
        error,
      });
    });
});

app.delete("/products/:product_id", (req, res) => {
  const { product_id } = req.params;

  // res.json({
  //   success: false,
  //   message: "Error occurred while deleting data",
  // });

  db.one("delete from product where product_id = $1 returning *", [product_id])
    .then((data) => {
      console.log(data);

      res.json({
        success: true,
        message: "Data deleted successfully",
        data: data,
      });
    })
    .catch((error) => {
      res.json({
        success: false,
        message: "Error occurred while deleting data",
        error,
      });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
