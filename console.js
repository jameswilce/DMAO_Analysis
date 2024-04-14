// Output json file to console..

fetch("dmao.json")
  .then((response) => response.json())
  .then((json) => {
    
   console.log(json.guest);

    const level1Keys = Object.keys(json.guest).filter(key => typeof json.guest[key]== 'object');

    console.log(level1Keys);


  });
