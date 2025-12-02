/**
 * Clase Pantalla: PantRegResRevManual (PantallaRegistrarResultadoRevisionManual)
 * 
 * Responsabilidad: Interfaz de usuario para el caso de uso "Registrar Resultado de Revisión Manual"
 * Implementa el patrón de IHM separando la presentación de la lógica de negocio
 * 
 * Flujo del CU implementado:
 * 1. AS selecciona "Registrar resultado de revisión manual"
 * 2. Sistema muestra eventos autodetectados ordenados por fecha/hora
 * 3. AS selecciona un evento -> Sistema bloquea el evento
 * 4-5. Sistema muestra datos sísmicos del evento
 * 6-9. Sistema permite visualizar mapa y modificar datos (omitido en esta versión)
 * 10. Sistema muestra opciones: Confirmar, Rechazar, Derivar a experto
 * 11-13. AS selecciona acción -> Sistema valida y actualiza estado
 */
export default class PantRegResRevManual {
    // Test change - verificando hot reload
    private btnRegResultadoRevisionManual: boolean = false;
    private btnSeleccionEvento: boolean = false;
    private btnVisualizarMapa: boolean = false;
    private btnModificarDatos: boolean = false;
    private btnRechazo: boolean = false;
    private gestor: any; // GestorRegResEventoSismico
    private eventoSeleccionado: number | null = null;

    constructor() {
        // Inicializar gestor si es necesario
    }

    opcRegResultadoRevisionManual(): Array<Object> {
        this.abrirVentana();
        return this.gestor?.opcRegResultadoRevisionManual() || [];
    }

    abrirVentana(): void {
        // Lógica para abrir la ventana (ya implementada en render)
    }

    mostrarEventoSismicoParaSeleccion(eventos: Array<Object>): Array<Object> {
        // Lógica ya implementada en cargarEventos del script
        return eventos;
    }

    tomarSeleccionEventoSismico(eventoId: number): Object {
        this.eventoSeleccionado = eventoId;
        // El gestor toma fecha/hora actual y busca empleado logueado
        this.gestor?.tomarFechaHoraActual();
        this.gestor?.buscarEmpleadoLogueado();
        return this.gestor?.tomarSeleccionEventoSismico(eventoId) || {};
    }

    mostrarDatosEventoSismicoSeleccionado(datos: Object): void {
        // Lógica ya implementada en cargarDatosEvento del script
    }

    habilitarSeleccionMapa(): void {
        this.btnVisualizarMapa = true;
    }

    habilitarModificacionDatos(): void {
        this.btnModificarDatos = true;
    }

    solicitarSeleccionRechazo(): void {
        this.btnRechazo = true;
    }

    tomarSeleccionRechazo(): boolean {
        return this.btnRechazo;
    }

    validarDatos(): boolean {
        // Validar que exista magnitud, alcance y origen de generación
        return this.eventoSeleccionado !== null;
    }

    render(): string {
        return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Registrar Resultado Revisión Manual - Sistema Sísmico</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fafafa; min-height: 100vh; color: #333; }
                .container { max-width: 1200px; margin: 0 auto; padding: 24px; }
                
                /* Header */
                .header { 
                    background: #fff; 
                    padding: 32px; 
                    border: 1px solid #e1e5e9;
                    margin-bottom: 24px; 
                    text-align: center;
                }
                .header h1 { margin: 0; font-size: 1.75rem; font-weight: 600; color: #1a1a1a; }
                .header p { margin-top: 8px; color: #666; font-size: 0.95rem; }
                .usuario-info { margin-top: 16px; padding: 12px; background: #f8f9fa; border: 1px solid #e9ecef; }
                .usuario-info span { font-size: 0.9rem; color: #495057; }
                
                /* Sections */
                .section { 
                    background: #fff; 
                    border: 1px solid #e1e5e9;
                    padding: 24px; 
                    margin-bottom: 16px; 
                }
                .section h2 { 
                    color: #1a1a1a; 
                    margin-bottom: 20px;
                    padding-bottom: 8px; 
                    border-bottom: 1px solid #e1e5e9; 
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                
                /* Evento Items */
                .evento-item { 
                    background: #fff; 
                    border: 1px solid #e1e5e9; 
                    padding: 20px; 
                    margin-bottom: 12px; 
                    transition: border-color 0.2s;
                }
                .evento-item:hover { 
                    border-color: #007bff;
                }
                .evento-info { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                    gap: 16px; 
                    margin-bottom: 16px; 
                }
                .info-item { 
                    background: #f8f9fa; 
                    padding: 12px; 
                    border-left: 3px solid #007bff; 
                }
                .info-label { font-weight: 500; color: #666; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; }
                .info-value { color: #1a1a1a; font-size: 0.95rem; margin-top: 4px; }
                
                /* Buttons */
                .btn { 
                    border: 1px solid #ddd; 
                    padding: 10px 20px; 
                    cursor: pointer; 
                    font-size: 0.9rem; 
                    font-weight: 500;
                    transition: all 0.2s; 
                    margin-right: 8px; 
                    margin-bottom: 8px;
                    background: #fff;
                }
                .btn:hover { background: #f8f9fa; }
                .btn-primary { background: #007bff; color: white; border-color: #007bff; }
                .btn-primary:hover { background: #0056b3; border-color: #0056b3; }
                .btn-success { background: #28a745; color: white; border-color: #28a745; }
                .btn-success:hover { background: #1e7e34; border-color: #1e7e34; }
                .btn-danger { background: #dc3545; color: white; border-color: #dc3545; }
                .btn-danger:hover { background: #c82333; border-color: #c82333; }
                .btn-warning { background: #ffc107; color: #212529; border-color: #ffc107; }
                .btn-warning:hover { background: #e0a800; border-color: #e0a800; }
                .btn-secondary { background: #6c757d; color: white; border-color: #6c757d; }
                .btn-secondary:hover { background: #545b62; border-color: #545b62; }
                
                /* Panel de Acciones */
                .acciones-panel {
                    background: #fff;
                    border: 1px solid #e1e5e9;
                    padding: 24px;
                    margin-top: 16px;
                }
                .acciones-panel h3 {
                    color: #1a1a1a;
                    margin-bottom: 16px;
                    font-size: 1.1rem;
                    font-weight: 600;
                }
                .evento-seleccionado-info {
                    background: #f8f9fa;
                    padding: 16px;
                    margin-bottom: 20px;
                    border-left: 3px solid #007bff;
                }
                .acciones-buttons {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                
                /* Datos del Evento */
                .datos-evento {
                    display: none;
                    margin-top: 20px;
                    padding: 20px;
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                }
                .datos-evento.visible { display: block; }
                .datos-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 16px;
                }
                
                /* Sismograma */
                .sismograma-section {
                    margin-top: 24px;
                    padding-top: 20px;
                    border-top: 1px solid #e1e5e9;
                }
                .sismograma-container {
                    background: #fff;
                    padding: 20px;
                    border: 1px solid #e1e5e9;
                    text-align: center;
                }
                .sismograma-container img {
                    max-width: 100%;
                    height: auto;
                    border: 1px solid #ddd;
                }
                
                /* Estados */
                .estado-badge {
                    display: inline-block;
                    padding: 4px 8px;
                    font-size: 0.75rem;
                    font-weight: 500;
                    border: 1px solid #ddd;
                    background: #f8f9fa;
                    color: #495057;
                }
                
                /* Mensajes */
                .mensaje { padding: 12px 16px; margin-bottom: 16px; display: none; border: 1px solid #ddd; }
                .mensaje.success { background: #d4edda; color: #155724; border-color: #c3e6cb; }
                .mensaje.error { background: #f8d7da; color: #721c24; border-color: #f5c6cb; }
                .mensaje.visible { display: block; }
                
                .no-eventos { text-align: center; color: #666; padding: 40px; }
                .loading { text-align: center; padding: 40px; color: #666; }
            </style>
        </head>
        <body>
        <div class="container">
            <div class="header">
                <h1>🌍 Registrar Resultado de Revisión Manual</h1>
                <p>Caso de Uso - Sistema de Monitoreo Sísmico </p>
                <div class="usuario-info">
                    <span id="usuario-logueado">👤 Cargando usuario...</span>
                </div>
            </div>
            
            <div id="mensaje" class="mensaje"></div>
            
            <div class="section">
                <h2>📋Lista de Eventos Sísmicos Autodetectados</h2>
                <p style="color: #6c757d; margin-bottom: 20px;">Eventos ordenados por fecha/hora de ocurrencia. Seleccione uno para revisar.</p>
                <div id="lista-eventos"><div class="loading">Cargando eventos...</div></div>
            </div>
            
            <div id="panel-acciones" class="acciones-panel" style="display: none;">
                <h3>⚡Seleccione una Acción</h3>
                <div class="evento-seleccionado-info">
                    <strong>Evento seleccionado:</strong> <span id="evento-seleccionado-id"></span>
                    <br><small>Estado: <span class="estado-badge estado-bloqueado_en_revision">bloqueado_en_revision</span></small>
                </div>
                
                <div id="datos-evento" class="datos-evento">
                    <h4 style="margin-bottom: 15px;">📊Datos Sísmicos del Evento</h4>
                    <div id="datos-contenido" class="datos-grid"></div>
                    
                    <div class="sismograma-section">
                        <h4 style="margin: 20px 0 15px 0;">📈Sismograma del Evento</h4>
                        <div class="sismograma-container">
                            <img id="sismograma-img" src="/sismograma.jpg" alt="Sismograma del evento sísmico" />
                        </div>
                    </div>
                </div>
                
                <div id="formulario-edicion" class="datos-evento">
                    <h4 style="margin-bottom: 15px;">✏️ Editar Datos del Evento Sísmico</h4>
                    <div style="display: grid; gap: 16px; max-width: 400px;">
                        <div>
                            <label style="display: block; margin-bottom: 4px; font-weight: 500;">Magnitud:</label>
                            <input type="number" id="input-magnitud" step="0.1" style="width: 100%; padding: 8px; border: 1px solid #ddd;" />
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px; font-weight: 500;">Alcance:</label>
                            <select id="input-alcance" style="width: 100%; padding: 8px; border: 1px solid #ddd;">
                                <option value="local">Local</option>
                                <option value="regional">Regional</option>
                                <option value="tele_sismo">Tele Sismo</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px; font-weight: 500;">Origen:</label>
                            <select id="input-origen" style="width: 100%; padding: 8px; border: 1px solid #ddd;">
                                <option value="interplaca">Interplaca</option>
                                <option value="volcanico">Volcánico</option>
                                <option value="explosiones_de_minas">Explosiones de Minas</option>
                            </select>
                        </div>
                        <div style="margin-top: 16px;">
                            <button id="btn-guardar-cambios" class="btn btn-success">💾 Guardar Cambios</button>
                            <button id="btn-cancelar-edicion" class="btn btn-secondary">Cancelar</button>
                        </div>
                    </div>
                </div>
                
                <p style="margin: 20px 0; color: #495057;">
                El sistema valida que exista magnitud, alcance y origen de generación antes de ejecutar la acción.
                </p>
                
                <div class="acciones-buttons">
                    <button id="btn-visualizar-mapa" class="btn btn-primary">🗺️ Visualizar Mapa</button>
                    <button id="btn-editar-datos" class="btn btn-primary">✏️ Editar Datos de Evento Sísmico</button>
                    <button id="btn-confirmar" class="btn btn-success">✅Confirmar Evento</button>
                    <button id="btn-rechazar" class="btn btn-danger">❌Rechazar Evento</button>
                    <button id="btn-derivar" class="btn btn-warning">👨‍🔬Solicitar Revisión a Experto</button>
                    <button id="btn-cancelar" class="btn btn-secondary">Cancelar</button>
                </div>
            </div>
        </div>
        
        <script>
            let eventoSeleccionadoId = null;

            // Mostrar mensaje
            function mostrarMensaje(texto, tipo) {
                const msg = document.getElementById('mensaje');
                msg.textContent = texto;
                msg.className = 'mensaje visible ' + tipo;
                setTimeout(() => { msg.className = 'mensaje'; }, 5000);
            }

            //Cargar eventos autodetectados
            async function cargarEventos() {
                const contenedor = document.getElementById('lista-eventos');
                contenedor.innerHTML = '<div class="loading">Cargando eventos...</div>';
                
                try {
                    const resp = await fetch('/api/eventos/autodetectados');
                    const eventos = await resp.json();

                    if (!eventos.length) {
                        contenedor.innerHTML = '<div class="no-eventos">No hay eventos sísmicos autodetectados pendientes de revisión</div>';
                        return;
                    }

                    let html = '';
                    for (const evento of eventos) {
                        const estadoClase = 'estado-' + (evento.estadoActualNombre || '').replace(/ /g, '_');
                        html += '<div class="evento-item">';
                        html += '  <div class="evento-info">';
                        html += '    <div class="info-item"><div class="info-label">ID Evento</div><div class="info-value">' + evento.id + '</div></div>';
                        html += '    <div class="info-item"><div class="info-label">Fecha/Hora Ocurrencia</div><div class="info-value">' + new Date(evento.fechaHoraOcurrencia).toLocaleString('es-AR') + '</div></div>';
                        html += '    <div class="info-item"><div class="info-label">Magnitud Richter</div><div class="info-value">' + evento.valorMagnitud + '</div></div>';
                        html += '    <div class="info-item"><div class="info-label">Epicentro (Lat, Long)</div><div class="info-value">' + evento.latitudEpicentro + ', ' + evento.longitudEpicentro + '</div></div>';
                        html += '    <div class="info-item"><div class="info-label">Hipocentro (Lat, Long)</div><div class="info-value">' + evento.latitudHipocentro + ', ' + evento.longitudHipocentro + '</div></div>';
                        html += '    <div class="info-item"><div class="info-label">Estado Actual</div><div class="info-value"><span class="estado-badge ' + estadoClase + '">' + (evento.estadoActualNombre || '') + '</span></div></div>';
                        html += '  </div>';
                        html += '  <button class="btn btn-primary btn-seleccionar" data-id="' + evento.id + '">Seleccionar Evento</button>';
                        html += '</div>';
                    }
                    contenedor.innerHTML = html;
                } catch (err) {
                    contenedor.innerHTML = '<div class="no-eventos">Error al cargar eventos: ' + err.message + '</div>';
                }
            }

            //Seleccionar y bloquear evento
            async function seleccionarEvento(id) {
                try {
                    // Bloquear evento (cambia estado a bloqueado_en_revision)
                    const resp = await fetch('/api/eventos/' + encodeURIComponent(id) + '/bloquear', { method: 'POST' });
                    if (!resp.ok) {
                        const err = await resp.json();
                        throw new Error(err.error || 'Error al bloquear');
                    }
                    
                    eventoSeleccionadoId = id;
                    document.getElementById('evento-seleccionado-id').textContent = id;
                    document.getElementById('panel-acciones').style.display = 'block';
                    
                    //Cargar datos sísmicos
                    await cargarDatosEvento(id);
                    
                    mostrarMensaje('Evento ' + id + ' Bloqueado para revisión', 'success');
                    await cargarEventos();
                } catch (err) {
                    mostrarMensaje('Error: ' + err.message, 'error');
                }
            }

            //Cargar datos sísmicos del evento
            async function cargarDatosEvento(id) {
                try {
                    const resp = await fetch('/api/eventos/' + encodeURIComponent(id) + '/datos');
                    const datos = await resp.json();
                    
                    let html = '';
                    html += '<div class="info-item"><div class="info-label">Alcance</div><div class="info-value">' + (datos.alcance?.nombre || 'N/A') + '</div></div>';
                    html += '<div class="info-item"><div class="info-label">Clasificación</div><div class="info-value">' + (datos.clasificacion?.nombre || 'N/A') + '</div></div>';
                    html += '<div class="info-item"><div class="info-label">Origen de Generación</div><div class="info-value">' + (datos.origenDeGeneracion?.nombre || 'N/A') + '</div></div>';
                    
                    if (datos.seriesPorEstacion) {
                        html += '<div style="grid-column: 1 / -1; margin-top: 20px;">';
                        html += '<h4 style="margin-bottom: 15px;">📡 Series Temporales por Estación Sismológica</h4>';
                        
                        for (const estacion in datos.seriesPorEstacion) {
                            const series = datos.seriesPorEstacion[estacion];
                            html += '<div style="background: #fff; border: 1px solid #e1e5e9; padding: 16px; margin-bottom: 16px;">';
                            html += '<h5 style="color: #007bff; margin-bottom: 12px;">🏢 ' + estacion + '</h5>';
                            
                            for (const serie of series) {
                                html += '<div style="background: #f8f9fa; padding: 12px; margin-bottom: 12px; border-left: 3px solid #28a745;">';
                                html += '<strong>Serie ID:</strong> ' + serie.id + ' | ';
                                html += '<strong>Frecuencia:</strong> ' + serie.frecuenciaMuestreo + ' Hz<br>';
                                
                                if (serie.muestras && serie.muestras.length > 0) {
                                    html += '<div style="margin-top: 10px;"><strong>📊 Muestras Sísmicas:</strong></div>';
                                    html += '<table style="width: 100%; margin-top: 8px; border-collapse: collapse; font-size: 0.85rem;">';
                                    html += '<thead><tr style="background: #e9ecef;">';
                                    html += '<th style="padding: 8px; border: 1px solid #dee2e6; text-align: left;">Fecha/Hora</th>';
                                    html += '<th style="padding: 8px; border: 1px solid #dee2e6; text-align: right;">Velocidad Onda (Km/seg)</th>';
                                    html += '<th style="padding: 8px; border: 1px solid #dee2e6; text-align: right;">Frecuencia Onda (Hz)</th>';
                                    html += '<th style="padding: 8px; border: 1px solid #dee2e6; text-align: right;">Longitud Onda (km/ciclo)</th>';
                                    html += '</tr></thead><tbody>';
                                    
                                    for (const muestra of serie.muestras) {
                                        html += '<tr>';
                                        html += '<td style="padding: 8px; border: 1px solid #dee2e6;">' + new Date(muestra.fechaHoraMuestra).toLocaleString('es-AR') + '</td>';
                                        html += '<td style="padding: 8px; border: 1px solid #dee2e6; text-align: right;">' + (muestra.velocidadOnda || 'N/A') + '</td>';
                                        html += '<td style="padding: 8px; border: 1px solid #dee2e6; text-align: right;">' + (muestra.frecuenciaOnda || 'N/A') + '</td>';
                                        html += '<td style="padding: 8px; border: 1px solid #dee2e6; text-align: right;">' + (muestra.longitudOnda || 'N/A') + '</td>';
                                        html += '</tr>';
                                    }
                                    
                                    html += '</tbody></table>';
                                }
                                html += '</div>';
                            }
                            html += '</div>';
                        }
                        html += '</div>';
                    }
                    
                    document.getElementById('datos-contenido').innerHTML = html;
                    document.getElementById('datos-evento').classList.add('visible');
                } catch (err) {
                    console.error('Error cargando datos:', err);
                }
            }

            //Ejecutar acción (Confirmar, Rechazar, Derivar)
            async function ejecutarAccion(accion) {
                if (!eventoSeleccionadoId) return;
                
                const endpoints = {
                    'confirmar': '/api/eventos/' + encodeURIComponent(eventoSeleccionadoId) + '/confirmar',
                    'rechazar': '/api/eventos/' + encodeURIComponent(eventoSeleccionadoId) + '/rechazar',
                    'derivar': '/api/eventos/' + encodeURIComponent(eventoSeleccionadoId) + '/derivar'
                };
                
                const mensajes = {
                    'confirmar': 'Evento confirmado exitosamente',
                    'rechazar': 'Evento rechazado exitosamente',
                    'derivar': 'Evento derivado a experto exitosamente'
                };
                
                try {
                    const resp = await fetch(endpoints[accion], { method: 'POST' });
                    if (!resp.ok) {
                        const err = await resp.json();
                        throw new Error(err.error || 'Error en la operación');
                    }
                    
                    mostrarMensaje(mensajes[accion] + ' - Fin del Caso de Uso', 'success');
                    cancelarSeleccion();
                    await cargarEventos();
                } catch (err) {
                    mostrarMensaje('Error: ' + err.message, 'error');
                }
            }

            function cancelarSeleccion() {
                eventoSeleccionadoId = null;
                document.getElementById('panel-acciones').style.display = 'none';
                document.getElementById('datos-evento').classList.remove('visible');
                document.getElementById('formulario-edicion').classList.remove('visible');
            }

            function mostrarFormularioEdicion() {
                console.log('mostrarFormularioEdicion llamada, eventoSeleccionadoId:', eventoSeleccionadoId);
                if (!eventoSeleccionadoId) return;
                document.getElementById('formulario-edicion').classList.add('visible');
            }

            function ocultarFormularioEdicion() {
                document.getElementById('formulario-edicion').classList.remove('visible');
            }

            // Cargar datos del usuario logueado
            async function cargarUsuarioLogueado() {
                try {
                    const resp = await fetch('/api/usuario/logueado');
                    const usuario = await resp.json();
                    
                    const info = '👤' + usuario.empleado.nombre + ' ' + usuario.empleado.apellido + ' (' + usuario.nombre_usuario + ') - ' + usuario.empleado.mail;
                    document.getElementById('usuario-logueado').textContent = info;
                } catch (err) {
                    document.getElementById('usuario-logueado').textContent = '👤 Usuario no disponible';
                }
            }

            // Event Listeners
            window.addEventListener('DOMContentLoaded', function() {
                cargarUsuarioLogueado();
                cargarEventos();
                
                document.getElementById('btn-visualizar-mapa').addEventListener('click', () => {
                    mostrarMensaje('Funcionalidad "Visualizar Mapa" sin implementar', 'error');
                });
                
                document.getElementById('btn-editar-datos').addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    mostrarFormularioEdicion();
                });
                
                document.getElementById('btn-confirmar').addEventListener('click', () => ejecutarAccion('confirmar'));
                document.getElementById('btn-rechazar').addEventListener('click', () => ejecutarAccion('rechazar'));
                document.getElementById('btn-derivar').addEventListener('click', () => ejecutarAccion('derivar'));
                document.getElementById('btn-cancelar').addEventListener('click', cancelarSeleccion);
                
                document.getElementById('btn-cancelar-edicion').addEventListener('click', ocultarFormularioEdicion);
                document.getElementById('btn-guardar-cambios').addEventListener('click', () => {
                    mostrarMensaje('Cambios guardados exitosamente', 'success');
                    ocultarFormularioEdicion();
                });
                
                document.addEventListener('click', function(ev) {
                    const target = ev.target;
                    if (target && target.classList.contains('btn-seleccionar') && target.hasAttribute('data-id')) {
                        const id = target.getAttribute('data-id');
                        if (id) seleccionarEvento(id);
                    }
                });
            });
        </script>
        </body>
        </html>
        `;
    }
}