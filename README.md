# 🌍 Sistema de Registro Sísmico - CCRS

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**Trabajo Práctico Integrador - Diseño de Sistemas 2025**

*Universidad Tecnológica Nacional - Facultad Regional Córdoba*

</div>

---

## 📋 Descripción

Sistema de gestión de eventos sísmicos para el **Centro de Registro Sísmico (CCRS)**. Implementa el caso de uso **"Registrar Resultado de Revisión Manual"**, permitiendo a los analistas de sistemas revisar, confirmar, rechazar o derivar eventos sísmicos autodetectados.

### 🎯 Caso de Uso Principal

El sistema permite al Analista de Sistemas (AS):
- Visualizar eventos sísmicos autodetectados/pendientes de revisión
- Bloquear un evento para revisión exclusiva
- Ver datos completos del evento (epicentro, hipocentro, magnitud, series temporales, sismogramas)
- **Confirmar** el evento como válido
- **Rechazar** el evento como falso positivo  
- **Derivar a experto** para análisis especializado

---

## 🏗️ Arquitectura

El proyecto implementa **patrones de diseño** estudiados en la materia:

| Patrón | Implementación |
|--------|----------------|
| **State** | Manejo de estados del evento (`EstadoAutoDetectado`, `EstadoPendienteRevision`, `EstadoBloqueadoRevision`, `EstadoConfirmado`, `EstadoRechazado`, `EstadoDerivadoExperto`) |


### 📁 Estructura del Proyecto

```
ppai-grupo3dsi/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── GestorRegResEventoSismico.ts    # Controlador principal 
│   │   ├── models/
│   │   │   ├── EventoSismico.ts                # Entidad principal
│   │   │   ├── Estado.ts                       # State Pattern base
│   │   │   ├── EstadoAutoDetectado.ts          # Estados concretos
│   │   │   ├── EstadoBloqueadoRevision.ts
│   │   │   ├── EstadoConfirmado.ts
│   │   │   ├── EstadoRechazado.ts
│   │   │   ├── EstadoDerivadoExperto.ts
│   │   │   ├── FabricaEstado.ts                
│   │   │   ├── SerieTemporal.ts
│   │   │   ├── MuestraSismica.ts
│   │   │   ├── Sismografo.ts
│   │   │   ├── EstacionSismologica.ts
│   │   │   ├── ClasificacionSismo.ts
│   │   │   ├── AlcanceSismo.ts
│   │   │   └── ...
│   │   └── index.ts                            # Servidor Express + API REST
│   ├── docker-compose.yml                      # Base de datos MySQL
│   ├── init_db.sql                             # Script de inicialización BD
│   └── package.json
├── pantalla/
│   ├── PanRegResRevManual.ts                   # Interfaz de usuario (HTML)
│   └── styles.css
└── README.md
```

---

## 🚀 Instalación y Ejecución

### Prerrequisitos

- [Node.js](https://nodejs.org/) v18+ 
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com/)

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/FeliDB/ppai-grupo3dsi.git
cd ppai-grupo3dsi
```

### 2️⃣ Levantar la base de datos (MySQL con Docker)

```bash
cd backend
docker-compose up -d
```

> ⏳ Esperar ~30 segundos para que MySQL inicialice y ejecute el script `init_db.sql`

### 3️⃣ Instalar dependencias

```bash
npm install
```

### 4️⃣ Ejecutar el servidor

```bash
npm run dev
```

### 5️⃣ Acceder a la aplicación

Abrir en el navegador: **http://localhost:3000**

---

## 🔌 API REST

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/eventos/autodetectados` | Lista eventos pendientes de revisión |
| `GET` | `/api/eventos/:id/datos` | Obtiene datos completos del evento |
| `POST` | `/api/eventos/:id/bloquear` | Bloquea evento para revisión |
| `POST` | `/api/eventos/:id/confirmar` | Confirma el evento |
| `POST` | `/api/eventos/:id/rechazar` | Rechaza el evento |
| `POST` | `/api/eventos/:id/derivar` | Deriva a experto |
| `GET` | `/api/usuario/logueado` | Obtiene usuario actual |

---

## 🗄️ Base de Datos

**Motor:** MySQL 8.0 (Docker)

**Credenciales por defecto:**
- Host: `localhost`
- Puerto: `3306`
- Base de datos: `sismografo`
- Usuario: `root`
- Contraseña: `12345`

### Tablas principales

- `EventoSismico` - Eventos sísmicos detectados
- `Estado` - Catálogo de estados posibles
- `CambioEstado` - Historial de transiciones de estado
- `SerieTemporal` - Series de datos de sismógrafos
- `MuestraSismica` - Muestras individuales
- `Sismografo` - Dispositivos de medición
- `EstacionSismologica` - Estaciones de monitoreo

---

## 🛠️ Tecnologías

- **Backend:** Node.js + Express.js + TypeScript
- **Base de Datos:** MySQL 8.0
- **Contenedores:** Docker + Docker Compose
- **Frontend:** HTML/CSS/JS (Server-Side Rendering)

---

## 📊 Diagramas

El repositorio incluye diagramas UML del diseño:

- `clase.png` / `Patron Diagrama de clases TPI.jpg` - Diagrama de clases
- `secuencia.png` / `Patron Diagrama de secuencia TPI Diseño.jpg` - Diagrama de secuencia

---

## 👥 Grupo 3 - Diseño de Sistemas

Trabajo Práctico Integrador 2025

Universidad Tecnológica Nacional - Facultad Regional Córdoba

---

## 📝 Licencia

ISC

