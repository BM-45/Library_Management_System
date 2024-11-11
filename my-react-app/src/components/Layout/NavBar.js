import React, { useState, useEffect } from 'react';
import ScrolledHeader from './ScrolledHeader';
import Header from './Header';

function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    
    <div className={`header ${isScrolled ? 'scrolled' : ''}`}>
      { isScrolled ? <ScrolledHeader/> :  <Header/> }
    </div>
    
  );
}

export default NavBar;