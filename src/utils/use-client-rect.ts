function isWindow(val: unknown): val is Window {
  return val === window;
}

export const getRect = (elementRef: Element | Window | undefined) => {
  const element = elementRef;

  if (isWindow(element)) {
    const width = element.innerWidth;
    const height = element.innerHeight;

    return {
      top: 0,
      left: 0,
      right: width,
      bottom: height,
      width,
      height,
    };
  }

  if (element && element.getBoundingClientRect) {
    return element.getBoundingClientRect();
  }

  return {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
  };
};

export const getRectByTaro = async (element: any) => {
  if (element) {
    const res = await element.getBoundingClientRect();
    return res;
  }
  return Promise.resolve({});
};
