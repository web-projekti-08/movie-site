import React, { useState } from 'react';
import './Auth.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Sähköposti vaaditaan';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Sähköposti ei toimiva';
    }

    if (!formData.password) {
      newErrors.password = 'Salasana vaaditaan';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {

      console.log('Kirjautumistiedot:', { ...formData });
      alert('Kirjautuminen onnistui');
      

      setFormData({
        email: '',
        password: ''
      });
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Kirjaudu sisään</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Sähköposti</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="nimi@esimerkki.fi"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Salasana</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Kirjoita salasanasi"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          

          <button type="submit" className="auth-button">
            Kirjaudu
          </button>
        </form>

        <div className="auth-footer">
          <p>Ei tiliä? <a href="/register">Rekisteröidy</a></p>
        </div>
      </div>
    </div>
  );
}
export default Login;