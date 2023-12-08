import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [headerActive, setHeaderActive] = useState(false);
  const [scrollUpBtnActive, setScrollUpBtnActive] = useState(false);

  const handleToggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleCloseMenuBtn = () => {
    handleToggleMobileMenu();
  };

  const handleScroll = () => {
    const scrollY = window.pageYOffset;
    setHeaderActive(scrollY > 5);
    setScrollUpBtnActive(scrollY > 250);
  };

  useEffect(() => {
    const menuLinks = document.querySelectorAll('.menu-links a');

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    menuLinks.forEach(link => {
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      observer.observe(targetSection);
    });

    function handleIntersection(entries) {
      entries.forEach(entry => {
        const targetId = entry.target.id;
        const correspondingLink = document.querySelector(`.menu-links a[href="#${targetId}"]`);

        if (entry.isIntersecting) {
          menuLinks.forEach(link => {
            link.classList.remove('active-navlink');
          });

          correspondingLink.classList.add('active-navlink');
        }
      });
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showMobileMenu]);

  return (
    <nav className={`navbar ${showMobileMenu ? 'show-mobile-menu' : ''}`}>
      <a className="logo" href="#">
        Dubby's<span>.</span>
      </a>
      <ul className="menu-links">
        <span id="close-menu-btn" className="material-symbols-outlined" onClick={handleCloseMenuBtn}>
          close
        </span>

        <Link to="/">
          <li>Home</li>
        </Link>
        <Link to="/About">
          <li>About</li>
        </Link>
        <Link to="/Menu">
          <li>Menu</li>
        </Link>
        <Link to="#review">
          <li>Review</li>
        </Link>
        <Link to="#contact">
          <li>Contact Us</li>
        </Link>
      </ul>
      <div className="buttons">
        <Link to="/Login">
          <a className="signin" onClick={() => showSignIn()}>
            Sign In
          </a>
        </Link>
        <Link to="/SignUp">
          <a className="signup" onClick={() => showSignUp()}>
            Sign Up
          </a>
        </Link>
      </div>
      <span id="hamburger-btn" className="material-symbols-outlined" onClick={handleToggleMobileMenu}>
        menu
      </span>
    </nav>
  );
};

export default Nav;
