import React from 'react'
import { useState } from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTriangleExclamation} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';

import '../styles/login.css';
import img from '../public/logo_transparente.png';


function Login() {
  const [boton,setBoton] = useState(false);
  return (
    <>
    <Navbar registrate={true} />
    <div className='login'>
      <div className='blurfoto'>
        <img src={img} />
      </div>
      <Formik initialValues={{
        contraseña: '',
        correo: ''
      }}
      validate={(datos)=>{
        let errores={};
        if (!datos.correo){
          errores.correo = 'Ingrese el correo'
        }else if(!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(datos.correo)){
          errores.correo = 'Correo no valido'
        }
        if(!datos.contraseña){
          errores.contraseña='Ingrese contraseña'
        }
        return errores;
      }}
      onSubmit={(values,{resetForm}) =>{
        console.log('Enviado')
        console.log(values)
        setBoton(true)
        setTimeout(()=> setBoton(false),500);
        resetForm();
      }}>
        {({touched, errors})=>(
          <Form className='mb-3 form'>
            <div className='input'>
              <label htmlFor="correo">Correo</label>
              <Field 
              className='form-control'
              type="mail" 
              id='correo' 
              name='correo' 
              placeholder='Ingrese correo' 
              />
                <ErrorMessage name='correo' component={()=>(<div className='alinear'><FontAwesomeIcon className='icono' icon={faTriangleExclamation} /><div className='error'>{errors.correo}</div></div>)}/>           
            </div>
            <div className='input'>
              <label htmlFor="Contraseña">Contraseña</label>
              <Field 
              className='form-control'
              type="password" 
              id='contraseña' 
              name='contraseña' 
              placeholder='Contraseña' 
              />
              <ErrorMessage name='contraseña' component={()=>(<div className='alinear'><FontAwesomeIcon className='icono' icon={faTriangleExclamation} /><div className='error'>{errors.contraseña}</div> </div>)}/>
            </div>
            <div className='btn-center'>
              <button className={boton ? 'btn btn-primary active' : 'btn btn-primary'}  type='submit'>Entrar</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
    </>
  )
}

export default Login