import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Navbar from '../components/Navbar';
import { useState } from 'react';
import img from '../public/logo_transparente.png';

function RegisterEmploye() {
    const [boton,setBoton] = useState(false);
  return (
    <>
    <Navbar registrate={true}/>
    <div id='RegisterEmploye'>
        <div className='blurfoto'>
            <img src={img} />
        </div>
        <strong>Registrate como empledo</strong>
    <Formik initialValues={{
        name: '',
        lastname: '',
        phone_number: '',
        CV: '',
        state: '',
        city:'',
        country: '',
        type_user: 'employee',
        mail: '',
        password: '',
    }}

    validate={(data)=>{
        let errores={};
        if(!data.name){
            errores.name = 'Ingrese el nombre'
        }else if(!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(data.name)){
            errores.name = 'Nombre no valido'
        }

        if(!data.lastname){
            errores.lastname = 'Ingrese el apellido'
        }else if(!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(data.lastname)){
            errores.lastname = 'Apellido no valido'
        }

        if(!data.phone_number){
            errores.phone_number = 'Ingrese el numero telefonico'
        }else if(!/^[0-9]{8,14}$/.test(data.phone_number)){
            errores.phone_number = 'Numero no valido'
        }

        if(!data.mail){
            errores.mail = 'Ingrese el correo'
        }else if(!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(data.mail)){
            errores.mail = 'Correo no valido'
        }

        if(!data.password){
            errores.password = 'Ingrese el contraseña'
        }

        if(!data.city){
            errores.city = 'Ingrese su ciudad'
        }

        if(!data.state){
            errores.state = 'Ingrese su estado'
        }

        if(!data.country){
            errores.country = 'Ingrese su pais'
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
                    <label htmlFor="nombre">Nombre</label>
                    <Field 
                    className='form-control'
                    type="text" 
                    id='name' 
                    name='name' 
                    placeholder='nombre' 
                    />
                    <ErrorMessage name='name' component={()=>(<div className='error'>{errors.name}</div>)}/>
                </div>

                <div>
                <label htmlFor="lastname">Apellido</label>
                <Field 
                    className='form-control'
                    type="text" 
                    id='lastname' 
                    name='lastname' 
                    placeholder='apellido' 
                />
                <ErrorMessage name='lastname' component={()=>(<div className='error'>{errors.lastname}</div>)}/>
                </div>

                <div>
                    <label htmlFor="phone_number">Telefono</label>
                    <Field 
                    className='form-control'
                    type="text" 
                    id='phone_number' 
                    name='phone_number' 
                    placeholder='1234567890' 
                    />
                    <ErrorMessage name='phone_number' component={()=>(<div className='error'>{errors.phone_number}</div>)}/>
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
                    <label htmlFor="CV">CV opcional</label>
                    <Field
                    className='form-control'
                    type="file" 
                    id='CV' 
                    name='CV' 
                    />
                </div>

                <div className='location'>
                    <div>
                        <label htmlFor="country"></label>
                        <Field 
                        className='form-control'
                        type="text" 
                        id='country' 
                        name='country' 
                        placeholder='Pais' 
                        />
                        <ErrorMessage name='country' component={()=>(<div className='error'>{errors.country}</div>)}/>
                    </div>
                    <div>
                        <label htmlFor="state"></label>
                        <Field 
                        className='form-control'
                        type="text" 
                        id='state' 
                        name='state' 
                        placeholder='Estado' 
                        />
                        <ErrorMessage name='state' component={()=>(<div className='error '>{errors.state}</div>)}/>
                    </div>
                    <div>
                        <label htmlFor="city"></label>
                        <Field 
                        className='form-control'
                        type="text" 
                        id='city' 
                        name='city' 
                        placeholder='Ciudad' 
                        />
                        <ErrorMessage name='city' component={()=>(<div className='error'>{errors.city}</div>)}/>
                    </div>
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

export default RegisterEmploye