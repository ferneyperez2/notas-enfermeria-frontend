import React, { useEffect, useState } from "react";
import axios from "axios";

// Esta es la URL de tu backend en Render
const API = "https://notas-enfermeria-inm6.onrender.com/api/notas";

export default function NotasEnfermeria() {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    enfermera: "",
    titulo: "",
    paciente: "",
    nota: ""
  });

  // Cargar notas al iniciar
  useEffect(() => {
    cargarNotas();
  }, []);

  const cargarNotas = async () => {
    try {
      const res = await axios.get(API);
      setNotas(res.data);
    } catch (err) {
      console.error("❌ Error cargando notas:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(API, form);
      // Limpiar formulario
      setForm({ enfermera: "", titulo: "", paciente: "", nota: "" });
      // Recargar la lista para ver la nueva nota
      await cargarNotas();
      alert("✅ Nota guardada correctamente en la nube");
    } catch (err) {
      console.error("❌ Error guardando nota:", err);
      alert("Error al conectar con el servidor. Revisa los logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#2c3e50', textAlign: 'center' }}>🩺 Sistema de Notas de Enfermería</h2>

      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
        <h3>Nueva Entrada</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            placeholder="Nombre de la enfermera"
            value={form.enfermera}
            onChange={(e) => setForm({ ...form, enfermera: e.target.value })}
            required
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
          <input
            type="text"
            placeholder="Título de la nota (ej: Control de signos)"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            required
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
          <input
            type="text"
            placeholder="Nombre del paciente (opcional)"
            value={form.paciente}
            onChange={(e) => setForm({ ...form, paciente: e.target.value })}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
          <textarea
            placeholder="Descripción detallada de la nota..."
            value={form.nota}
            onChange={(e) => setForm({ ...form, nota: e.target.value })}
            required
            rows="4"
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '12px', 
              backgroundColor: loading ? '#95a5a6' : '#27ae60', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? "Guardando..." : "🚀 Guardar Nota"}
          </button>
        </form>
      </div>

      <hr />

      <h3>📋 Historial de Notas (Nube)</h3>
      <div className="notas-lista">
        {notas.length === 0 ? (
          <p>No hay notas registradas aún.</p>
        ) : (
          notas.map((n) => (
            <div key={n.id} style={{ 
              borderLeft: '5px solid #3498db', 
              backgroundColor: '#fff', 
              padding: '15px', 
              marginBottom: '15px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              borderRadius: '0 5px 5px 0'
            }}>
              <p style={{ margin: '0 0 5px 0' }}>
                <span style={{ fontWeight: 'bold', color: '#34495e' }}>{n.enfermera}</span> 
                <span style={{ margin: '0 10px', color: '#bdc3c7' }}>|</span>
                <span style={{ fontStyle: 'italic', color: '#2980b9' }}>{n.titulo}</span>
              </p>
              {n.paciente && <p style={{ fontSize: '0.9em', color: '#7f8c8d' }}><strong>Paciente:</strong> {n.paciente}</p>}
              <p style={{ marginTop: '10px', color: '#2c3e50' }}>{n.nota}</p>
              <div style={{ textAlign: 'right' }}>
                <small style={{ color: '#95a5a6' }}>{new Date(n.fecha).toLocaleString()}</small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}