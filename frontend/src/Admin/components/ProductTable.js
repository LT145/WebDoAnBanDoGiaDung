import React from 'react';
import { Table, Button } from 'react-bootstrap';

const ProductTable = () => {
  const products = [
    { id: 1, name: 'Sản phẩm 1', price: '1.000.000 đ', stock: 20 },
    { id: 2, name: 'Sản phẩm 2', price: '2.000.000 đ', stock: 15 },
    { id: 3, name: 'Sản phẩm 3', price: '3.000.000 đ', stock: 5 },
  ];

  return (
    <div className="p-3">
      <h3>Danh sách sản phẩm</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>
                <Button variant="warning" className="mr-2">Sửa</Button>
                <Button variant="danger">Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductTable;
