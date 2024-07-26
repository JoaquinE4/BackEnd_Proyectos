import jwt from 'jsonwebtoken'
import { config } from '../config/congif.js'
 


let verifi = jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTI1ODgzNzVkODk0OThkZjA0Mjk3MSIsImlhdCI6MTcyMTkxODA1NiwiZXhwIjoxNzIxOTIxNjU2fQ.X-99uFbty_WNT2LOz7P-0jUJDuQNu_GS4mpBLYOVEWA", config.SECRET)
if(!verifi){
    console.log('No funiono chee');
    
}else{
    console.log('Todo bien che');
    console.log(verifi);
    
}