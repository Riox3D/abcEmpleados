// Simulamos la base de datos de Human con un arreglo JSON
const mockHumanJSON = [
    { id: 'HUM001', nombre: 'Juan Perez Rodriguez', area: 'TI', curp: 'PERJ800101HDFRRA01' },
    { id: 'HUM002', nombre: 'Maria Lopez Garcia', area: 'Recursos Humanos', curp: 'LOGM900505MDFRRA02' },
    { id: 'HUM003', nombre: 'Martha Yessenia De La Cruz Loredo', area: 'Administracion', curp: 'DELM850707MDFRRA03' },
    { id: 'HUM004', nombre: 'Cristian Cortes Rizo', area: 'Sistemas', curp: 'CORC880714HDFRRA04' }
];

export const buscarEmpleado = async (req, res) => {
    try {
        // Obtenemos lo que el usuario escribió en la barra de búsqueda
        const { termino } = req.params; 
        const terminoMinusculas = termino.toLowerCase();
        
        // Filtramos el JSON buscando coincidencias en ID o Nombre
        const resultados = mockHumanJSON.filter(empleado => 
            empleado.id.toLowerCase().includes(terminoMinusculas) || 
            empleado.nombre.toLowerCase().includes(terminoMinusculas)
        );
        
        // Devolvemos el resultado al frontend
        res.json(resultados);
    } catch (error) {
        console.error("❌ Error en el mock de búsqueda:", error);
        res.status(500).json({ error: "Error interno al buscar empleado" });
    }
};