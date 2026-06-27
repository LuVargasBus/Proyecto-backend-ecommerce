const BASE_URL = 'https://69f2807fb15130b97352f9ac.mockapi.io/api/products/products';

export const getAllProducts = async () => {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error('Error en la API externa');
  }

  return await response.json();
};