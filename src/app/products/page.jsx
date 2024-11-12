"use client";

import { useState, useEffect } from "react";

import useSWR from "swr";

import Basket from "@/components/Basket";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";

const fetcher = (url) => fetch(url).then((res) => res.json()); // Fetcher function for SWR to fetch data from a URL

const Page = () => {
  const { data, error, isLoading } = useSWR(
    "https://dummyjson.com/products?limit=50",
    fetcher
  ); // Using SWR to fetch product data from an API

  // State to track the filtered list of products, selected category, and search query
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]) // State to track items in the basket

  // useEffect hook to update filtered products whenever the data, selected category, or search query changes
  useEffect(() => {
    if (data) {
      // Filter products based on selected category
      let products =
        selectedCategory === "all"
          ? data.products
          : data.products.filter(
              (product) => product.category === selectedCategory
            );

      // Further filter products based on search query
      if (searchQuery) {
        products = products.filter((product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        ); // Case-insensitive search
      }

      // Set the filtered products state
      setFilteredProducts(products);
    }
  }, [data, selectedCategory, searchQuery]); // This effect runs whenever the data, selectedCategory, or searchQuery changes

  // Handle category change: updates the selected category state
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Handle search: updates the searchQuery state
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]); // add product to the cart (last in list)

    
  }
  // Handle errors and loading states
  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div className="max-w-[80dvw] m-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-title my-m">Products</h1>

        {/* Basket component */}
        <Basket cart={cart} />
      </div>
      <div>
        <div className="flex justify-between my-s gap-s flex-wrap">
          <CategoryFilter onCategoryChange={handleCategoryChange} />{" "}
          {/* Pass the category change handler */}
          <SearchBar onSearch={handleSearch} /> {/* Pass the search handler */}
        </div>

        {/* Display the count of filtered products */}
        <p>
          <span>{filteredProducts.length}</span> items
        </p>

        {/* Render the filtered products as cards */}
        <ul className="grid gap-m mx-auto sm:grid-cols-3 lg:grid-cols-4 mb-m">
          {filteredProducts.map(
            ({ id, title, thumbnail, price, discountPercentage, stock }) => (
              <ProductCard
                key={id}
                id={id}
                title={title}
                thumbnail={thumbnail}
                price={price}
                discountPercentage={discountPercentage}
                stock={stock}
                addToCart={addToCart} // Pass addToCart to ProductCard
              />
            )
          )}
          {/* This also works, and here we don't have to explicitly pass the props */}
          {/* {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product} // spread operator, takes all properties of product object, they get passed as props to ProductCard. However, that might be a bit redundant considering all of the props that exist in each object
              addToCart={addToCart} // Pass addToCart to ProductCard
            />
          ))} */}
        </ul>
      </div>
    </div>
  );
};

export default Page;
