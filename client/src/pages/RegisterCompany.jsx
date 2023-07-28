import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Navbar from '../components/Navbar';
import { useState } from 'react';
import img from '../public/logo_transparente.png';

function RegisterCompany() {
    const [boton,setBoton] = useState(false);
  return (
    <>
    <Navbar registrate={true}/>
    <div id='RegisterEmploye'>
        <div className='blurfoto'>
            <img src={img} />
        </div>
        <strong>Registrata tu Empresa</strong>
    <Formik initialValues={{
        nameCompany: '',
        description: '',
        rfc: '',
        logo: '',
        type_user: 'company',
        mail: '',
        password: '',
    }}

    validate={(data)=>{
        let errores={};
        if(!data.nameCompany){
            errores.nameCompany = 'Ingrese el nombre'
        }else if(!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(data.nameCompany)){
            errores.nameCompany = 'Nombre no valido'
        }

        if(!data.description){
            errores.description = 'Ingrese una descripcion'
        }else if(data.description.length>50){
            errores.description = 'Descripcion muy larga'
        }

        if(!data.mail){
            errores.mail = 'Ingrese el correo'
        }else if(!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(data.mail)){
            errores.mail = 'Correo no valido'
        }

        if(!data.password){
            errores.password = 'Ingrese el contraseña'
        }

        if(!data.rfc){
            errores.rfc = 'Ingrese su RFC'
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
                <div>
                    <label htmlFor="nameCompany">Nombre de Empresa</label>
                    <Field 
                    className='form-control'
                    type="text" 
                    id='nameCompany' 
                    name='nameCompany' 
                    placeholder='Empresa' 
                    />
                    <ErrorMessage name='nameCompany' component={()=>(<div className='error'>{errors.nameCompany}</div>)}/>
                </div>

                <div>
                <label htmlFor="description">Descripción</label>
                    <Field 
                    className='form-control'
                     id='description' 
                     name='description' 
                     as='textarea'
                     rows="3">
                    </Field>
                    <ErrorMessage name='description' component={()=>(<div className='error'>{errors.description}</div>)}/>
                </div>

                <div>
                <label htmlFor="rfc">RFC</label>
                <Field 
                    className='form-control'
                    type="text" 
                    id='rfc' 
                    name='rfc' 
                    placeholder='Tu RFC' 
                />
                <ErrorMessage name='rfc' component={()=>(<div className='error'>{errors.rfc}</div>)}/>
                </div>

                <div>
                    <label htmlFor="mail">Correo</label>
                    <Field 
                    className='form-control'
                    type="email" 
                    id='mail' 
                    name='mail' 
                    placeholder='correo@correo.com' 
                    />
                    <ErrorMessage name='mail' component={()=>(<div className='error'>{errors.mail}</div>)}/>
                </div>

                <div>
                    <label htmlFor="password">Contraseña</label>
                    <Field 
                    className='form-control'
                    type="password" 
                    id='password' 
                    name='password' 
                    placeholder='contraseña' 
                    />
                    <ErrorMessage name='password' component={()=>(<div className='error'>{errors.password}</div>)}/>
                </div>

                <div>
                    <label htmlFor="logo">Ingresa tu logo</label>
                    <Field
                    className='form-control'
                    type="file" 
                    id='logo' 
                    name='logo' 
                    />
                </div>

                <div className='btn-center'>
                    <button className={boton ? 'btn btn-primary active' : 'btn btn-primary'} type='submit'>Entrar</button>
                </div>
            </Form>
        )}
    </Formik>
    </div>
    </>
  )
}

export default RegisterCompany