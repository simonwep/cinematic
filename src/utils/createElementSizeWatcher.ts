export const createElementSizeWatcher = (cb: (entries: ResizeObserverEntry[]) => void) => {
  const observer = new ResizeObserver(cb);
  let watched: HTMLElement | undefined;

  const watch = (el: HTMLElement) => {
    watched && observer.unobserve(watched);
    observer.observe(el);
    watched = el;
  };

  const destroy = () => observer.disconnect();
  return { watch, destroy };
};
