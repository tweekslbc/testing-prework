const Sequelize = require('sequelize');
const { STRING, UUID, UUIDV4, DECIMAL, VIRTUAL } = Sequelize;

const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_tdd_db', {
    logging: false
});

const Product = conn.define('product', {
    id: {
        primaryKey: true,
        type: UUID,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    suggestedPrice: {
        type: DECIMAL,
        defaultValue: 5
    },
    isExpensive: {
        type: VIRTUAL,
        get: function(){
            return this.suggestedPrice > 10 ? true: false;
        }
    }
});

const Category = conn.define('category', {
       id: {
        primaryKey: true,
        type: UUID,
        defaultValue: UUIDV4
    },
    name: STRING
});

Product.belongsTo(Category);

const syncAndSeed = async() => {
    await conn.sync({ force: true });
  const categories = [
    { name: 'catFoo'}, 
    { name: 'catBar'},
    { name: 'catBazz'}
]; 
 const [ catFoo, catBar, catBazz ] = await Promise.all(categories.map(category => Category.create(category)));
  const products = [
    { name: 'foo', categoryId: catFoo.id, suggestedPrice: 11}, 
    { name: 'bar', categoryId: catBar.id, suggestedPrice: 10},
    { name: 'bazz', categoryId: catBazz.id, suggestedPrice: 9}
]; 
 const [foo, bar, bazz ] = await Promise.all(products.map(product => Product.create(product)));
 return {
     products: {
         foo,
         bar,
         bazz
     },
     categories: {
         catFoo,
         catBar,
         catBazz
     }
 }
};

module.exports = {
    syncAndSeed,
    models:{
        Product,
        Category
    }
};