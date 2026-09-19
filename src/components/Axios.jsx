import axios from 'axios'
import React from 'react'

export default async function Axios() {

    axios.get(url)
    .then ((response) => {
        console.log(response.data)
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    }       

)



{/* --- or if u use async/await--- */}



        const response = await axios.get(url);      
  return (
    <div>


            {/* --- axios method --- */}
              {/* --- axios method:automatically pass the json .its a library and we install it 
              npm install axios  --- */}
        {/* --- most used http methods is get, it auto throw an error if the request fails  --- */}
    

    </div>
  )
}
