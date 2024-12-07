import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditProduct = () => {
  const { id } = useParams();   const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    quantity: 0,
    categoryId: "",
    price: 0,
    discountPrice: -1,
    img: "",
  });
  const [isDiscount, setIsDiscount] = useState(false); 
    useEffect(() => {
    const fetchData = async () => {
      try {
                const { data: categoryData } = await axios.get(
          "http://localhost:5000/api/categories"
        );
        setCategories(categoryData);
    
                const { data: productData } = await axios.get(
          `http://localhost:5000/api/products/findid/${id}`
        );
    
        if (!productData || productData.length === 0) {
          alert("Không tìm thấy sản phẩm!");
          return navigate("/productmanagement");
        }
    
                const product = productData[0];     
        setProduct({
          name: product.name || "",
          quantity: product.quantity || 0,
          categoryId: product.categoryId || "",
          price: product.price || 0,
          discountPrice: product.discountprice ?? -1,
          img: product.img || "",
        });
        setIsDiscount(product.discountprice > 0);
        setLoading(false);       } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        alert("Không thể tải dữ liệu sản phẩm.");
        setLoading(false);
      }
    };
    
  
    fetchData();
  }, [id, navigate]);
    const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
            const formData = new FormData();
      formData.append("name", product.name);
      formData.append("quantity", product.quantity);
      formData.append("categoryId", product.categoryId);
      formData.append("price", product.price);
  
      if (isDiscount && product.discountPrice > 0) {
        formData.append("discountPrice", product.discountPrice);
      } else {
        formData.append("discountPrice", -1);       }
  
            const imageFile = e.target["product-image"].files[0];
      if (imageFile) {
        formData.append("product-image", imageFile);
      }
  
            await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      alert("Cập nhật sản phẩm thành công!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      alert("Cập nhật sản phẩm thất bại. Vui lòng thử lại.");
    }
  };
  

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <section className="dashboard">
      <div className="top">
        <i className="fa-solid fa-bars sidebar-toggle" />
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass" />
          <input type="text" placeholder="Search...." />
        </div>
      </div>
      <div className="dash-content">
        <div className="product-management">
          <div className="title">
            <i className="fa-solid fa-box" />
            <span className="text">Chỉnh Sửa Sản Phẩm</span>
          </div>
          <form className="product-form" onSubmit={handleSubmit}>
            <div className="input-group-container">
              <div className="input-group">
                <label htmlFor="product-name">Tên Sản Phẩm:</label>
                <input
                  type="text"
                  id="product-name"
                  value={product.name}
                  onChange={(e) =>
                    setProduct({ ...product, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="product-quantity">Số Lượng:</label>
                <input
                  type="number"
                  id="product-quantity"
                  value={product.quantity}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      quantity: Math.max(0, Number(e.target.value)),
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="input-group-container">
              <div className="input-group">
                <label htmlFor="product-category">Danh Mục:</label>
                <select
                  id="product-category"
                  value={product.categoryId}
                  onChange={(e) =>
                    setProduct({ ...product, categoryId: e.target.value })
                  }
                  required
                >
                  <option value="">Chọn Danh Mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="product-price">Giá Tiền:</label>
                <input
                  type="number"
                  id="product-price"
                  value={product.price}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      price: Math.max(0, Number(e.target.value)),
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="input-group-container">
              <div className="discount-group">
                <label htmlFor="is-discount">Khuyến Mãi</label>
                <input
                  type="checkbox"
                  id="is-discount"
                  checked={isDiscount}
                  onChange={() => {
                    setIsDiscount(!isDiscount);
                    if (!isDiscount) {
                      setProduct({ ...product, discountPrice: -1 });
                    }
                  }}
                />
              </div>
              {isDiscount && (
                <div className="input-group">
                  <label htmlFor="product-discount-price">
                    Giá Khuyến Mãi:
                  </label>
                  <input
                    type="number"
                    id="product-discount-price"
                    value={
                      product.discountPrice === -1 ? "" : product.discountPrice
                    }
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        discountPrice: Math.max(0, Number(e.target.value)),
                      })
                    }
                  />
                </div>
              )}
            </div>
            <div className="input-group full-width">
              <label htmlFor="product-image">Tải Ảnh (nếu cần thay đổi):</label>
              <input
                type="file"
                id="product-image"
                name="product-image"
                accept="image/*"
              />
            </div>
            <button type="submit" className="submit-btn">
              Cập Nhật Sản Phẩm
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditProduct;
