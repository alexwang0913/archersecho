const saveToStorage = (name, data) => {
  const encoded = encodeURIComponent(
    Buffer.from(JSON.stringify(data)).toString("base64")
  );
  localStorage.setItem(name, encoded);
};

const getFromStorage = name => {
  // console.log('Get Auth')
  const encoded = localStorage.getItem(name);
  if (encoded) {
    const decoded = JSON.parse(
      Buffer.from(decodeURIComponent(encoded), "base64")
    );
    return decoded;
  }
};

const getDateFromTime = time => {
  let second = Math.floor(time);
  let min = Math.floor(time / 60);
  let hour = Math.floor(time / (60 * 60));
  const day = Math.floor(time / (60 * 60 * 24));
  if (day > 0) {
    time -= day * 60 * 60 * 24;
    hour = Math.floor(time / (60 * 60));
    time -= hour * 60 * 60;
    min = Math.floor(time / 60);
    time -= min * 60;
    second = Math.floor(time);
    hour = hour < 10 ? `0${hour}` : hour;
    min = min < 10 ? `0${min}` : min;
    second = second < 10 ? `0${second}` : second;
    return day + ":" + hour + ":" + min + ":" + second;
  } else if (hour > 0) {
    time -= hour * 60 * 60;
    min = Math.floor(time / 60);
    time -= min * 60;
    second = Math.floor(time);
    hour = hour < 10 ? `0${hour}` : hour;
    min = min < 10 ? `0${min}` : min;
    second = second < 10 ? `0${second}` : second;
    return hour + ":" + min + ":" + second;
  } else if (min > 0) {
    time -= min * 60;
    second = Math.floor(time);

    min = min < 10 ? `0${min}` : min;
    second = second < 10 ? `0${second}` : second;
    return min + ":" + second;
  } else if (second > 0) {
    second = Math.floor(time);
    second = second < 10 ? `0${second}` : second;
    return second;
  }

  return "";
};

export { saveToStorage, getFromStorage, getDateFromTime };
