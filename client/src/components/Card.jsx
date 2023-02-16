import React from 'react'

function Card({logo,title,desc}) {
  return (
    <div id='card' className='card'>
        <img className='logo' src={logo} />
        <div className='textos'>
          <strong>{title}</strong>
          <p>{desc}</p>
        </div>
    </div>
  )
}

export default Card