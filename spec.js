const { expect } = require('chai');
const db = require('./db');
const { Product, Category } = db.models;

describe('Acme TDD', ()=> {
    let seed;
    beforeEach(async()=> seed = await db.syncAndSeed());
    describe('Data Layer', ()=> {
      it('Foo, Bar and Bazz are products', ()=> {
       expect(seed.products.foo.name).to.equal('foo');
       expect(seed.products.bar.name).to.equal('bar');
       expect(seed.products.bazz.name).to.equal('bazz');
   });
   it('a product belongs to a category', ()=> {
    expect(seed.products.foo.categoryId).to.equal(seed.categories.catFoo.id);    
   });
   describe('isExpensive', ()=> {
    it('a product with a suggestedPrice greater than 10 is expensive', ()=> {
      expect(Product.build({ suggestedPrice: 11 }).isExpensive).to.equal(true);  
    
    });  
    it('a product with a suggestedPrice 10 dollars  or less is not expensive', ()=>{
      expect(Product.build({ suggestedPrice: 10 }).isExpensive).to.equal(false);
   });
   
   describe('findAllExpensiveProducts', ()=> {
       it('there is one expensive product', async()=> {
           const expensive = await Product.findAllExpensive();
           expect(expensive.length).to.equal(1);
       });
   });
   describe('Product validation', () => {
       it('name is required', ()=>{
        return Product.create({})
            .then(() => {
                throw 'damnit';
            })
            .catch(ex => expect(ex.errors[0].path).to.equal('name'));
       });
        it('name can not be an empty string', () =>{
            return Product.create({name: ''})
            .then(()=> {
              throw 'noooooo';  
            })
            .catch( ex => expect(ex.errors[0].path).to.equal('name'));
         });
       })
    });
    });