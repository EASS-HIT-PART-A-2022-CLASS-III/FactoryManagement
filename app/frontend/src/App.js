import React, { useState, useEffect } from "react";
import { DetailsList } from '@fluentui/react/lib/DetailsList';
import { IconButton, Text } from "@fluentui/react";
import { SelectionMode } from '@fluentui/react/lib/Selection';
import { PrimaryButton, Dialog, DialogType } from '@fluentui/react';
import { TextField, DefaultButton, Stack } from '@fluentui/react';

function App() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMode, setEditingMode] = useState(false);
  const [productId, setProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  })
  ;

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: ""
    });
    setEditingMode(false);
    setProductId(null);
  };
  
  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  const columns = [
    { key: 'Name', name: 'Name', fieldName: 'name', minWidth: 100, maxWidth: 150 },
    { key: 'Description', name: 'Description', fieldName: 'description', minWidth: 100, maxWidth: 200 },
    { key: 'Price', name: 'Price', fieldName: 'price',  minWidth: 70, maxWidth: 120 },
    { key: 'Stock', name: 'Stock', fieldName: 'stock',  minWidth: 70, maxWidth: 120 },
    { key: 'Category', name: 'Category', fieldName: 'category',  minWidth: 70, maxWidth: 120 },
    {
      key: 'Edit', name: 'Edit', fieldName: 'edit',  minWidth: 70, maxWidth: 120,
      onRender: (item) => <IconButton iconProps={{ iconName: "Edit" }}
        onClick={() => handleEditItem(item._id)} />
    },
    {
      key: 'Delete', name: 'Delete', fieldName: 'delete',  minWidth: 70, maxWidth: 120,
      onRender: (item) => <IconButton iconProps={{ iconName: "Delete" }} onClick={() => handleDeleteItem(item._id)} />
    },
  ];

  const handleEditItem = (id) => {
    fetch(`http://localhost:8000/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        // Show the form of a specific item by setting the form data with the retrieved item
        setFormData(data);
        setShowForm(true);
        setEditingMode(true); // Set editingMode to true
        setProductId(id); // Set the productId
      })
      .catch((error) => {
        console.error('Product not found:', error);
      });
  };
    
  const handleDeleteItem = (id) => {
    fetch(`http://localhost:8000/products/${id}`, { method: 'DELETE' })
      .then(() => {
        setProducts(products.filter((product) => product._id !== id)); // update the state by removing the deleted product
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
      });
  };

  const handleAddItem = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form data:', formData);
  
    if (!editingMode) {
      // Make a POST request to create a new product
      fetch('http://localhost:8000/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then(response => response.json())
        .then(data => {
          console.log('Product created:', data);
          handleCloseForm();
  
          // Fetch the updated list of products
          fetch('http://localhost:8000/')
            .then(response => response.json())
            .then(data => {
              console.log('Product list updated:', data);
              setProducts(data);
            })
            .catch(error => {
              console.error('Error fetching product list:', error);
              // Add your code to handle the error here
            });
        })
        .catch(error => {
          console.error('Error creating product:', error);
          // Add your code to handle the error here
        });
    } else if (editingMode) {
      handleSubmitEditItem(productId);
    }
  };
  
  const handleSubmitEditItem = (productId) => {
    fetch(`http://localhost:8000/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Product updated:', data);
        handleCloseForm();
  
        // Fetch the updated list of products
        fetch('http://localhost:8000/')
          .then(response => response.json())
          .then(data => {
            console.log('Product list updated:', data);
            setProducts(data);
          })
          .catch(error => {
            console.error('Error fetching product list:', error);
          });
      })
      .catch(error => {
        console.error('Error updating product:', error);
      });
  };
  return (
    
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <div style={{ marginTop: '20px',  textAlign:'left'} }>
        <p>Hey, Warehouse Worker</p>
      </div>
      <h1>Inventory Management System</h1>
      <div>
        <PrimaryButton onClick={handleAddItem}>Add Item</PrimaryButton>
        <Dialog
          hidden={!showForm}
          dialogContentProps={{
            type: DialogType.normal,
            title: 'Add Item',
          }}
          modalProps={{
            isBlocking: false,
            onDismiss: handleCloseForm,
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack tokens={{ childrenGap: 10 }}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              <TextField
                label="Price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
              <TextField
                label="Stock"
                name="stock"
                type="number"
                step="1"
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                required
              />
              <TextField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </Stack>
          </form>
          <div>
            <DefaultButton onClick={handleCloseForm} style={{ marginRight: '15px' }}>Cancel</DefaultButton>
            <PrimaryButton onClick={handleSubmit}>Save</PrimaryButton>
          </div>
        </Dialog>
      </div>
      <div>
        <Text>{`Number of items: ${products.length}`}</Text>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <DetailsList
            items={products}
            columns={columns}
            selectionMode={SelectionMode.none}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
