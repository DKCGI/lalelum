import React from 'react';
import '../Support.css';
import Faqs from '../../components/Admin/Faqs';
import Policies from '../../components/Admin/Policies';
import About from './About';

const UpdateSite = () => {
  return (
    <main id='support-section'>
      <div className='support-nav'>
        <ul>
          <li>
            <a href='#faqs'>FAQ</a>
          </li>
          <li>
            <a href='#policies'>Policies</a>
          </li>
          <li>
            <a href='#about'>About</a>
          </li>
        </ul>
      </div>
      <div className='support-content'>
        <div id='faq-section'>
          <a href='/#' className='anchor' id='faqs'>
            anchor
          </a>
          <h2>FAQ</h2>
          <Faqs />
        </div>
        <div id='policy-section'>
          <a href='/#' className='anchor' id='policies'>
            anchor
          </a>
          <h2>Policies</h2>
          <Policies />
        </div>
        <div id='about-section'>
          <a href='/#' className='anchor' id='about'>
            anchor
          </a>
          <h2>About</h2>
          <About />
        </div>
      </div>
    </main>
  );
};

export default UpdateSite;
