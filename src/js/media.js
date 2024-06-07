const lanyardApiUrl = `https://api.lanyard.rest/v1/users/878423404275990529`;

fetch(lanyardApiUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(`An error occurred: ${error.message}`);
  });
