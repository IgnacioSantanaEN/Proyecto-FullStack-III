// ─────────────────────────────────────────────────────────────
// pages/LoginPage.jsx
// Pantalla de inicio de sesión y registro.
// Props: onLogin (fn) — callback cuando el login es exitoso
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { Truck, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { cardClass, inputClass } from "../styles/theme";
import { loginUser, registerUser } from "../services/api";

export default function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  
  // Login state
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  
  // Register state
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPass, setRegisterPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validaciones
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLoginSubmit = async () => {
    setError("");
    setSuccess("");
    
    if (!email || !pass) {
      setError("Completa todos los campos.");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Email inválido. Por favor verifica el formato.");
      return;
    }
    
    if (!validatePassword(pass)) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    
    setLoading(true);
    try {
      const userData = await loginUser(email, pass);
      setEmail("");
      setPass("");
      // Guardar usuario en localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      onLogin(userData);
    } catch (err) {
      const errorMsg = err.message || "Error al iniciar sesión. Verifica tus credenciales.";
      
      // Detectar si es un error de conexión
      if (errorMsg.includes("conexión") || errorMsg.includes("no disponible") || errorMsg.includes("404")) {
        setError("El servidor no está disponible. Asegúrate de ejecutar el backend en terminal: mvn spring-boot:run desde /backend/usuario");
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async () => {
    setError("");
    setSuccess("");
    
    if (!name || !lastname || !registerEmail || !registerPass || !confirmPass) {
      setError("Completa todos los campos.");
      return;
    }
    
    if (!validateEmail(registerEmail)) {
      setError("Email inválido. Por favor verifica el formato.");
      return;
    }
    
    if (!validatePassword(registerPass)) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    
    if (registerPass !== confirmPass) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    
    setLoading(true);
    try {
      await registerUser({
        name,
        lastname,
        email: registerEmail,
        password: registerPass,
        role: "usuario"
      });
      setSuccess("¡Registro exitoso! Ya puedes iniciar sesión.");
      setName("");
      setLastname("");
      setRegisterEmail("");
      setRegisterPass("");
      setConfirmPass("");
      
      // Auto-cambiar a login después de 2 segundos
      setTimeout(() => {
        setIsRegister(false);
        setSuccess("");
      }, 2000);
    } catch (err) {
      const errorMsg = err.message || "Error al registrarse. Intenta con otro email.";
      
      // Detectar si es un error de conexión
      if (errorMsg.includes("conexión") || errorMsg.includes("no disponible") || errorMsg.includes("404")) {
        setError("El servidor no está disponible. Asegúrate de ejecutar el backend en terminal: mvn spring-boot:run desde /backend/usuario");
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-slate-950 flex items-center justify-center p-4"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.08) 0%, transparent 60%)," +
          "radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.06) 0%, transparent 60%)",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center
                            shadow-lg shadow-blue-600/40">
              <Truck size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              SmartLogix
            </span>
          </div>
          <p className="text-slate-500 text-sm">Plataforma de gestión logística</p>
        </div>

        {/* Formulario */}
        <div className={`${cardClass} p-6 space-y-4`}>
          {/* Header con tabs */}
          <div className="flex gap-2 mb-6 bg-slate-800/50 p-1 rounded-lg">
            <button
              onClick={() => {
                setIsRegister(false);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2 px-3 rounded-md font-medium transition-all ${
                !isRegister
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => {
                setIsRegister(true);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2 px-3 rounded-md font-medium transition-all ${
                isRegister
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Registrarse
            </button>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              {isRegister ? "Crear cuenta" : "Iniciar sesión"}
            </h2>
            <p className="text-slate-500 text-sm">
              {isRegister ? "Únete a SmartLogix hoy" : "Bienvenido de vuelta"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400
                            text-sm px-3 py-2 rounded-xl flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400
                            text-sm px-3 py-2 rounded-xl flex items-start gap-2">
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Formulario de Login */}
          {!isRegister && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@empresa.cl"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                  onKeyDown={(e) => e.key === "Enter" && handleLoginSubmit()}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* Formulario de Registro */}
          {isRegister && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Juan"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    placeholder="Pérez"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="usuario@empresa.cl"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={registerPass}
                  onChange={(e) => setRegisterPass(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className={inputClass}
                />
                {registerPass && registerPass.length < 6 && (
                  <p className="text-xs text-amber-400 mt-1">
                    Mínimo 6 caracteres ({registerPass.length}/6)
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Repite la contraseña"
                  className={inputClass}
                />
                {confirmPass && registerPass !== confirmPass && (
                  <p className="text-xs text-red-400 mt-1">
                    Las contraseñas no coinciden
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Botón */}
          <button
            onClick={isRegister ? handleRegisterSubmit : handleLoginSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60
                       text-white font-semibold py-2.5 rounded-xl transition-colors
                       shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><RefreshCw size={16} className="animate-spin" /> {isRegister ? "Registrando..." : "Ingresando..."}</>
            ) : (
              isRegister ? "Crear cuenta" : "Iniciar sesión"
            )}
          </button>

          {!isRegister && (
            <p className="text-center text-xs text-slate-600">
              ¿Problemas?{" "}
              <span className="text-blue-400 cursor-pointer hover:text-blue-300">
                Contacta soporte
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
