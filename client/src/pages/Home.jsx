import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import img1 from "../assets/cracker1.jpg";
import img2 from "../assets/cracker2.jpg";
import img3 from "../assets/cracker3.jpg";
import img4 from "../assets/download.jpg";
import img5 from "../assets/crackers6.jpg";
import img6 from "../assets/crackers7.jpg";
import img7 from "../assets/crackers9.jpg";
import img8 from "../assets/crackers10.jpg";

const HomePage = () => {
  const [index, setIndex] = useState(0);
  const [email, setEmail] = useState("");
 const [isHovered, setIsHovered] = useState(false);


  const navigate = useNavigate();

   const handleSubscribe = () => {
    if (!email) {
      alert("Please enter a valid email");
      return;
    }

    // Navigate to subscribe page with email
    navigate(`/subscribe?email=${email}`);
  };



  // ✅ UNIQUE crackers array  //
  const crackers = [
    { id: 1, name: "Conch wheel", price: 120, image: img1 },
    { id: 2, name: "Flower Pots", price: 250, image: img2 },
    { id: 3, name: " Sky Lantern ", price: 80, image: img3 },
    { id: 4, name: "Rod Sparkler", price: 80, image: img4 },
    { id: 5, name: "Chain Crackers", price: 150, image: img5 },
    { id: 6, name: "Thunder Crackers", price: 200, image: img6 },
    { id: 5, name: "Magic Pencil", price: 150, image: img7 },
    { id: 6, name: "small pots", price: 200, image: img8 },
  ];

  const users = [
    { id: "1", name: "John Doe", createdAt: new Date("2026-03-20"), avatar: "https://i.pravatar.cc/150?img=1" },
    { id: "2", name: "Jane Smith", createdAt: new Date("2026-03-22"), avatar: "https://i.pravatar.cc/150?img=2" },
    { id: "3", name: "Alice Johnson", createdAt: new Date("2026-03-23"), avatar: "https://i.pravatar.cc/150?img=3" },
    { id: "4", name: "Bob Williams", createdAt: new Date("2026-03-24"), avatar: "https://i.pravatar.cc/150?img=4" },
    { id: "1", name: "John Doe", createdAt: new Date("2026-03-20"), avatar: "https://i.pravatar.cc/150?img=1" },
    { id: "2", name: "Jane Smith", createdAt: new Date("2026-03-22"), avatar: "https://i.pravatar.cc/150?img=2" },
    { id: "3", name: "Alice Johnson", createdAt: new Date("2026-03-23"), avatar: "https://i.pravatar.cc/150?img=3" },
    { id: "4", name: "Bob Williams", createdAt: new Date("2026-03-24"), avatar: "https://i.pravatar.cc/150?img=4" },


  ];




    


  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => setIndex((prev) => (prev + 1) % crackers.length), 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const nextSlide = () => setIndex((prev) => (prev + 1) % crackers.length);
  const prevSlide = () => setIndex((prev) => (prev === 0 ? crackers.length - 1 : prev - 1));

  const addToCart = (item) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    localStorage.setItem("cart", JSON.stringify([...existingCart, { ...item, qty: 1 }]));
    alert(`${item.name} added to cart 🛒`);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="bg-[#f1f5f9] min-h-screen">
      {/* HERO / SLIDER */}
      <div className="text-center p-6">
        <h1 className="text-5xl font-bold mb-2">
          <span className="text-orange-500">Cracker</span> Mart 
        </h1>
        <p className="text-gray-500 mb-12">Best quality crackers delivered to your doorstep</p>

        <div
          className="max-w-6xl mx-auto relative overflow-hidden rounded-[20px] shadow-xl h-[450px] flex"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.8 }}
              className="flex w-full h-full"
            >
              <div className="w-2/3 h-full">
                <img src={crackers[index].image} alt={crackers[index].name} className="w-full h-full object-cover rounded-l-[10px]" />
              </div>
       
              <div className="w-1/3 bg-white flex flex-col justify-center p-6 rounded-r-[20px] gap-4">


                <h1 className="text-3xl font-bold  text-gray-800 mb-15">{crackers[index].name}</h1>

         <p className="text-xl font-extrabold text-red-800  ">  
  Light Up Every Moment with <span className="font-extrabold">Sparkling Joy ✨</span>
