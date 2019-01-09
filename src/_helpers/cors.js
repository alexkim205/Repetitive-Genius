export const corsHelper = function(baseUrl) {
  var temp = baseUrl;
  if (process.env.NODE_ENV === 'development') {
    temp = `https://cors-anywhere.herokuapp.com/${baseUrl}`;
  }
  return temp;
};
