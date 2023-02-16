import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Navbar from '../components/Navbar';
import { useState } from 'react';
import img from '../public/logo_transparente.png';

function RegisterJobs() {
    const [boton,setBoton] = useState(false);
  return (
    <>
    <Navbar registrate={true}/>
    <div id='RegisterEmploye'>
        <div className='blurfoto'>
            <img src={img} />
        </div>
        <strong>Agrega una vacante</strong>
    <Formik initialValues={{
        title: '',
        about_job: '',
        pay: '',
    }}

    validate={(data)=>{
        let errores={};
        if(!data.title){
            errores.title = 'Ingrese el titulo'
        }

        if(!data.about_job){
            errores.about_job = 'Ingrese una descripcion'
        }

        if(!data.pay){
            errores.pay = 'Ingrese una catidad'
        }else if(!/^[0-9]{3,6}$/.test(data.pay)){
            errores.pay = 'Cantidad no valida'
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
                    <label htmlFor="title">Titulo</label>
                    <Field 
                    className='form-control'
                    type="text" 
                    id='title' 
                    name='title' 
                    placeholder='titulo' 
                    />
                    <ErrorMessage name='title' component={()=>(<div className='error'>{errors.title}</div>)}/>
                </div>

                <div>
                <label htmlFor="about_job">Descripción</label>
                    <Field 
                    className='form-control'
                     id='about_job' 
                     name='about_job' 
                     as='textarea'
                     rows="3">
                    </Field>
                    <ErrorMessage name='about_job' component={()=>(<div className='error'>{errors.about_job}</div>)}/>
                </div>

                <div>
                <label htmlFor="pay">Sueldo Mensual</label>
                <Field 
                    className='form-control'
                    type="text" 
                    id='pay' 
                    name='pay' 
                    placeholder='Sueldo' 
                />
                <ErrorMessage name='pay' component={()=>(<div className='error'>{errors.pay}</div>)}/>
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

export default RegisterJobs