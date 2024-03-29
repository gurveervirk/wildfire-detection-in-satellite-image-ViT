import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg  bg-black">
      <div className="container-fluid">
        <Link className="navbar-brand active text-white" to="/">
        <i class="mx-2 bi bi-fire"></i>Prometheans
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
          aria-controls="navbarScroll"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul
            className="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll mx-2"
            style={{ '--bs-scroll-height': '100px' }}
          >
            <li className="nav-item">
              <Link className="nav-link text-white" to="/image"><i class="mx-2 bi bi-cloud-arrow-up"></i>
                Upload Image
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white " to="/map"><i class="mx-2 bi bi-map"></i>
                Maps
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white " to="/region"><i class="mx-2 bi bi-globe"></i>
                Monitor Region
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
