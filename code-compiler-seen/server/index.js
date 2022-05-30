const express = require("express");
const cors = require("cors");
const Axios = require("axios");
const app = express();
const mongoose = require("mongoose");
const vision = require('@google-cloud/vision');
const Code = require("./models/codeSchema");
const PORT = 8000;

app.use(cors("*"));
app.use(express.json());

function connectDB() {
  mongoose
    .connect(
      "enter mongoatlas  database Link"
    )
    .then((success) => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log(err);
    });
}

connectDB();

app.post("/compile", (req, res) => {
  //getting the required data from the request
  let clientId = "enter your client ID";
  let clientSecret =
    "enter your client secret";
  let code = req.body.code;
  let language = req.body.language;
  let input = req.body.input;

  if (language === "Python3") {
    language = "python3";
  }

  if (!code) return res.send("Code not sent");

  let data = {
    clientId: clientId,
    clientSecret: clientSecret,
    script: code,
    stdin: input,
    language: language,
    versionIndex: "0",
  };

  let config = {
    method: "post",
    url: "https://api.jdoodle.com/v1/execute",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  //calling the code compilation API
  Axios(config)
    .then(async (response) => {
      let saved_code;
      try {
        let new_code = new Code({
          code: code,
          language: req.body.language,
          input: req.body.input,
          date: Date.now(),
          expiryDate: Date.now() + 3600000,
        });

        saved_code = await new_code.save();
      } catch (error) {
        console.log(error);
      }

      res.json({
        data: response.data,
        saved_code,
      });
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/code/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);

  if (!id) {
    return res.send("Not a valid Id");
  }

  let code = await Code.findById(id);

  return res.json(code.code);
});

// OCR SETUP


const CREDENTIALS = JSON.parse(JSON.stringify({
  "enter your Google Credentials"
}))

const CONFIG = {
  credentials: {
      private_key: CREDENTIALS.private_key,
      client_email: CREDENTIALS.client_email
  }
};

const client = new vision.ImageAnnotatorClient(CONFIG);

app.post("/ocr",async(req,res) => {
  let [result] = await client.textDetection("1.jpg");

  return res.status(200).json({
    data:result.fullTextAnnotation.text
  })
})

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
