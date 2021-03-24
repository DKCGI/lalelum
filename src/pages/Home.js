import React from 'react';
import './Home.css';
import Animation from '../components/Animation/Animation';
import Anions from '../components/Animation/Anions';
const Home = (props) => {
  return (
    <main id='home'>
      <Animation></Animation>
      <Anions />
      <div className='tint'></div>
      <div className='lightTint'></div>
      <h1 id='learnmore'>
        <a href='#section2'>Learn more</a>
      </h1>
      <section id='section2'>
        <div className='features'>
          <img
            alt='treeline'
            className='borderImage'
            src='../images/treeline.png'
          />
          <a href='/#' className='anchor' id='section2'>
            anchor
          </a>
          <h1>Check it out Mayn</h1>
        </div>
      </section>
    </main>
  );
};

export default Home;
