import React, { useState, useEffect } from 'react';
import './Liquidaciones.scss';
import axios from "axios";
import { createLiquidacion, getFuncionarioDatosCompletos } from '../../apis/indicador';

const Liquidaciones = () => {
  const [formData, setFormData] = useState({
    rut_funcionario: '',
    nombre_empleado: '',
    fecha_liquidacion: '',
    sueldo_base: '',
    obra:'',
    gratificacion: '',
    asignacion_movilizacion: '',
    asignacion_colacion: '',
    afp: '',
    tasa_afp:'',
    salud: '',
    seguro_cesantia: '',
    impuesto: '',
    rebaja: '',
    anticipo_sueldo: '',
    otros_descuentos: '',
  });
  

  const [afps, setAfps] = useState([]);
  const [funcionario, setFuncionario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBuscar = async () => {
    if (!formData.rut_funcionario) {
      alert("Por favor, ingresa un RUT antes de buscar.");
      return;
    }
  
    try {
      setLoading(true);
      setError("");
      const data = await getFuncionarioDatosCompletos(formData.rut_funcionario);
      setFuncionario(data);
      setFormData((prev) => ({
        ...prev,
        nombre_empleado: data.funcionario.nombre,
        obra: data.funcionario.ubicacion,
        sueldo_base: data.funcionario.sueldo,
        afp: data.afp.nombre_afp,
        tasa_afp: data.afp.tasa_afp,
      }));
    } catch (err) {
      setError("No se encontraron datos para este RUT.");
    } finally {
      setLoading(false);
    }
  };

  const salud = [
    {id: '1', name: 'Fonasa', descuento: 7},
    {id: '2', name: 'Banmédica', descuento: 7},
    {id: '3', name: 'Consalud', descuento: 7},
    {id: '4', name: 'Cruz Blanca', descuento: 7},
    {id: '5', name: 'Nueva MasVida', descuento:7},
    {id: '6', name: 'Vida tres', descuento:7},
    {id: '7', name:'Esencial', descuento:7}
  ];

  // Manejo de cambios para el select de Salud
  const handleSaludChange = (e) => {
    const selectedDescuento = e.target.value; 
    setFormData({
      ...formData,
      salud: selectedDescuento, 
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, "");
    setFormData({
      ...formData,
      [name]: numericValue,
    });
  };

  const formatCurrency = (number) => {
    if (!number) return "";
    const roundedNumber = Math.floor(number);
    return `$${roundedNumber.toLocaleString("es-CL")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.rut_funcionario) {
      alert("Por favor, ingresa un RUT antes de enviar el formulario.");
      return;
    }
  
    const dataToSend = {
      ...formData,
      afp: formData.tasa_afp,
    };
  
    try {
      const result = await createLiquidacion(dataToSend); 
      console.log("Resultado recibido del backend:", result);
  
      alert("¡La liquidación se creó correctamente!");
  
      setFormData({
        rut_funcionario: "",
        nombre_empleado: "",
        fecha_liquidacion: "",
        sueldo_base: "",
        obra: "",
        gratificacion: "",
        asignacion_movilizacion: "",
        asignacion_colacion: "",
        afp: "",
        tasa_afp: "",
        salud: "",
        seguro_cesantia: "",
        impuesto: "",
        rebaja: "",
        anticipo_sueldo: "",
        otros_descuentos: "",
      });
    } catch (error) {
      console.error("Error al enviar los datos:", error);
  
      alert("Hubo un error al crear la liquidación. Por favor, intenta de nuevo.");
    }
  };
  

  return (
    <div className="form-wrapperLI">
      <div className="form-containerLi">
        <h2 className="form-titleLI">Liquidación de Sueldo</h2>
        <form className="liquidacion-form" onSubmit={handleSubmit}>
          {/* RUT, Nombre y Fecha */}
          <div className="form-rowLI">
          <div className="form-groupLI">
          <div className="form-groupLI">
          <label className="form-labelLI">RUT</label>
          <input
            className="form-inputLI"
            type="text"
            name="rut_funcionario"
            value={formData.rut_funcionario} // Enlazado al estado
            onChange={handleChange} // Actualiza el estado al escribir
            placeholder="Ej: 11111111-1"
            required
          />
          <button type="button" onClick={handleBuscar} className="btn-buscar">
            Buscar
          </button>
        </div>
        </div>
        <div className="form-groupLI">
          <label className="form-labelLI">Nombre</label>
          <input
            className="form-inputLI"
            type="text"
            name="nombre_empleado" // Coincide con el estado
            value={formData.nombre_empleado} // Enlazado al estado
            onChange={handleChange} // Permite modificar manualmente (opcional)
            placeholder="Ingrese nombre"
            required
          />
        </div>
          <div className="form-groupLI">
            <label className="form-labelLI">Sucursal</label>
            <input
              className="form-inputLI"
              type="text"
              name="obra" // Coincide con el estado
              value={formData.obra} // Enlazado al estado
              onChange={handleChange} // Permite modificar manualmente (opcional)
              placeholder="Ingrese sucursal"
              required
            />
          </div>
          </div>
          <div className="form-rowLI">
            <div className="form-groupLI">
              <label className="form-labelLI">Fecha de liquidación</label>
              <input
                className="form-inputLI"
                type="date"
                name="fecha_liquidacion"
                value={formData.fecha}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Sueldo Base y Gratificación */}
          <div className="form-rowLI">
            <div className="form-groupLI">
              <label className="form-labelLI">Sueldo Base</label>
              <input
                className="form-inputLI"
                type="text"
                name="sueldo_base"
                value={formatCurrency(formData.sueldo_base)}
                onChange={handleInputChange}
                placeholder="Ingrese sueldo base"
                required
              />
            </div>
             <div className="form-groupLI">
              <label className="form-labelLI">Gratificación</label>
              <input
                className="form-inputLI"
                type="text"
                name="gratificacion"
                value={formatCurrency(formData.gratificacion)}
                onChange={handleInputChange}
                placeholder="Ingrese gratificación"
                required
              />
            </div> 
          </div>

          {/* Movilización y Colación */}
          <div className="form-rowLI">
            <div className="form-groupLI">
              <label className="form-labelLI">Asignación Movilización</label>
              <input
                className="form-inputLI"
                type="text"
                name="asignacion_movilizacion"
                value={formatCurrency(formData.asignacion_movilizacion)}
                onChange={handleInputChange}
                placeholder="Ingrese movilización"
                required
              />
            </div>
            <div className="form-groupLI">
              <label className="form-labelLI">Asignación Colación</label>
              <input
                className="form-inputLI"
                type="text"
                name="asignacion_colacion"
                value={formatCurrency(formData.asignacion_colacion)}
                onChange={handleInputChange}
                placeholder="Ingrese colación"
                required
              />
            </div>
          </div>

          {/* AFP y Salud */}
          <div className="form-rowLI">
          <div className="form-groupLI">
          <label className="form-labelLI">AFP Asignada</label>
          <input
            className="form-inputLI"
            type="text"
            name="afp"
            value={formData.afp} // Nombre de la AFP asignada
            placeholder="Ingrese AFP"
            readOnly // Campo solo lectura
          />
        </div>

        <div className="form-groupLI">
          <label className="form-labelLI">Tasa AFP</label>
          <input
            className="form-inputLI"
            type="text"
            name="tasa_afp"
            value={`${formData.tasa_afp}%`} // Muestra la tasa con el símbolo de porcentaje
            placeholder="Tasa de la AFP"
            readOnly // Campo solo lectura
          />
        </div>
            <div className="form-groupLI">
              <label className="form-labelLI">Salud</label>
              <select name="salud" value={formData.salud} onChange={handleSaludChange} required>
                <option value="">Seleccione una opción de Salud</option>
                {salud.map((item) => (
                  <option key={item.id} value={item.descuento}>
                    {item.name} ({item.descuento}%)
                  </option>
                ))}
             </select>
            </div>
          </div>

          {/* Seguro Cesantía, Impuesto y Rebaja Impuesto */}
          <div className="form-rowLI">
            <div className="form-groupLI">
              <label className="form-labelLI">Seguro Cesantía</label>
              <input
                className="form-inputLI"
                type="text"
                name="seguro_cesantia"
                value={formData.seguro_cesantia}
                onChange={handleChange}
                placeholder="Ingrese % seguro cesantía"
                required
              />
            </div>
            <div className="form-groupLI">
              <label className="form-labelLI">Impuesto</label>
              <input
                className="form-inputLI"
                type="text"
                name="impuesto"
                value={formatCurrency(formData.impuesto)}
                onChange={handleInputChange}
                placeholder="Ingrese impuesto"
                required
              />
            </div>
            <div className="form-groupLI">
              <label className="form-labelLI">Rebaja Impuesto</label>
              <input
                className="form-inputLI"
                type="text"
                name="rebaja"
                value={formatCurrency(formData.rebaja)}
                onChange={handleInputChange}
                placeholder="Ingrese rebaja de impuesto"
                required
              />
            </div>
          </div>

          {/* Anticipo Sueldo y Otros Descuentos */}
          <div className="form-rowLI">
            <div className="form-groupLI">
              <label className="form-labelLI">Anticipo Sueldo</label>
              <input
                className="form-inputLI"
                type="text"
                name="anticipo_sueldo"
                value={formatCurrency(formData.anticipo_sueldo)}
                onChange={handleInputChange}
                placeholder="Ingrese anticipo sueldo"
                required
              />
            </div>
            <div className="form-groupLI">
              <label className="form-labelLI">Otros Descuentos</label>
              <input
                className="form-inputLI"
                type="text"
                name="otros_descuentos"
                value={formatCurrency(formData.otros_descuentos)}
                onChange={handleInputChange}
                placeholder="Ingrese otros descuentos"
                required
              />
            </div>
          </div>

          <button type="submit" className="submitLI-btn">Enviar</button>
        </form>
      </div>
    </div>
  );

};

export default Liquidaciones;
