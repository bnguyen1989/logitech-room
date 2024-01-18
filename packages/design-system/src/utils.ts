export const createOrGetElement = (id: string) => {
  const el = document.getElementById(id);
  if (el) return el;

  const newEl = document.createElement('div');
  newEl.setAttribute('id', id);
  newEl.style.position = 'fixed';
  newEl.style.top = '0px';
  newEl.style.left = '0px';
  newEl.style.background = '#ccc';

  newEl.style.zIndex = '10';

  document.body.appendChild(newEl);
  return newEl;
};
