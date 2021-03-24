// let YScroll = 0;
// let circles = [];
// let circle = document.querySelector('.circle');
// circles.push(circle);

// function changeColor() {
//   let vents = document.querySelectorAll('.newst85');
//   let logos = document.querySelectorAll('.newst84');
//   let lightTint = document.querySelector('.lightTint');
//   let colors = [
//     { rgb: { r: 255, g: 50, b: 50 } },
//     { rgb: { r: 50, g: 255, b: 50 } },
//     { rgb: { r: 50, g: 50, b: 255 } },
//     { rgb: { r: 255, g: 255, b: 50 } },
//     { rgb: { r: 255, g: 50, b: 150 } },
//     { rgb: { r: 150, g: 50, b: 255 } },
//     { rgb: { r: 255, g: 150, b: 50 } },
//   ];
//   let color = colors[Math.floor(Math.random() * colors.length) - 1];
//   let brighter = { rgb: { r: 0, g: 0, b: 0 } };
//   if (color.rgb.r < 180) {
//     brighter.rgb.r = color.rgb.r + 50;
//   }
//   if (color.rgb.g < 180) {
//     brighter.rgb.g = color.rgb.g + 50;
//   }
//   if (color.rgb.b < 180) {
//     brighter.rgb.b = color.rgb.b + 50;
//   }
//   circles.forEach((circle) => {
//     circle.style.fill = `rgb(${brighter.rgb.r}, ${brighter.rgb.g}, ${brighter.rgb.b})`;
//   });
//   vents.forEach((vent) => {
//     vent.setAttribute(
//       'style',
//       `fill: rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
//     );
//   });
//   logos.forEach((logo) => {
//     logo.setAttribute(
//       'style',
//       `stroke: rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
//     );
//   });
//   lightTint.setAttribute(
//     'style',
//     `background-color: rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
//   );
//   console.log(color);
// }
// circle.addEventListener('click', changeColor);

// document.addEventListener('scroll', (e) => {
//   YScroll = window.scrollY;
//   circle.style.transform = `translateY(${YScroll / -10}px)`;
// });
