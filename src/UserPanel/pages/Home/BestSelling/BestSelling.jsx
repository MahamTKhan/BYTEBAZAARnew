import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import NextArrow from "../NewArrivals/NextArrow";
import PrevArrow from "../NewArrivals/PrevArrow";
import { IoMdEye, IoMdHeart } from "react-icons/io";
import { GetProducts } from "../../../../AdminPanel/pages/InventoryManagement/GetProducts";

export default function BestSelling() {
  const [products, setProducts] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const handleImageLoad = (e) => {
    setImageDimensions({
      width: e.target.width,
      height: e.target.height,
    });
  };

  useEffect(() => {
    const fetchProds = async () => {
      try {
        const prodsData = await GetProducts();
        const sortedProducts = prodsData.sort((a, b) => b.rating - a.rating);
        const topRatedProducts = sortedProducts.slice(0, 10);
        setProducts(topRatedProducts);
      } catch (error) {
        throw new Error("Error Fetching the Products.");
      }
    };

    fetchProds();
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3.5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="my-14 slider-container">
      <div className="flex flex-col gap-6 mb-6 text-center">
        <h1 className="text-5xl font-bold text-black">Best Sellers</h1>
        <h3 className="mb-6 text-3xl text-black">
          Explore our Customer's Favorites!
        </h3>
      </div>

      <Slider {...settings}>
        {products.map((product, index) => (
          <div
            key={product._id}
            className="relative px-2"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="w-full p-4 border rounded-lg shadow-lg">
              <img
                src={"http://localhost:6005" + product.image}
                alt={product.name}
                className="w-full mb-2 rounded-lg"
                onLoad={handleImageLoad}
              />
              {hoveredIndex === index && (
                <div
                  className="absolute flex flex-col items-center justify-between w-full h-full rounded-lg top-4 left-6"
                  style={{
                    width: imageDimensions.width + "px",
                    height: imageDimensions.height + "px",
                  }}
                >
                  <div className="flex justify-between w-full p-6">
                    <Link to={`/product/${product._id}`}>
                      <button className="flex items-center p-2 bg-gray-200 rounded-full">
                        <IoMdEye className="w-6 h-6 text-blue-800" />
                      </button>
                    </Link>
                    <button className="flex items-center p-2 bg-gray-200 rounded-full">
                      <IoMdHeart className="w-6 h-6 text-red-600" />
                    </button>
                  </div>

                  <button className="flex items-center justify-center w-full p-2 text-white rounded-lg bg-Purple align-center">
                    Add to Cart
                  </button>
                </div>
              )}
              <div className="px-4 py-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold overflow-hidden line-clamp-1 w-[70%]">
                    {product.name}
                  </h3>
                  <span className="inline-flex items-center">
                    ${product.price}
                  </span>
                </div>
                <div className="text-sm leading-8 text-gray-500">
                  {product.category}
                </div>
                <div className="h-12 overflow-hidden line-clamp-2">
                  {product.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
