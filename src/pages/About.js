import React, { useEffect, useState } from 'react';
import { useHttpClient } from '../hooks/http-hook';
import AboutBlock from '../components/AboutBlock';
import ErrorModal from '../components/UIElements/ErrorModal';
import LoadingSpinner from '../components/UIElements/LoadingSpinner';
import './About.css';

const AboutSection = () => {
  const [aboutsState, setAboutsState] = useState({});
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/about`
        );
        let aboutsObject = {};
        responseData.abouts.forEach((about) => {
          let id = about.aboutId;
          aboutsObject[id] = about;
        });
        setAboutsState(aboutsObject);
      } catch (err) {}
    };
    fetchItems();
  }, [sendRequest]);

  let abouts = Object.keys(aboutsState).map((id) => {
    return <AboutBlock about={aboutsState[id]} key={id} />;
  });

  return (
    <div className='aboutsContainer'>
      {isLoading && <LoadingSpinner />}
      <ErrorModal error={error} onClear={clearError} />
      {abouts}
    </div>
  );
};

export default AboutSection;
