import React from 'react'
import { NavLink, Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faRightToBracket, faBuilding, faBriefcase} from '@fortawesome/free-solid-svg-icons'
import img from '../public/logotipo.png';
import '../styles/components.css';

function Navbar({ user = false, home = false, registrate=false}) {
  return (
    <>
      <div className='Navbar'>
        <Link to="/">
          <div className='inicio'>
            <img className='img' src={img} />
            <label>GetJobTing</label>
          </div>
        </Link>
        <div className='content'>
          <ul>
            <li className={home ? '' : 'none'}>
              <NavLink className={({ isActive }) => (isActive ? 'active text' : 'text')} to='/'>Home</NavLink>
            </li>
          </ul>
        </div>
        <div className={(user ? 'sesion' : 'none sesion')}>
          <span>Miguel13</span>
          <div className='circle'>
            <FontAwesomeIcon className='icono' icon={faUser} />
          </div>
        </div>
        <div className={(registrate ? 'registrate' : 'none registrate')}>
          
          <div className='empleado'>
              <Link to='/resgitarEmpleado'>
              <FontAwesomeIcon className='icono' icon={faBriefcase}/>
                <label>Empleado</label>
              </Link>
          </div>
          <div className='empleado'>
          <Link to='/resgitarEmpresa'>
          <FontAwesomeIcon className='icono' icon={faBuilding}/>
                <label>Empresa</label>
              </Link>
          </div>
          <div className='empleado'>
              <Link  to='/login'>
                <FontAwesomeIcon className='icono' icon={faRightToBracket}/>
                <label>Ingresar</label>
              </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar