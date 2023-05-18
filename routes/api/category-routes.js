const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  const categories = await Category.findAll({
    include: [Product]
  })
  res.send(categories);
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  const category_id = req.params.id;
  const include_products = req.query.category_id;

  if(category_id){
    const category = await Category.findOne({
      include: Product,
      where: {
        id: category_id
      }
    })
    res.send(category);
  } else res.send ('Unable to find Category with an associated Product.')

});

router.post('/', async (req, res) => {
  // create a new category
  const categoryData = req.body;
  const newCategory = await Category.create(categoryData);
  res.send(newCategory);
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((updatedCategory) => res.json(updatedCategory))
    .catch((error) => {
      res.status(400).json(error);
    });
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(categoryDeleted => {
    console.log('Category deleted')
    res.status(204).send();
  })
  .catch(error => {
    console.log(error);
    res.status(500).send({ error: 'Failed to delete category' });
  })
});

module.exports = router;
