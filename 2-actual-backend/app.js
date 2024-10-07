const { getStoredItems, storeItems } = require('./data/items');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'GET') {
    if (req.query.id) {
      const storedItems = await getStoredItems();
      const item = storedItems.find((item) => item.id === req.query.id);
      return res.json({ item });
    } else {
      const storedItems = await getStoredItems();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return res.json({ items: storedItems });
    }
  } else if (req.method === 'POST') {
    const existingItems = await getStoredItems();
    const itemData = req.body;
    const newItem = {
      ...itemData,
      id: Math.random().toString(),
    };
    const updatedItems = [newItem, ...existingItems];
    await storeItems(updatedItems);
    return res.status(201).json({ message: 'Stored new item.', item: newItem });
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};
