import { clamp } from 'es-toolkit';

const screenManager = () => {
  const el = {
    current: null,
  };

  const observer = new ResizeObserver((entries) => {
    for (let entry of entries) {
      if (entry.target === el.current) {
        measureScreen();
      }
    }
  });

  const state = {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  };

  const measureScreen = () => {
    const { width, height, left, top } = el.current.getBoundingClientRect();

    state.width = width;
    state.height = height;
    state.left = left;
    state.top = top;
  };

  const initialize = (_el) => {
    el.current = _el;

    observer.observe(el.current);
  };

  const destroy = () => {
    observer.unobserve(el.current);
    observer.disconnect();
  };

  // Convert a relative coordinate into position on the screen accounting for viewport
  const calculateScreenCoords = ({ x, y } = { x: 0.5, y: 0.5 }) => {
    const { width, height } = state;

    return {
      x: (x - 0.5) * width + 0.5 * width,
      y: (y - 0.5) * height + 0.5 * height,
    };
  };

  // Given a position on the screen calculate the relative coordinate for the viewport
  const calculateRelativeCoords = ({ x, y, ...rest } = { x: 0, y: 0 }) => {
    const { width, height, left: viewportX, top: viewportY } = state;

    const hasDelta = rest.dy && rest.dx;
    const delta = hasDelta ? { dy: rest.dy / height, dx: rest.dx / width } : {};

    return {
      x: clamp((x - viewportX) / width, 0, 1),
      y: clamp((y - viewportY) / height, 0, 1),
      ...delta,
    };
  };

  const get = () => state;

  return {
    initialize,
    destroy,
    measureScreen,
    get,
    calculateScreenCoords,
    calculateRelativeCoords,
  };
};

export default screenManager;
