import React from 'react'
import {Formik, Form, Field, ErrorMessage} from 'formik'
import { NavLink } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/register.css'
import { useState } from 'react'
function Register() {

  const [active, setIsActive] = useState(false);

  return (
    <>
    <Navbar user={false} register={true} login={true}/>
    <div className='Register'>
      <ul>
        <li>
            <NavLink className={({isActive}) => (isActive ? 'active text' : 'text')}>Empleado</NavLink>
        </li>
        <li>
            <NavLink className={({isActive}) => (isActive ? 'text' : 'text active')}>Empresa</NavLink>
        </li>
      </ul>
      <Formik>
        <Form>
        </Form>
      </Formik>
    </div>
    </>
  )
}

export default Register