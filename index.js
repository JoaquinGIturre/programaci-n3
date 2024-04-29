import express from "express";
import fs from "fs";
import bodyParser from "body-parser";


const app = express();
app.use(bodyParser.json());

const readData = () => {
  try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const writeData = () => {
    try {
      fs.writeFileSync('./db.json', JSON.stringify());
    } catch (error) {
      console.log(error);
    }
  };

readData();
writeData();

app.get("/Peliculas", (req, res) => {
  const data = readData();
  res.json(data.Peliculas);
});

app.get("/Peliculas/:id", (req,res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const pelicula = data.Peliculas.find((pelicula) => pelicula.id === id);
    res.json(pelicula);
})

app.post("/Peliculas", (req,res) => {
    const data = readData();
    const body = req.body;
    const newMovie = {
        id: data.Peliculas.length + 1,
        ...body,
    };
    data.Peliculas.push(newMovie)
    writeData()
    res.json(newMovie);
});

app.listen(3001, () => {
  console.log("Servidor corriendo en puerto 3001");
});
