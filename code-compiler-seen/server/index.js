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
      "mongodb+srv://rahul:mohit12345R@cluster0.wsxos.mongodb.net/Fast-ide?retryWrites=true&w=majority"
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
  let clientId = "469bd39d11e90e07e47c8745892e74e";
  let clientSecret =
    "342e1fb3f4862f57844d3d9cfa4b55217acde8fbcf335f2135aca8eb2408bb9";
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
  "type": "service_account",
  "project_id": "minor-project-351616",
  "private_key_id": "612a583ed48ebbf6e218c64028085e30b2acfe13",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCpdfZD+U8kXshZ\nWEGqeCdTqHK1KnLewhoQ6gkX+T82uU63/uq56DWILq5O0KUkQ/wpd5cjynWuptqo\nL+wq592iQwcGd4VWXrld01iO6fO7QwM4LaTAkILkvRTyXuclTgUp/0jvA3jQorFJ\n2/0Me2bKHhO5pbiV3ANbDA3zYQEMXiYs8Et0CIqy3Tu7vnRACS2ZFFIKSPSoNLrH\n4JxsBuvO7SzIFBx3JLig7JtCc3co/Pd6/6kBEShnEeKGDcWgW4ED0c3eEpNw1zVc\nohOk7pQRKYrCNYBh1txrIaX5oKXGp7cvr+SXiJX+0Jh1/cByUovrkZM0KJeScMTx\nlscG0X8RAgMBAAECggEAA1mNGi/h9B6ZiEaZ2bRRVrKEPfeOWL/ugvoVXu9y4/KK\nz1FPM4iXEk+V64HtWcesQueVycPVSrQKq3tzCDAYLf50M5kGPjxWHrgwTnbqdf+v\nnxsr4BCbPclNEjN1D0Q5Duj4eJ0RdNJafdLG8Em6MPGiQy+28+Nq/5A/8FkxC50C\nmQtLb+9TNXKbEERvHQC6qd9aZ+kfp/hTo3tKQAJnqHwDuvEKAqyq0oVtwvioZsnL\nSOJe/L0wlwaknEPOCYflVnhMGTGSVwTiARcFDYqUIbqs6p2Ly+YauBgijWTbZrV2\nI851Sk/vqAmYCQf0UENw3sK1FPPXlPRv4eZ7TMGMLwKBgQDSGSskSY1BRuIHWk/J\nvZftpZMheskTwbtuJmJYwSZOLPhX04DhVNM8h5OhYkzJAXd/e+DRbxjg8Lzcst8B\ncO+HCDf4tGfDVHeKZh7Vgp98Uv+9G/X1aavoO83aZbU5VMnriJTFbdwY9rjO7tR2\ng4msa6EqQ0pNowp1Jqbz6cVzzwKBgQDOe+4o/3NBXWUeqz0wZpxk4jXx9zzHGBOb\n6L6jcqCoIK/sYWdF3IcivkzEcU83AglCHQb0/e1Ygzq2zOBBsr6zdq72j2a7DDmG\naTgGZZF0XBbnLprBhRTMbTUJ0X39YGfBUwE3UPPt+CLWvjJo0LK281OKgKR7YIan\nEYJo2kk3HwKBgGR7hRal1tkRfajmmKJz+uW9+tBYWTMJxQq5cO/h8OASwfO/RDSA\nzUZ10TWuPeskuHJQXQXNjKiIestTATU/Pk/mrl5UagwRqdqXXMfg4UYkrAtWBByL\nnZxEff+mBTaWRrxPZlfGYy3NUjYmI5dK8d103G/KHw9imu3MvqyJcdYhAoGBAKcP\nXgGNrJKWHdpScY9XdfGplDvQ7TuoHzVlediERbfBupRlukirxCo4DaRiiNTYsOTs\n11QgnoeepUKBQG/nTqOkwqp6G4P6wBAf0VRbmPOsDlu9OTiZk9pSATeQZ385ILkp\njzJSLQm8WXOlLuPe9rlO5aiJrIql7kv9vqVW9yXBAoGBAL32XylVByfZ8mTJizT3\nx4pr100vDQMDm3if/xAHAm/Aa2aFVWAVrz1vFmxNb0YXIGjKqnVaLrzdZu54ggUy\nDXFMHOl83mpyFXz6glZmZIhN5N/l9LconeY1v1rEcI5FEHVW6WW2vjA1XCkKxBXx\ngFyl3gYhKxHzzG/e/FTSLhL5\n-----END PRIVATE KEY-----\n",
  "client_email": "minor-project-351616@minor-project-351616.iam.gserviceaccount.com",
  "client_id": "116901625075747126458",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/minor-project-351616%40minor-project-351616.iam.gserviceaccount.com"
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
