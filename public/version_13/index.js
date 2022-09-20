const el = document.createElement('div');
el.style.height = '100px';
el.style.width = '100px';
el.style.backgroundColor = 'red';

el.style.transform = 'translateX(200px)';
el.style.transition = 'transform 1s ease-in-out';

document.body.appendChild(el);
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    el.style.transform = 'translateX(0)';
    el.addEventListener('transitionend', () => {
      el.style.transition = '';
      el.style.transform = '';
    })
  })
});
