const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  const tags = await Tag.findAll({
    include: [Product],
  })
  res.send(tags);
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  const tag_id = req.params.id;
  const include_products = req.query.tag_id;

  if(tag_id) {
    const tag = await Tag.findOne({
      include: Product,
      where: {
        id: tag_id
      }
    })
    res.send(tag);
  }else res.send ('Unable to find Tag with associated Products')
});

router.post('/', async (req, res) => {
  // create a new tag
  Tag.create(req.body)
    .then((tag) => {
      if (req.body.length) {
        const arr = req.body.tagIds.map((tag_id) => {
          return {
            tag_id: tag.id
          };
        });
        return ProductTag.bulkCreate(arr);
      }
      res.status(200).json(tag);
    })
    .then((ids) => res.status(200).json(ids))
    .catch((error) => {
      console.log(error);
      res.status(400).json(error);
    });
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((updatedTag) => res.json(updatedTag))
    .catch((error) => {
      res.status(400).json(error);
    });
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(TagDeleted => {
    console.log('Tag deleted')
    res.status(204).send();
  })
  .catch(error => {
    console.log(error)
    res.status(500).send({ error: 'Failed to delete tag' });
  })
});

module.exports = router;
