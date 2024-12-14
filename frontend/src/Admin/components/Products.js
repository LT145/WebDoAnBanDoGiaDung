import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Gọi API để lấy danh sách sản phẩm và danh mục từ backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        const updatedData = response.data.map(product => ({
          ...product,
          active: product.active || 'Sẵn Hàng', // Thiết lập giá trị mặc định cho active nếu chưa có
        }));
        setProducts(updatedData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu danh mục:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  // Hàm tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Lọc danh sách sản phẩm theo giá trị tìm kiếm
  const filteredProducts = products.filter(product => {
    const searchValue = searchTerm.toLowerCase();
    return (
      (product.name && product.name.toLowerCase().includes(searchValue)) ||
      (product.category && product.category.toLowerCase().includes(searchValue)) ||
      (product.discountprice && product.discountprice.toString().includes(searchValue))
    );
  });

  // Cập nhật trạng thái sản phẩm (Sẵn Hàng <-> Ngừng Kinh Doanh)
  const updateStatus = async (index, productId, currentStatus) => {
    const newStatus = currentStatus === 'Sẵn Hàng' ? 'Ngừng Kinh Doanh' : 'Sẵn Hàng';

    try {
      const response = await axios.put(`http://localhost:5000/api/products/${productId}/status`, {
        active: newStatus, // Gửi trạng thái mới
      });

      if (response.status === 200) {
        const updatedProducts = [...products];
        updatedProducts[index].active = newStatus; // Cập nhật trạng thái trong danh sách sản phẩm
        setProducts(updatedProducts); // Cập nhật lại state
      } else {
        console.error('Lỗi khi cập nhật trạng thái sản phẩm');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  // Lấy tên danh mục cho từng sản phẩm
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Không Xác Định';
  };

  return (
    <section className="dashboard p-4">
      <div className="top mb-4 flex items-center justify-between">
        <div className="search-box flex items-center space-x-2">
          <i className="fa-solid fa-magnifying-glass text-lg" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm...."
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 border rounded-md w-full sm:w-96"
          />
        </div>
      </div>
      <div className="dash-content">
        <div className="overview">
          <div className="title flex items-center mb-4">
            <i className="fa-solid fa-box text-2xl mr-2" />
            <span className="text-xl font-semibold">Quản Lý Sản Phẩm</span>
          </div>
          {/* Nút thêm sản phẩm, nhập hàng, tồn kho sắp hết */}
          <div className="flex space-x-4 ml-10 mt-4 mb-4">
            <button
              className="btn-register-product bg-orange-400 text-white p-2 rounded-md"
              onClick={() => navigate('addproduct')}
            >
              Thêm Sản Phẩm
            </button>
            <button
              className="btn-register-product bg-orange-400 text-white p-2 rounded-md"
              onClick={() => navigate('stockimport')}
            >
              Nhập Hàng
            </button>
            <button
              className="btn-register-product bg-orange-400 text-white p-2 rounded-md"
              onClick={() => navigate('lowstock')}
            >
              Tồn Kho Sắp Hết
            </button>
          </div>

          {/* Bảng thông tin sản phẩm */}
          <div className="product-table overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-2">Tên Sản Phẩm</th>
                  <th className="p-2">Ảnh</th>
                  <th className="p-2">Giá</th>
                  <th className="p-2">Giảm Giá</th>
                  <th className="p-2">Danh Mục</th>
                  <th className="p-2">Số Lượng</th>
                  <th className="p-2">Trạng Thái</th>
                  <th className="p-2">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">
                      <img src={product.img} alt={product.name} className="w-24" />
                    </td>
                    <td className="p-2">{product.price.toLocaleString()}</td>
                    <td className="p-2">
                      {product.discountprice !== -1 ? product.discountprice.toLocaleString() : 'Không có giảm giá'}
                    </td>
                    <td className="p-2">{getCategoryName(product.categoryId)}</td>
                    <td className="p-2">{product.quantity === 0 ? 'Hết Hàng' : product.quantity}</td>
                    <td className="p-2">{product.active}</td>
                    <td className="p-2 flex space-x-2">
                      <button
                        className="btn-toggle bg-orange-400 text-white p-2 rounded-md"
                        onClick={() => updateStatus(index, product.id, product.active)}
                      >
                        {product.active === 'Sẵn Hàng' ? 'Ngừng Kinh Doanh' : 'Mở Lại'}
                      </button>
                      <button
                        className="btn-edit bg-orange-400 text-white p-2 rounded-md"
                        onClick={() => navigate(`editproduct/${product.id}`)}
                      >
                        Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductManagement;
