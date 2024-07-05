import {fakerES_MX as faker} from '@faker-js/faker'
 const generar=()=>{


     const products = [];
     for (let i = 0; i < 100; i++) {
       products.push({
         id: faker.database.mongodbObjectId(),
         title: faker.commerce.productName(),
         description: faker.commerce.productDescription(),
         price: parseFloat(faker.commerce.price()),
         thumbnail: faker.image.dataUri(),
         stock: faker.number.hex({ min: 0, max: 500 }),
         code: faker.string.alphanumeric(8)
 
       });
     }
  
    return products
 }
console.log(generar())