</p>



<p className="text-xl font-extrabold text-orange-600 tracking-wide">
  Ignite Happiness, One Crack at a Time! 💥
</p>



                <button
                  onClick={() => addToCart(crackers[index])}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              </div>                                              
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white w-10 h-10 rounded-full shadow flex items-center justify-center"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white w-10 h-10 rounded-full shadow flex items-center justify-center"
          >
            <ChevronRight />
          </button>

          {/* Dots */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/4 flex gap-2">
  {crackers.map((_, i) => (
    <div
      key={i}
      onClick={() => setIndex(i)}
      className={`w-3 h-2  rounded-full cursor-pointer transition-colors ${
        i === index ? "bg-white" : "bg-gray-300"
      }`}
    />
  ))}
          </div>
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:grid-cols-4 gap-6">
          {crackers.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg p-4 flex flex-col">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-xl mb-4" />
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="text-orange-500 font-bold mb-2">₹{item.price}</p>
              <button
                onClick={() => addToCart(item)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition mt-auto"
              >
                <ShoppingCart size={16} /> Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* USERS / TESTIMONIALS SLIDER */}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-3 text-center">Our Buyers</h2>
        <p className="text-gray-500 text-center mb-2 ">4+ Million Users can review
        </p>
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center gap-6"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center min-w-[250px]">
                <img src={users[index % users.length].avatar} alt={users[index % users.length].name} className="w-20 h-20 rounded-full mb-4" />
                <h3 className="text-lg font-semibold">{users[index % users.length].name}</h3>
                <p className="text-sm text-gray-500">ID: {users[index % users.length].id}</p>
                <p className="text-sm text-gray-400">
                  Created: {users[index % users.length].createdAt.toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots as a line */}
          <div className="flex justify-center mt-4 gap-2">
            {users.map((_, i) => (
              <div
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1 w-8 rounded-full cursor-pointer transition-all ${i === index % users.length ? "bg-orange-500" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ABOUT / INFO */}
      <div className="bg-white p-6 mt-12 text-center max-w-6xl mx-auto rounded-2xl shadow">
        <h2 className="text-3xl font-bold mb-4">About Cracker Mart</h2>
        <p className="text-gray-600 mb-4">
          Cracker Mart has been delivering premium quality fireworks and crackers for over 10 years. Celebrate safely and joyfully with our trusted products.
        </p>
        <p className="text-gray-600">
          We believe in quality, safety, and customer happiness. Every purchase is guaranteed to bring smiles and sparkle to your celebrations!
        </p>
      </div>

 
 
    <div>
      {/* NEWSLETTER */}
      <div className="bg-blue-700 h-50 p-6 mt-12 text-white">
        <div className="max-w-8xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">Subscribe to our Newsletter</h2>
            <p className="text-sm">Get updates on latest crackers and offers</p>
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 rounded-l-lg text-black"
            />
            <button
              onClick={handleSubscribe}
              className="bg-white text-blue-500 px-4 rounded-r-lg font-semibold hover:bg-gray-200 transition"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-blue-800 text-white pt-10 pb-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-3">Cracker Mart</h3>
            <p className="text-sm">
              Your one-stop shop for all kinds of fireworks and crackers.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold mb-3">Cracker Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/category/flower-pots" className="hover:underline">Flower Pots</a></li>
              <li><a href="/category/rockets" className="hover:underline">Rockets</a></li>
              <li><a href="/category/sparklers" className="hover:underline">Sparklers</a></li>
              <li><a href="/category/bombs" className="hover:underline">Bombs</a></li>
              <li><a href="/category/fancy" className="hover:underline">Fancy Crackers</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:underline">About Us</a></li>
              <li><a href="/contact" className="hover:underline">Contact</a></li>
              <li><a href="/offers" className="hover:underline">Offers</a></li>
              <li><a href="/faq" className="hover:underline">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-3">Contact</h3>
            <p className="text-sm">Email: support@crackermart.com</p>
            <p className="text-sm">Phone: +91 98765 43210</p>
          </div>
        </div>

        <div className="text-center  text-sm mt-8 border-t border-blue-600 pt-4">
          © 2026 Cracker Mart. All rights reserved.
        </div>
      </footer>
    </div>
    </div>

  );
}


export default HomePage;
