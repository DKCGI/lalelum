import React, { useContext, useEffect, useState } from 'react';
import { useHttpClient } from '../../hooks/http-hook';
import AboutBlock from '../../components/Admin/AboutBlock';
import ErrorModal from '../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import { AuthContext } from '../../context/auth-context';
import '../About.css';
import NewAbout from '../../components/Admin/NewAbout';

const About = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { token, isAdmin } = useContext(AuthContext);
  const [aboutsState, setAboutsState] = useState({});
  const [reset, setReset] = useState(false);

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

  // let abouts = Object.keys(aboutsState).map((id) => {
  //   return (
  //     <AboutBlock
  //       aboutsState={aboutsState}
  //       about={aboutsState[id]}
  //       setAboutsState={setAboutsState}
  //       key={id}
  //       reset={reset}
  //       setReset={setReset}
  //     />
  //   );
  // });

  let abouts = [];
  for (const about in aboutsState) {
    if (token && isAdmin) {
      abouts.push(
        <div
          key={aboutsState[about].aboutId + '_container'}
          className='about_container'
        >
          <AboutBlock
            about={about}
            aboutTitle={aboutsState[about].aboutTitle}
            aboutInfo={aboutsState[about].aboutInfo}
            aboutId={aboutsState[about].aboutId}
            key={aboutsState[about].aboutId}
            aboutsState={aboutsState}
            setAboutsState={setAboutsState}
            reset={reset}
            setReset={setReset}
          />
        </div>
      );
    } else {
      abouts.push(
        <div
          key={aboutsState[about].aboutId + '_container'}
          className='about_container'
        >
          <AboutBlock
            about={about}
            aboutTitle={aboutsState[about].aboutTitle}
            aboutInfo={aboutsState[about].aboutInfo}
            aboutId={aboutsState[about].aboutId}
            key={aboutsState[about].aboutId}
            aboutsState={aboutsState}
            reset={reset}
            setReset={setReset}
          />
        </div>
      );
    }
  }

  if (token && isAdmin) {
    return (
      <div className='aboutSection'>
        {isLoading && <LoadingSpinner />}
        <ErrorModal error={error} onClear={clearError} />
        {abouts}
        <NewAbout
          reset={reset}
          setReset={setReset}
          setAboutsState={setAboutsState}
          aboutsState={aboutsState}
        />
      </div>
    );
  } else {
    return (
      <div className='aboutsContainer'>
        {isLoading && <LoadingSpinner />}
        <ErrorModal error={error} onClear={clearError} />
        {abouts}
      </div>
    );
  }
};

export default About;
