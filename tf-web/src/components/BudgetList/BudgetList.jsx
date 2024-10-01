import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BudgetList = (props) => {
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [budgetList, setBudgetList] = useState({});
    const [newItem, setNewItem] = useState('');

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`https://localhost:7287/budgetLists/${props.id}`);
                console.log("Response data: ", response.data);
                setBudgetList(response.data);
            } catch (error) {
                console.error('Error fetching budget list:',error);
                alert("Failed to fetch budgetList");
            }
        };

        getData();
    }, [props.id]);

    const addProduct = () => {
        if (!newItem.trim()){
            alert('Item cannot be empty')
            return;
        }

        axios.post('https://localhost7287/budgetList/${props.id}/budgetItems', {name: productName, price: productPrice})
            .then(response => {
                console.log('Created budget item', response.data);
                setBudgetList(prevBudgetList => ({...prevBudgetList, items: [...prevBudgetList.items, response.data]
            }));
            setNewItem('');
            })
        .catch(error => {
            console.error('Error adding budget item:', error)
            alert('Error creating budget item')
        });
    };

    // const handleAddProduct = async () => {
    //     if (productName && productPrice) {
    //         const newProduct = { name: productName, price: parseInt(productPrice) };

    //         try {
    //             const response = await axios.post('/budgetLists', newProduct)
    //             setProducts([...products, response.data]);
    //             setProductName('');
    //             setProductPrice('');
    //         } catch (error){
    //             console.error("Could not add product:", error)
    //         }
    //     }
    // };

    // const handleAddProduct = () => {
    //     if (productName && productPrice) {
    //         const newProduct = { name: productName, price: parseInt(productPrice) };
    
    //         setProducts([...products, newProduct]);
    //         setProductName('');
    //         setProductPrice('');
    //     }
    // };

    const totalSum = products.reduce((sum, product) => sum + product.price, 0);

    const budgetItems = budgetList.items && budgetList.items.length > 0 ? (
        budgetList.items.map((item) => (
            <li key={item.id}>
                {item.name} - {item.price}
            </li>
        ))
    ) : (
        <p>Empty</p>
    );

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                />
                <button onClick={addProduct}>Add Product</button>
            </div>
            <div className='productList'>
                <h4>Product List:</h4>
                <ul>
                    {/* {products.map((product, index) => (
                        <li key={index}>
                            {product.name} - ${product.price}
                        </li>
                    ))} */}
                    {budgetItems}
                </ul>
            </div>
            <div>
                {/* <h4>Total: ${totalSum}</h4> */}
            </div>
        </div>
    );
};

export default BudgetList;
