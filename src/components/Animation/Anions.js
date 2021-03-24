import React, { useEffect } from 'react';
import Vector from './Vector';
import './Anions.css';
const Anions = () => {
  useEffect(() => {
    const canvas = document.getElementById('anionCanvas');
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    const moveCanvas = () => {
      let YScroll = window.scrollY;
      canvas.style.transform = `translateY(${
        (YScroll * -250) / window.innerHeight
      }px) translateX(-50%)`;
    };
    resize();
    let anionCount = 200;
    class Anion {
      constructor() {
        this.r = Math.random() * 3 + 0.1;
        this.pos = new Vector(
          this.r + Math.random() * canvas.width - this.r,
          this.r + Math.random() * canvas.height - this.r
        );
        this.dirX = Math.random() > 0.5 ? 1 : -1;
        this.dirY = Math.random() > 0.5 ? 1 : -1;
        this.vel = new Vector(
          Math.random() * this.dirX,
          Math.random() * this.dirY
        );
        this.opacity = 1;
        this.color = { r: null, g: null, b: null };
        this.color.r = Math.random() * 55 + 200;
        this.color.g = Math.random() * 55 + 200;
        this.color.b = Math.random() * 55 + 200;
      }
      draw() {
        // ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        // ctx.beginPath();
        // ctx.arc(this.pos.x, this.pos.y, this.r + 4, 0, Math.PI * 2);
        // ctx.fill();

        // ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        // ctx.beginPath();
        // ctx.arc(this.pos.x, this.pos.y, this.r + 2, 0, Math.PI * 2);
        // ctx.fill();

        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }
      interact() {}
      update() {
        let offsetX = this.pos.x - canvas.width;
        let offsetY = this.pos.y - canvas.height;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.opacity =
          1 -
          Vector.getDistance(this.pos, {
            x: canvas.width / 2,
            y: canvas.height / 2,
          }) *
            0.002;

        if (offsetX >= 0) {
          this.pos.x = canvas.width - 3;
          this.vel.x *= -1;
        }
        if (this.pos.x <= 0) {
          this.pos.x = 1;
          this.vel.x *= -1;
        }

        if (offsetY >= 0) {
          this.pos.y = canvas.height - 3;
          this.vel.y *= -1;
        }
        if (this.pos.y <= 0) {
          this.pos.y = 1;
          this.vel.y *= -1;
        }

        this.draw();
      }
    }
    let anions = [];
    const createAnions = () => {
      anions = [];
      for (let i = 0; i <= anionCount; i++) {
        anions.push(new Anion());
      }
    };

    let myReq;

    const step = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      anions.forEach((anion) => {
        anion.update();
      });
      myReq = requestAnimationFrame(step);
    };
    createAnions();
    myReq = requestAnimationFrame(step);

    let resizeFunctions = () => {
      resize();
      moveCanvas();
      createAnions();
    };

    window.addEventListener('resize', resizeFunctions);
    window.addEventListener('scroll', moveCanvas);

    return function cleanup() {
      cancelAnimationFrame(myReq);
      window.removeEventListener('resize', resizeFunctions);
      window.removeEventListener('scroll', moveCanvas);
    };
  }, []);

  return <canvas id="anionCanvas"></canvas>;
};

export default Anions;
