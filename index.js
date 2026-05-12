//IMPORTS
const express = require("express");
require("dotenv").config();
const fs = require("fs");

//VARIABLES
const app = express();
const PORT = process.env.PORT;
const HOST = process.env.HOST;

//PARA LEER EL ARCHIVO JSON CON LAS LOCALIDADES
const data = fs.readFileSync("./cities.json", "utf-8");
const jsonData = JSON.parse(data);
const localidades = jsonData.localidades;

//RUTA RAIZ DE LAS APIS 
app.get("/", (req, res) => {
    res.status(200).json({
        status: 200,
        message: "API de localidades de la Provincia de Buenos Aires",
        endpoints: {
            todasLasLocalidades: {
                message: "Obtiene un listado completo de todas las localidades",
                metodo: "GET",
                ruta: "/localidades"
            },
            localidadPorId: {
                message: "Obtiene una localidad específica por su ID",
                metodo: "GET",
                ruta: "/localidades/:id"
            },
            buscarPorNombre: {
                metodo: "GET",
                message: "Obtiene una localidad específica por su nombre o elemento de la búsqueda",
                ruta: "/localidades/buscar?nombre=mar"
            }
        }
    });
});

//BUSCA POR NOMBRE O ELEMENTO DE BÚSQUEDA
app.get("/localidades/buscar", (req, res) => {
    const nombre = req.query.nombre;
    if (!nombre) {
        return res.status(400).json({
            status: 400,
            message: "Debe ingresar un nombre",
            data: null
        });
    }

    const resultados = localidades.filter(loc =>
        loc.nombre.toLowerCase().includes(nombre.toLowerCase())
    );

    if (resultados.length === 0) {
        return res.status(404).json({
            status: 404,
            message: "No se encontraron localidades",
            data: []
        });
    }

    res.status(200).json({
        status: 200,
        message: "Resultados encontrados",
        data: resultados
    });
});


//MUESTRA TODAS LAS LOCALIDADES
app.get("/localidades", (req, res) => {
    if (localidades.length === 0) {
        return res.status(404).json({
            status: 404,
            message: "No hay localidades",
            data: []
        });
    }

    res.status(200).json({
        status: 200,
        message: "Listado completo de localidades",
        data: localidades
    });
});

//BUSCA UNA LOCALIDAD POR ID 
app.get("/localidades/:id", (req, res) => {
    const id = req.params.id;

    const localidad = localidades.find(
        loc => loc.id === id
    );

    if (!localidad) {
        return res.status(404).json({
            status: 404,
            message: "Localidad no encontrada",
            data: null
        });
    }

    res.status(200).json({
        status: 200,
        message: "Localidad encontrada",
        data: localidad
    });
});


//404 RUTA NO ENCONTRADA
app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: "Ruta no encontrada",
        data: null
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});