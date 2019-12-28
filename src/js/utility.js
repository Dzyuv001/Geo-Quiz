export const setQueryString = data => {
  let currentURL = document.URL.split("?")[0];
  let queryString = "?";
  let dataKeys = Object.keys(data);
  dataKeys.forEach((key, i) => {
      console.log("test for data",key,data[key])
    queryString += `${key}=${data[key]}${
      i != dataKeys.length - 1 ? "&" : ""
    }`;
  });
  history.pushState({}, "Quiz", currentURL + queryString);
};

export const getQueryString = () => {
  let url = document.URL;
  // this is being used to support the older browsers that do not have the access to the URL object
  // adapted from https://www.sitepoint.com/get-url-parameters-with-javascript/
  let queryString = url ? url.split("?")[1] : window.location.search.slice(1);
  const obj = {};

  if (queryString) {
    queryString = queryString.split("#")[0];

    let strings = queryString.split("&");

    for (let i = 0; i < strings.length; i++) {
      let temp = strings[i].split("=");

      let paramName = temp[0];
      let paramValue = typeof temp[1] === "undefined" ? true : temp[1];

      paramName = paramName.toLowerCase();
      if (typeof paramValue === "string")
        paramValue = paramValue.toLocaleLowerCase();

      if (paramName.match(/\[(\d+)?\]$/)) {
        let key = paramName.replace(/\[(\d+)?\]$/, "");
        if (!obj[key]) obj[key] = [];

        if (paramName.match("/[d+]$/")) {
          let index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          obj[key].push(paramValue);
        }
      } else {
        if (!obj[paramName]) {
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === "string") {
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          obj[paramName].push(paramValue);
        }
      }
    }
  }
  return obj;
  return {};
};
