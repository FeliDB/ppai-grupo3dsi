import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from "http"



import GestorRevisionSismos from './controllers/GestorRevisionSismos'
import PantRegResRevManual from '../../pantalla/PanRegResRevManual'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const gestor = new GestorRevisionSismos()
const pantalla = new PantRegResRevManual() 

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'sismografo'
});


const server = http.createServer((req, res) => {
  const html = pantalla.render()
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(html)
})


server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

