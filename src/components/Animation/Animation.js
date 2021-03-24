import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import './Animation.css';

import { ReactComponent as NatureScene } from '../../images/natureScene/waterfall3-01.svg';
import { ReactComponent as Circle } from '../../images/natureScene/circle.svg';
import { ReactComponent as LightBulb } from '../../images/natureScene/lightBulb.svg';
import { ReactComponent as LeftFGLeaves } from '../../images/natureScene/leftFGLeaves.svg';
import { ReactComponent as RightFGLeaves } from '../../images/natureScene/rightFGLeaves.svg';
import { ReactComponent as ShrubsFG } from '../../images/natureScene/shrubsFG.svg';
const Animation = () => {
  const [bulbState, setBulbState] = useState(false);
  const [slideOutState, setSlideOutState] = useState(true);

  let waterFallAnimation = React.useRef(
    document.getElementById('waterFallAnimation')
  );
  let circles = React.useRef(document.querySelectorAll('.circle'));
  let bulb = React.useRef(document.getElementById('bulb'));

  let colorIndexRef = React.useRef(0);
  let color = React.useRef({ rgb: { r: 255, g: 255, b: 255 } });
  let brighter = React.useRef({ rgb: { r: 0, g: 0, b: 0 } });
  if (color.current.rgb.r < 180) {
    brighter.current.rgb.r = color.current.rgb.r + 40;
  } else {
    brighter.current.rgb.r = color.current.rgb.r;
  }
  if (color.current.rgb.g < 180) {
    brighter.current.rgb.g = color.current.rgb.g + 40;
  } else {
    brighter.current.rgb.g = color.current.rgb.g;
  }
  if (color.current.rgb.b < 180) {
    brighter.current.rgb.b = color.current.rgb.b + 40;
  } else {
    brighter.current.rgb.b = color.current.rgb.b;
  }

  useEffect(() => {
    let YScroll = window.scrollY;
    let height = window.innerHeight;
    let colors = [
      { rgb: { r: 255, g: 100, b: 100 } },
      { rgb: { r: 220, g: 120, b: 100 } },
      { rgb: { r: 220, g: 220, b: 100 } },
      { rgb: { r: 120, g: 220, b: 100 } },

      { rgb: { r: 100, g: 255, b: 100 } },

      { rgb: { r: 100, g: 220, b: 120 } },
      { rgb: { r: 100, g: 220, b: 220 } },
      { rgb: { r: 100, g: 120, b: 220 } },

      { rgb: { r: 120, g: 120, b: 220 } },
      { rgb: { r: 150, g: 100, b: 220 } },
      { rgb: { r: 220, g: 100, b: 220 } },
      { rgb: { r: 220, g: 100, b: 150 } },
    ];
    function changeColor() {
      circles.current = document.querySelectorAll('.circle');
      let vents = document.querySelectorAll('.newst85');
      let logos = document.querySelectorAll('.newst84');
      let lightTint = document.querySelector('.lightTint');
      if (colorIndexRef.current >= colors.length - 1) colorIndexRef.current = 0;
      colorIndexRef.current += 1;
      color.current = colors[colorIndexRef.current];
      if (color.current.rgb.r < 180) {
        brighter.current.rgb.r = color.current.rgb.r + 40;
      } else {
        brighter.current.rgb.r = color.current.rgb.r;
      }
      if (color.current.rgb.g < 180) {
        brighter.current.rgb.g = color.current.rgb.g + 40;
      } else {
        brighter.current.rgb.g = color.current.rgb.g;
      }
      if (color.current.rgb.b < 180) {
        brighter.current.rgb.b = color.current.rgb.b + 40;
      } else {
        brighter.current.rgb.b = color.current.rgb.b;
      }
      circles.current.forEach((circle) => {
        circle.style.fill = `rgb(${brighter.current.rgb.r}, ${brighter.current.rgb.g}, ${brighter.current.rgb.b})`;
      });
      vents.forEach((vent) => {
        vent.setAttribute(
          'style',
          `fill: rgb(${color.current.rgb.r}, ${color.current.rgb.g}, ${color.current.rgb.b})`
        );
      });
      logos.forEach((logo) => {
        logo.setAttribute(
          'style',
          `stroke: rgb(${color.current.rgb.r}, ${color.current.rgb.g}, ${color.current.rgb.b})`
        );
      });
      lightTint.setAttribute(
        'style',
        `background-color: rgb(${color.current.rgb.r}, ${color.current.rgb.g}, ${color.current.rgb.b})`
      );
    }

    const showHideBulb = () => {
      setBulbState(!bulbState);
    };
    const bulbTimeout = setTimeout(showHideBulb, 10000);

    bulb.current = document.getElementById('bulb');
    circles.current = document.querySelectorAll('.circle');
    let sunmoon = document.getElementById('circle');
    sunmoon.style.transform = `translateY(${(YScroll * -250) / height}px)`;
    circles.current.forEach((circle) =>
      circle.addEventListener('click', changeColor)
    );
    const moveCircle = (e) => {
      if (bulb.current) {
        bulb.current.style.transform = `translateY(${
          (YScroll * -250) / height
        }px)`;
      }
      sunmoon.style.transform = `translateY(${(YScroll * -250) / height}px)`;
    };

    waterFallAnimation.current = document.getElementById('waterFallAnimation');
    const moveNatureScene = () => {
      waterFallAnimation.current.style.top = YScroll * -0.1;
    };

    let move = () => {
      YScroll = window.scrollY;
      moveCircle();
      moveNatureScene();
    };

    document.addEventListener('scroll', move);

    let timeout = setTimeout(function () {
      setSlideOutState(false);
    }, 2000);

    return function cleanup() {
      clearTimeout(timeout);
      clearTimeout(bulbTimeout);
      document.removeEventListener('scroll', move);
      circles.current.forEach((circle) =>
        circle.removeEventListener('click', changeColor)
      );
    };
  }, [bulbState]);

  return (
    <div className='natureScene'>
      <Circle />
      <NatureScene />
      <CSSTransition
        in={bulbState}
        timeout={5000}
        onEnter={function () {
          circles.current = document.querySelectorAll('.circle');
          bulb.current = document.getElementById('bulb');
          let YScroll = window.scrollY;
          let height = window.innerHeight;

          circles.current.forEach((circle) => {
            circle.style.fill = `rgb(${brighter.current.rgb.r}, ${brighter.current.rgb.g}, ${brighter.current.rgb.b})`;
          });
          bulb.current.style.transform = `translateY(${
            (YScroll * -250) / height
          }px)`;
        }}
        classNames='fade-in'
        mountOnEnter
        unmountOnExit
      >
        <LightBulb />
      </CSSTransition>

      <CSSTransition
        in={slideOutState}
        mountOnEnter
        unmountOnExit
        timeout={{ enter: 1000, exit: 7000 }}
        classNames='slideoutright'
      >
        <RightFGLeaves />
      </CSSTransition>

      <CSSTransition
        in={slideOutState}
        mountOnEnter
        unmountOnExit
        timeout={{ enter: 1000, exit: 7000 }}
        classNames='slideoutleft'
      >
        <LeftFGLeaves />
      </CSSTransition>

      <CSSTransition
        in={slideOutState}
        mountOnEnter
        unmountOnExit
        timeout={{ enter: 1000, exit: 7000 }}
        classNames='zoomInFadeOut'
      >
        <ShrubsFG />
      </CSSTransition>
      <div className='bottomFiller'></div>
    </div>
  );
};

export default Animation;
