import express from "express"; //Importamos Express para manipular el servidor Web
import fs from "fs"; //Importamos el modulo FileSystem para poder acceder a nuestra FakeApi
import bodyParser from "body-parser"; // Importa bodyParser para analizar el cuerpo de las solicitudes

const app = express(); // Crea una nueva instancia de la aplicación Express
app.use(bodyParser.json()); // Usa bodyParser para analizar el cuerpo de las solicitudes en formato JSON

// Función para leer los datos de la base de datos desde un archivo JSON
const readData = () => {
  try {
    const data = fs.readFileSync("./db.json"); // Lee el archivo db.json
    return JSON.parse(data); // Convierte los datos del archivo JSON a un objeto JavaScript
  } catch (error) {
    console.log(error); // Maneja cualquier error y muestra un mensaje en la consola
  }
};

// Función para escribir los datos en la base de datos en un archivo JSON
const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data)); // Escribe los datos en el archivo db.json en formato JSON
  } catch (error) {
    console.log(error); // Maneja cualquier error y muestra un mensaje en la consola
  }
};

// Ruta de inicio que envía un mensaje de bienvenida
app.get("/", (req, res) => {
  res.send("Bienvenido a mi primer Api con Node js!");
});

// Ruta para obtener todas las películas
app.get("/Peliculas", (req, res) => {
  const data = readData(); // Lee los datos de la base de datos
  res.json(data.Peliculas); // Envía la lista de películas como respuesta en formato JSON
});

// Ruta para obtener una película por su ID
app.get("/Peliculas/:id", (req, res) => {
  const data = readData(); // Lee los datos de la base de datos
  const id = parseInt(req.params.id); // Obtiene el ID de la película de los parámetros de la solicitud
  const pelicula = data.Peliculas.find((pelicula) => pelicula.id === id); // Busca la película por su ID
  res.json(pelicula); // Envía la película encontrada como respuesta en formato JSON
});

// Ruta para agregar una nueva película
app.post("/Peliculas", (req, res) => {
  const data = readData(); // Lee los datos de la base de datos
  const body = req.body; // Obtiene el cuerpo de la solicitud, que contiene los datos de la nueva película
  const newMovie = {
    id: data.Peliculas.length + 1, // Genera un nuevo ID para la película
    ...body, // Combina los datos de la nueva película con el cuerpo de la solicitud
  };
  data.Peliculas.push(newMovie); // Agrega la nueva película a la lista de películas
  writeData(data); // Escribe los datos actualizados en la base de datos
  res.json(newMovie); // Envía la nueva película como respuesta en formato JSON
});

// Ruta para actualizar una película existente
app.put("/Peliculas/:id", (req, res) => {
  const data = readData(); // Lee los datos de la base de datos
  const body = req.body; // Obtiene el cuerpo de la solicitud, que contiene los datos actualizados de la película
  const id = parseInt(req.params.id); // Obtiene el ID de la película que se va a actualizar
  const movieIndex = data.Peliculas.findIndex((pelicula) => pelicula.id === id); // Busca el índice de la película por su ID
  data.Peliculas[movieIndex] = { // Actualiza los datos de la película en la lista de películas
    ...data.Peliculas[movieIndex], // Conserva los datos existentes de la película
    ...body, // Sobrescribe los datos existentes con los nuevos datos proporcionados en el cuerpo de la solicitud
  };
  writeData(data); // Escribe los datos actualizados en la base de datos
  res.json({ message: "Pelicula actualizada correctamente" }); // Envía un mensaje de éxito como respuesta en formato JSON
});

// Ruta para eliminar una película por su ID
app.delete("/Peliculas/:id", (req, res) => {
  const data = readData(); // Lee los datos de la base de datos
  const id = parseInt(req.params.id); // Obtiene el ID de la película que se va a eliminar
  const movieIndex = data.Peliculas.findIndex((pelicula) => pelicula.id === id); // Busca el índice de la película por su ID
  data.Peliculas.splice(movieIndex, 1); // Elimina la película del arreglo de películas
  writeData(data); // Escribe los datos actualizados en la base de datos
  res.json({ message: `Pelicula con id: ${id} eliminada exitosamente` }); // Envía un mensaje de éxito como respuesta en formato JSON
});

// Escucha las solicitudes en el puerto 3000
app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000"); // Muestra un mensaje en la consola cuando el servidor se inicia correctamente
});