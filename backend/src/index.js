"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const GestorRevisionSismos_1 = __importDefault(require("./controllers/GestorRevisionSismos"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const gestor = new GestorRevisionSismos_1.default();
// Iniciar sesion
gestor.iniciarSesion("juan1.p", "123abc");
// Ruta para obtener todos los eventos sismicos auto detectados no revisados
app.get('/eventos-sismicos', (req, res) => {
    gestor.actualizarAPendienteRevision();
    const eventosSismicos = gestor.obtenerEventosSismicosAutodetectados();
    if (eventosSismicos.length === 0) {
        res.status(404).json({ message: "No hay eventos sísmicos" });
    }
    res.json(eventosSismicos);
});
// Ruta para obtener un evento sismico por id
app.get('/eventos-sismicos/:id', (req, res) => {
    const id = req.params.id;
    const evento = gestor.obtenerEventoPorId(id);
    try {
        gestor.bloquearEvento(id);
    }
    catch (error) {
        console.log(error);
    }
    if (!evento) {
        res.status(404).json({ message: "Evento no encontrado" });
    }
    const eventoActualizado = gestor.obtenerEventoPorId(id);
    const datosEvento = gestor.buscarDatosSismicos(id);
    res.json({
        evento: eventoActualizado,
        datosEvento: datosEvento
    });
});
// Ruta para obtener todos los usuarios del sistema
app.get('/usuarios', (req, res) => {
    const usuarios = gestor.obtenerTodosLosUsuarios();
    if (!usuarios) {
        res.status(404).json({ message: "No hay usuarios" });
    }
    res.json(usuarios);
});
// Ruta para obtener la sesion actual
app.get('/sesion-actual', (req, res) => {
    const sesionActual = gestor.obtenerSesionActual();
    if (!sesionActual) {
        res.status(404).json({ message: "Sesion no iniciada" });
    }
    res.json(sesionActual);
});
// Ruta para actualizar el estado del evento
app.post('/eventos-sismicos/:id', (req, res) => {
    const id = req.params.id;
    const { nuevoEstado } = req.body;
    try {
        switch (nuevoEstado) {
            case "confirmado":
                gestor.confirmarEvento(id);
                break;
            case "derivado_experto":
                gestor.derivarEvento(id);
                break;
            default:
                gestor.rechazarEvento(id);
                break;
        }
        res.status(200).json({ message: "Estado actualizado correctamente" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al actualizar el estado" });
    }
});
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
