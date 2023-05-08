import React, { useState, useEffect } from "react";
import { DetailsList } from '@fluentui/react/lib/DetailsList';
import {IconButton, Text} from "@fluentui/react";
import { SelectionMode } from '@fluentui/react/lib/Selection';
import { PrimaryButton, Dialog, DialogType } from '@fluentui/react';
import { TextField, DefaultButton, Stack } from '@fluentui/react';


function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);
  
  const columns = [ 
    { key: 'Name', name: 'Name', fieldName: 'name', minWidth: 40, maxWidth: 80 },
    { key: 'Description', name: 'Description', fieldName: 'description', minWidth: 80, maxWidth: 100 },
    { key: 'Price', name: 'Price', fieldName: 'price', minWidth: 25, maxWidth: 50 },
    { key: 'Stock', name: 'Stock', fieldName: 'stock', minWidth: 25, maxWidth: 50 },
    { key: 'Category', name: 'Category', fieldName: 'category', minWidth:20, maxWidth: 80 },
    { key: 'Edit', name: 'Edit', fieldName: 'edit', minWidth: 20, maxWidth: 50,
    onRender: (item) =><IconButton iconProps={{iconName:"Edit"}} 
    onClick={() => fetch('http://localhost:8000/products/${productId}', {method:'Put'})
    .then(() => {const items = items.filter((item) => item.objectId !== item._id); setProducts(items);})
  .catch(alert('Product id not found'))}
    /> },

    { key: 'Delete', name: 'Delete', fieldName: 'delete', minWidth:20, maxWidth: 20, 
    onRender: (item) => <IconButton iconProps={{iconName:"Delete"}} onClick={() => handleDeleteItem(item._id)} /> 
  },
  ];  

  const handleDeleteItem = (id) => {
    fetch(`http://localhost:8000/products/${id}`, { method: 'DELETE' })
      .then(() => {
        setProducts(products.filter((product) => product._id !== id)); // update the state by removing the deleted product
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
      });
  };

  function MyComponent() {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: ''  
    });

    const handleAddItem = () => {
      setShowForm(true);
    };
  
    const handleCloseForm = () => {
      setShowForm(false);

    };
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    };
  
    const handleSubmit = (event) => {
  event.preventDefault();
  console.log('Form data:', formData);

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
};

    
  
    return (
      <div>
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
          <PrimaryButton onClick={handleCloseForm}  style={{marginRight: '15px'}}>Cancel</PrimaryButton>
          <PrimaryButton onClick={handleSubmit}>Save</PrimaryButton>
        </div>
      </Dialog>
    </div>  
      </div>
    );
  }
    
  return (
    <>
          <MyComponent />
          <div style={{ width: '600px', height: '200px' }}>
        <Text>{`Number of items: ${products.length}.`}</Text>
          <DetailsList
            items={products}
            columns={columns}
            selectionMode={SelectionMode.none}
          />
    </div>

    
    </>
  );
}

export default App;
