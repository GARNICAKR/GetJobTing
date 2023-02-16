import React from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card';
import {Carousel} from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import '../styles/home.css'
import image1 from '../public/eye.jpg'
import image2 from '../public/estelar.jpg'
import image3 from '../public/car.jpg'
import consejos from '../public/CONSEJOS.png'
import logoCoca from '../public/coca.png'
import logoIntel from '../public/intel.png'
import logoIbm from '../public/ibm.jpg'
function Home() {
  return (
    <>
      <Navbar registrate={true}/>
      <div id='Home'>
        <div className='busqueda'>
          <h1>Encuentra tu mejor experiencia laboral</h1>
            <div className='search'>
                <input type="text" />
                <button><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
            </div>
        </div>
        <Carousel className='carousel'>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={image2}
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>First</h3>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100"
              src={image1}
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>Seciond</h3>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100"
              src={image3}
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>Third</h3>
            </Carousel.Caption>
          </Carousel.Item>

        </Carousel>
        <div className='info'>
          <div className='recomendaciones'>

          </div>
          <div className='empresas'>
          <div className='cards'>
            <Card 
              title={'Coca Cola'} 
              desc={'Lorem ipsum dolor sit amet consectetur, adipisicing.'}
              logo={logoCoca}>
            </Card>
            <Card 
              title={'Intel'} 
              desc={'Lorem ipsum dolor sit amet consectetur, adipisicing.'}
              logo={logoIntel}>
            </Card>
            <Card 
              title={'IBM'} 
              desc={'Lorem ipsum dolor sit amet consectetur, adipisicing.'}
              logo={logoIbm}>
            </Card>
        </div>
          </div>
          <div id='consejos'>
              <div className='descripcion'>
                <strong>¡Este es el mejor lugar para buscar empleo como estudiante!</strong>
                <small>Por que buscar aqui:</small>
              </div>
              <div className='next'>
                <div className='consejos'>
                  <strong>Te ayudamos a conseguir tu primer empleo</strong>
                  <small><FontAwesomeIcon className='icon' icon={faCheck}/>Registro gratuito</small>
                  <small><FontAwesomeIcon className='icon' icon={faCheck}/>Plataforma hecha para estudiantes</small>
                  <small><FontAwesomeIcon className='icon' icon={faCheck}/>Perfil propio</small>
                  <small><FontAwesomeIcon className='icon' icon={faCheck}/>Variedad de empresas</small>
                </div>
                <div className='blurfoto'>
                  <img src={consejos} />
                </div>
                <div className='fondo'></div>
              </div>
          </div>
          {/* <div className='blurfoto'>
            <img src={img} />
          </div> */}
        </div>
      </div>
    </>
  )
}

export default Home