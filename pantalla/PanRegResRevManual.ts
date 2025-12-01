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
    render(): string {
        return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Registrar Resultado de Revisión Manual - Sistema Sísmico</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f2f5; min-height: 100vh; }
                .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
                
                /* Header */
                .header { 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; padding: 30px; border-radius: 12px; 
                    margin-bottom: 30px; text-align: center;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                }
                .header h1 { margin: 0; font-size: 2.2em; font-weight: 600; }
                .header p { margin-top: 10px; opacity: 0.9; font-size: 1.1em; }
                
                /* Sections */
                .section { 
                    background: white; border-radius: 12px; 
                    box-shadow: 0 2px 10px rgba(0,0,0,0.08); 
                    padding: 25px; margin-bottom: 20px; 
                }
                .section h2 { 
                    color: #333; margin-top: 0; margin-bottom: 20px;
                    padding-bottom: 12px; border-bottom: 3px solid #667eea; 
                    font-size: 1.4em;
                }
                
                /* Evento Items */
                .evento-item { 
                    background: #f8f9fa; border: 1px solid #e9ecef; 
                    border-radius: 10px; padding: 20px; margin-bottom: 15px; 
                    transition: all 0.3s ease;
                }
                .evento-item:hover { 
                    transform: translateY(-3px); 
                    box-shadow: 0 6px 20px rgba(0,0,0,0.12); 
                    border-color: #667eea;
                }
                .evento-info { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); 
                    gap: 15px; margin-bottom: 15px; 
                }
                .info-item { 
                    background: white; padding: 12px; border-radius: 8px; 
                    border-left: 4px solid #667eea; 
                }
                .info-label { font-weight: 600; color: #6c757d; font-size: 0.85em; text-transform: uppercase; }
                .info-value { color: #212529; font-size: 1.1em; margin-top: 4px; }
                
                /* Buttons */
                .btn { 
                    border: none; padding: 12px 24px; border-radius: 8px; 
                    cursor: pointer; font-size: 1em; font-weight: 500;
                    transition: all 0.3s ease; margin-right: 10px; margin-bottom: 10px;
                }
                .btn-primary { background: #667eea; color: white; }
                .btn-primary:hover { background: #5a6fd6; transform: translateY(-2px); }
                .btn-success { background: #28a745; color: white; }
                .btn-success:hover { background: #218838; }
                .btn-danger { background: #dc3545; color: white; }
                .btn-danger:hover { background: #c82333; }
                .btn-warning { background: #ffc107; color: #212529; }
                .btn-warning:hover { background: #e0a800; }
                .btn-secondary { background: #6c757d; color: white; }
                .btn-secondary:hover { background: #5a6268; }
                
                /* Panel de Acciones */
                .acciones-panel {
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border: 2px solid #667eea;
                    border-radius: 12px;
                    padding: 25px;
                    margin-top: 20px;
                }
                .acciones-panel h3 {
                    color: #667eea;
                    margin-bottom: 15px;
                    font-size: 1.2em;
                }
                .evento-seleccionado-info {
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    border-left: 4px solid #667eea;
                }
                .acciones-buttons {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                
                /* Datos del Evento */
                .datos-evento {
                    display: none;
                    margin-top: 20px;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 10px;
                }
                .datos-evento.visible { display: block; }
                .datos-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 15px;
                }
                
                /* Estados */
                .estado-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.85em;
                    font-weight: 500;
                }
                .estado-auto_detectado { background: #fff3cd; color: #856404; }
                .estado-pendiente_de_revision { background: #cce5ff; color: #004085; }
                .estado-bloqueado_en_revision { background: #d4edda; color: #155724; }
                .estado-confirmado { background: #28a745; color: white; }
                .estado-rechazado { background: #dc3545; color: white; }
                .estado-derivado_experto { background: #17a2b8; color: white; }
                
                /* Mensajes */
                .mensaje { padding: 15px; border-radius: 8px; margin-bottom: 15px; display: none; }
                .mensaje.success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
                .mensaje.error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
                .mensaje.visible { display: block; }
                
                .no-eventos { text-align: center; color: #6c757d; font-style: italic; padding: 40px; }
                .loading { text-align: center; padding: 40px; color: #667eea; }
            </style>
        </head>
        <body>
        <div class="container">
            <div class="header">
                <h1>🌍 Registrar Resultado de Revisión Manual</h1>
                <p>Caso de Uso - Sistema de Monitoreo Sísmico | Patrón State (GoF)</p>
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
                </div>
                
                <p style="margin: 20px 0; color: #495057;">
                El sistema valida que exista magnitud, alcance y origen de generación antes de ejecutar la acción.
                </p>
                
                <div class="acciones-buttons">
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
                        html += '  <button class="btn btn-primary btn-seleccionar" data-id="' + evento.id + '">Seleccionar Evento (Paso 3)</button>';
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
                    
                    mostrarMensaje('Evento ' + id + ' bloqueado para revisión (Paso 4 completado)', 'success');
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
                    html += '<div class="info-item"><div class="info-label">Clasificación</div><div class="info-value">' + (datos.clasificacion?.getNombreClasificacion?.() || datos.clasificacion?.nombre || 'N/A') + '</div></div>';
                    html += '<div class="info-item"><div class="info-label">Origen de Generación</div><div class="info-value">' + (datos.origenDeGeneracion?.getNombre?.() || datos.origenDeGeneracion?.nombre || 'N/A') + '</div></div>';
                    
                    if (datos.seriesTemporales && datos.seriesTemporales.length > 0) {
                        html += '<div class="info-item" style="grid-column: 1 / -1;"><div class="info-label">Series Temporales por Estación</div><div class="info-value">' + datos.seriesTemporales.length + ' estación(es) registrada(s)</div></div>';
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
                    'rechazar': 'Evento rechazado exitosamente (Paso 13 completado)',
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
            }

            // Event Listeners
            window.addEventListener('DOMContentLoaded', function() {
                cargarEventos();
                
                document.getElementById('btn-confirmar').addEventListener('click', () => ejecutarAccion('confirmar'));
                document.getElementById('btn-rechazar').addEventListener('click', () => ejecutarAccion('rechazar'));
                document.getElementById('btn-derivar').addEventListener('click', () => ejecutarAccion('derivar'));
                document.getElementById('btn-cancelar').addEventListener('click', cancelarSeleccion);
                
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