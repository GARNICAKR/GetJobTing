import React from 'react'
import { NavLink } from 'react-router-dom'
import '../styles/components.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons'
import img from '../public/logotipo.png';

function Navbar({user=false, register=false, login=false, home=false}) {
  return (
    <>
    <div className='Navbar'>
      <a href="http://127.0.0.1:5173/">
        <div className='inicio'>
            <img className='img' src={img}/>
            <label>GetJobTing</label>
        </div>
      </a>
      <div className='content'>
        <ul>
            <li className={home ? '' : 'none'}>
                <NavLink className={({isActive}) => (isActive ? 'active text' : 'text')} to='/'>Home</NavLink>
            </li>
            <li className={login ? '' : 'none'}>
                <NavLink className={({isActive}) => (isActive ? 'active text' : 'text')} to='/login'>Login</NavLink>
            </li>
            <li className={register ? '' : 'none'}>
                <NavLink className={({isActive}) => (isActive ? 'active text' : 'text')} to='/Register'>Register</NavLink>
            </li>
        </ul>
      </div>
      <div className={(user ? 'sesion' : 'none sesion') }>
        <span>Miguel13</span>
        <div className='circle'>
          <FontAwesomeIcon className='icono' icon={faUser} />
        </div>
      </div>
    </div>
    </>
  )
}

export default Navbar