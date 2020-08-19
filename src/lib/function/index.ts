export const headerToggleHandler = () => {
  ($('#navbarCollapse') as any).collapse('toggle');
};

export const isGoogleImage = (image: string) => {
  return image.indexOf(':') !== -1 ? true : false;
};
