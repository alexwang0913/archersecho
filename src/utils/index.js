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

export { saveToStorage, getFromStorage };
