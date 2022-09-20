const el = document.createElement('div');
el.style.height = '100px';
el.style.width = '100px';
el.style.backgroundColor = 'red';

document.body.appendChild(el);

el.addEventListener('click', () => {
  const performRemove = () => el.parentNode.removeChild(el);
  el.style.transition = 'transform 1s ease-in-out';
  el.style.transform = 'translateX(0)';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.transform = 'translateX(200px)';
      el.addEventListener('transitionend', () => {
        el.style.transition = '';
        el.style.transform = '';
        performRemove();
      });
    });
  });
});
