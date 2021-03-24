import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Vector from './Vector';
import './Stars.css';
const Stars = (props) => {
  useEffect(() => {
    const canvas = document.getElementById('starCanvas');
    if (props.bgColor) {
      canvas.style.backgroundColor = props.bgColor;
    }
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    let starCount = 200;

    class Star {
      constructor() {
        this.r = Math.random() * 2 + 0.1;
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
        this.color = `rgba(${Math.random() * 55 + 200}, ${
          Math.random() * 100 + 155
        }, ${Math.random() * 100 + 155}, 0.8)`;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }
      interact() {}
      update() {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        let offsetX = this.pos.x - canvas.width;
        let offsetY = this.pos.y - canvas.height;

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
    let stars = [];
    const createStars = () => {
      stars = [];
      for (let i = 0; i <= starCount; i++) {
        stars.push(new Star());
      }
    };
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.update();
      });
      requestAnimationFrame(animate);
    };
    createStars();
    stars.forEach((star) => {
      star.draw();
    });
    animate();

    window.addEventListener('resize', () => {
      resize();
      createStars();
    });
  }, [props.bgColor]);

  return ReactDOM.createPortal(
    <canvas id='starCanvas'></canvas>,
    document.getElementById('backdrop-hook')
  );
};

export default Stars;
