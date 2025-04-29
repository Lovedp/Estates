import React from 'react'
import Header from './Header'
import Search from './Search'
import Work from './Work'
import Hero from './Hero'
import Property from './Property'
import Customers from './Customers'
import Image from './Image'
import Agent from './Agent'
import Article from './Article'
import Subs from './Subs'
import Footer from './Footer'

const Home = () => {
    return (
      <div className='w-full overflow-hidden'>
        <Header/>
        <Search/>
        <Work/>
        <Hero/>
        <Property/>
        <Customers/>
        <Image/>
        <Agent/>
        <Article/>
        <Subs/>
        <Footer/>
        </div>
    ) 
  }

  export default Home;