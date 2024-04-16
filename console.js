// Output json file to console..

fetch("dmao.json")
  .then((response) => response.json())
  .then((json) => {
    
   

    const level1Keys = Object.keys(json.guest).filter(key => typeof json.guest[key]== 'object');

    console.log(`Count of objects in level1Keys: ${level1Keys.length}`);
    console.log(json.guest);

  });
