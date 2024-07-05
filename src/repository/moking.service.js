import { fakerES_MX as faker } from "@faker-js/faker";

export const  generaMoking=()=> {
    const products = [];
    for (let i = 0; i < 100; i++) {
      products.push({
        id: i+1,
        _id: faker.database.mongodbObjectId(),
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


