import GestorRevisionSismos from '../backend/src/controllers/GestorRevisionSismos';

export default class PantRegResRevManual {
    private gestor: GestorRevisionSismos;
    private eventos: any[] = [];

    constructor() {
        this.gestor = new GestorRevisionSismos();
        this.cargarEventos();
    }

    private async cargarEventos() {
        try {
            this.eventos = await this.gestor.obtenerEventosSismicosAutodetectados();
        } catch (error) {
            console.error('Error al cargar eventos:', error);
        }
    }

    private generarListaEventos(): string {
        if (this.eventos.length === 0) {
            return '<div class="no-eventos">No hay eventos sismicos autodetectados</div>';
        }

        return this.eventos.map(evento => `
            <div class="evento-item">
                <div class="evento-info">
                    <div class="info-item">
                        <div class="info-label">ID del Evento</div>
                        <div class="info-value">${evento.id}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Fecha y Hora</div>
                        <div class="info-value">${new Date(evento.fechaHoraOcurrencia).toLocaleString()}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Magnitud</div>
                        <div class="info-value">${evento.valorMagnitud}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Ubicacion</div>
                        <div class="info-value">${evento.latitudEpicentro}, ${evento.longitudEpicentro}</div>
                    </div>
                </div>
                <button class="btn-seleccionar" onclick="seleccionarEvento('${evento.id}')">Seleccionar Evento</button>
            </div>
        `).join('');
    }

    render(): string {
        return `
        <style>
            .container { max-width: 1200px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 2.5em; }
            .section { background: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); padding: 25px; margin-bottom: 20px; }
            .section h2 { color: #333; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
            .evento-item { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 15px; transition: transform 0.2s; }
            .evento-item:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
            .evento-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 15px; }
            .info-item { background: white; padding: 10px; border-radius: 5px; border-left: 4px solid #667eea; }
            .info-label { font-weight: bold; color: #495057; font-size: 0.9em; }
            .info-value { color: #212529; font-size: 1.1em; }
            .btn-seleccionar { background: #28a745; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; font-size: 1em; transition: background 0.3s; }
            .btn-seleccionar:hover { background: #218838; }
            .no-eventos { text-align: center; color: #6c757d; font-style: italic; padding: 40px; }
        </style>
        <div class="container">
            <div class="header">
                <h1>Actividad Sismica Detectada</h1>
            </div>
            <div class="section">
                <h2>Lista de Sismos Detectados</h2>
                <div id="lista-eventos">
                    ${this.generarListaEventos()}
                </div>
            </div>
        </div>
        `;
    }
}