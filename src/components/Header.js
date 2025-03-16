import React from 'react'
import { Gear, Star, List, ShoppingCart } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
      <nav>
        <ul style={{ listStyleType: 'none', display: 'flex', justifyContent: 'space-around' }}>
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/setup" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'black' }}>
              <Gear size={24} style={{ marginRight: '5px' }} />
              Setup
            </Link>
          </li>
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/recommended" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'black' }}>
              <Star size={24} style={{ marginRight: '5px' }} />
              Recommended
            </Link>
          </li>
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/current" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'black' }}>
              <List size={24} style={{ marginRight: '5px' }} />
              Current
            </Link>
          </li>
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/shopping-list" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'black' }}>
              <ShoppingCart size={24} style={{ marginRight: '5px' }} />
              Shopping list
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
