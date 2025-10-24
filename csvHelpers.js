function setNestedProperty(obj, path, value) {
  if (value === '') return;

  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) current[key] = {};
    current = current[key];
  }

  const lastKey = keys[keys.length - 1];
  current[lastKey] = path === 'age' && value ? parseInt(value, 10) : value;
}

function transformForDb(obj) {
  const { name, age, address, ...additional_info } = obj;
  return {
    name: `${name?.firstName || ''} ${name?.lastName || ''}`.trim(),
    age: age || 0,
    address: address || null,
    additional_info: additional_info || null,
  };
}

module.exports = { setNestedProperty, transformForDb };
