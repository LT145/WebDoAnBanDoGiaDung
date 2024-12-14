import React, { useEffect, useState } from 'react';

function ProductTable() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-[1150px] mx-auto mt-3 p-5 bg-orange-400 rounded-lg">
      <h3 className="text-white mb-4 text-2xl font-semibold">Gợi ý sản phẩm</h3>
      <div className="flex flex-wrap gap-3 justify-start">
        {products.map((product) => (
          <div
            className="relative flex flex-col items-center justify-between p-4 bg-white border border-gray-300 rounded-lg shadow-lg hover:-translate-y-1 transition-transform duration-300"
            key={product.id}
            style={{ flex: '1 1 calc(20% - 10px)', maxWidth: 'calc(20% - 10px)' }}
          >
            <div className="absolute top-0 left-0 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded-br-lg">
              {product.sale}
            </div>
            <img
              src={require(`${product.imgSrc}`)}
              alt={product.name}
              className="w-auto max-h-40 object-contain rounded-md"
            />
            <a
              href="#"
              className="text-lg font-semibold text-gray-800 mt-3 mb-2 text-center hover:underline"
            >
              {product.name}
            </a>
            <div className="flex justify-center items-center gap-2 my-2">
              <p className="text-red-500 font-bold">{product.priceNew}</p>
              <p className="text-gray-500 line-through">{product.priceOld}</p>
            </div>
            <div className="flex justify-center text-yellow-400 mb-2">
              {Array.from({ length: Math.floor(product.rating) }, (_, i) => (
                <i key={i} className="fa-solid fa-star"></i>
              ))}
            </div>
            <a
              href="#"
              className="block text-center bg-orange-600 text-white font-semibold py-2 rounded-md w-full hover:bg-orange-700 transition-colors"
            >
              Mua Ngay
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductTable;
