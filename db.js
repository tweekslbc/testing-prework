const Sequelize = require('sequelize');
const { STRING } = Sequelize;

const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_tdd_db');

const Product = conn.define('product', {
    name: STRING
});


const syncAndSeed = async() => {
    await conn.sync({ force: true });
  const products = [
    { name: 'foo'}, 
    { name: 'bar'},
    { name: 'bazz'}
]; 
 const [foo, bar, bazz ] = await Promise.all(products.map(product => Product.create(product)));
 return {
     products: {
         foo,
         bar,
         bazz
     }
 }
};

module.exports = {
    syncAndSeed
};