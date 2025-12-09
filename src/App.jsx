import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import unnamed7 from './assets/images/unnamed-7.png';
import logo from './assets/images/logo image.png';
import rectangle60 from './assets/images/rectangle-60.png';
import macbookAir2 from './assets/images/macbook-air-2.png';
import ellipse172 from './assets/images/ellipse-172.png';
import ellipse173 from './assets/images/ellipse-173.png';
import ellipse174 from './assets/images/ellipse-174.png';
import ellipse175 from './assets/images/ellipse-175.png';
import whatsapp2 from './assets/images/whatsapp-2.png';
import whatsapp3 from './assets/images/whatsapp-3.png';

// Import Union background shapes (these are complex shapes, so we treat them as images)
import union from './assets/images/union.png';
import union1 from './assets/images/union-1.png';
import union2 from './assets/images/union-2.png';
import union3 from './assets/images/union-3.png';

// Import SVGs as components or images
import mailRounded from './assets/svgs/mail-rounded.svg';
import call from './assets/svgs/call.svg';
import searchBold from './assets/svgs/search-bold.svg';
import vector from './assets/svgs/vector.svg';

import { fetchData, endpoints } from './services/api';

function PajamasScrollDown({ className }) {
  return (
    <div className={`${className} flex justify-center items-center`}>
      <img src={vector} alt="Scroll Down" className="w-full h-full" />
    </div>
  );
}

export default function App() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const heroRef = useRef(null);
  const productSectionRef = useRef(null);
  const stickyNavRef = useRef(null);
  const NAV_HEIGHT = 72;

  // Helper to map API image strings to local imports if needed
  // If your API returns full URLs, you can use them directly.
  const getImage = (imageName) => {
      const images = {
          'ellipse-172': ellipse172,
          'ellipse-173': ellipse173,
          'ellipse-174': ellipse174,
          'ellipse-175': ellipse175,
      };
      // Return mapped image or original string if it's a URL
      return images[imageName] || imageName || ellipse172; 
  };

  useEffect(() => {
    // Fetch "Why Choose Us" features (fallback to static data if API doesn't exist)
    fetchData(endpoints.features)
        .then(data => {
            setFeatures(data);
            setLoading(false);
        })
        .catch(err => {
            console.log("Features endpoint not available, using fallback data.");
            // Fallback data matches the design initially
            setFeatures([
                { id: 1, title: 'Handmade With Love', desc: 'Small-batch poured with warmth, care & personal detail.', image: 'ellipse-172', bgIndex: 0 },
                { id: 2, title: 'Natural Wax Only', desc: 'Soft, clean-burning wax free from toxins and chemicals.', image: 'ellipse-173', bgIndex: 1 },
                { id: 3, title: 'Aroma Rich Scents', desc: 'Fragrance that lingers, calms and transforms your space.', image: 'ellipse-174', bgIndex: 2 },
                { id: 4, title: 'Perfect for Gifting', desc: 'Thoughtfully crafted candles ready to spark joy.', image: 'ellipse-175', bgIndex: 3 },
            ]);
            setLoading(false);
        });

    // Fetch Products from the API
    fetchData(endpoints.products)
        .then(response => {
            console.log('Products API Response:', response);
            if (response.success && response.data && Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                console.warn('Unexpected API response structure:', response);
            }
        })
        .catch(err => {
            console.error("Error fetching products:", err);
            setProducts([]); // Set empty array on error
        });

  }, []);

  useEffect(() => {
    try {
      gsap.registerPlugin(ScrollTrigger);
      const heroEl = heroRef.current;
      const navEl = stickyNavRef.current;
      const productEl = productSectionRef.current;
      if (!heroEl || !navEl || !productEl) return;

      const ctx = gsap.context(() => {
        gsap.set(navEl, { autoAlpha: 0, y: -20 });

        // Hero parallax upward
        gsap.to(heroEl, {
          y: -NAV_HEIGHT,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: productEl,
            start: 'top bottom', // when product enters viewport bottom
            end: `top top+=${NAV_HEIGHT}`, // when product hits nav area
            scrub: true,
          },
        });

        // Navbar fade/slide in
        gsap.to(navEl, {
          autoAlpha: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: productEl,
            start: `top top+=${NAV_HEIGHT}`, // as product reaches nav
            end: `top top+=${NAV_HEIGHT + 1}`,
            toggleActions: 'play none none reverse',
          },
        });
      });

      return () => ctx.revert();
    } catch (err) {
      console.error('GSAP initialization error:', err);
    }
  }, []);

  const getUnion = (index) => {
      const unions = [union, union1, union2, union3];
      return unions[index % unions.length];
  };

  // Helper to get product image URL
  const getProductImageUrl = (url) => {
      if (!url) return rectangle60;
      
      // If it's already a direct image URL, return it
      if (url.startsWith('http') && (url.includes('.jpg') || url.includes('.png') || url.includes('.jpeg') || url.includes('unsplash.com/photos'))) {
          // For Unsplash photo pages, try to extract ID and use direct image URL
          const photoIdMatch = url.match(/photos\/[^-]+-([A-Za-z0-9_-]+)$/);
          if (photoIdMatch && photoIdMatch[1]) {
              // Use Unsplash's direct image API
              return `https://images.unsplash.com/photo-${photoIdMatch[1]}?w=800&h=800&fit=crop`;
          }
          return url;
      }
      
      // Fallback to default image
      return rectangle60;
  };

  return (
    <div className="relative w-full min-h-screen bg-white font-montserrat">
      
      {/* Sticky Navbar - fades in when scrolled past hero */}
      <nav
        ref={stickyNavRef}
        className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md shadow-lg"
      >
        <div className="max-w-[1280px] mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="h-12 w-32 relative overflow-hidden">
              <img src={logo} alt="Logo" className="absolute w-[100%] h-[100%] object-contain" />
            </div>
            
            <div className="hidden md:flex gap-10 text-xs text-white uppercase">
              <a href="#" className="hover:text-yellow-accent transition-colors">Home</a>
              <a href="#" className="hover:text-yellow-accent transition-colors">About Us</a>
              <a href="#" className="hover:text-yellow-accent transition-colors">Products</a>
              <a href="#" className="hover:text-yellow-accent transition-colors">Custom</a>
              <a href="#" className="hover:text-yellow-accent transition-colors">Contact Us</a>
            </div>
            
            <button className="bg-yellow-accent px-4 py-2 rounded-lg text-xs text-black capitalize hover:bg-yellow-500 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Sticky */}
      <div
        ref={heroRef}
        className="sticky top-0 w-full h-screen overflow-hidden z-0"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
            <img src={unnamed7} alt="Hero Background" className="w-full h-full object-cover object-top" />top

            <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center">
            
            {/* Header/Nav */}
            <div className="w-full max-w-[1280px] px-4 pt-4 flex flex-col gap-2">
                
                {/* Top Bar */}
                <div className="flex flex-col md:flex-row items-center text-white text-xs w-full">
                    {/* Left-aligned: Email */}
                    <div className="flex items-center gap-2 w-full md:w-auto md:justify-start justify-center md:flex-none">
                        <img src={mailRounded} alt="Email" className="w-6 h-6" />
                        <span>cozycreationscorner13@gmail.com</span>
                    </div>
                    {/* Center-aligned: Offer */}
                    <div className="font-semibold hidden sm:flex flex-1 items-center justify-center text-center">
                        offer on 25th december for christmas collection
                    </div>
                    {/* Right-aligned: Call */}
                    <div className="flex items-center gap-2 w-full md:w-auto md:justify-end justify-center md:flex-none">
                        <img src={call} alt="Call" className="w-6 h-6" />
                        <span>+91 80194 01322</span>
                    </div>
                </div>
                
                <div className="w-full h-[1px] bg-white/20 my-2"></div>
                
                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <div className="h-12 w-32 relative overflow-">
                         <img src={logo} alt="Logo" className="absolute w-[100%] h-[100%] object-contain" />
                    </div>
                    
                    <div className="hidden md:flex gap-10 text-xs text-white uppercase">
                        <a href="#" className="hover:text-yellow-accent">Home</a>
                        <a href="#" className="hover:text-yellow-accent">About Us</a>
                        <a href="#" className="hover:text-yellow-accent">Products</a>
                        <a href="#" className="hover:text-yellow-accent">Custom</a>
                        <a href="#" className="hover:text-yellow-accent">Contact Us</a>
                    </div>
                    
                    <button className="bg-yellow-accent px-4 py-2 rounded-lg text-xs text-black capitalize">
                        Contact Us
                    </button>
                </div>
            </div>

            {/* Hero Text */}
            <div className="flex-1 flex flex-col justify-center items-center text-center text-white gap-5 mt-10">
                <p className="font-semibold text-xs uppercase tracking-wider">
                    Crafted with Love, Made for Happy Hearts
                </p>
                <div className="flex flex-col gap-2">
                    <h1 className="font-bold text-4xl md:text-6xl leading-tight">
                        Handcrafted Candles<br /> Made to Warm Your World
                    </h1>
                    <p className="font-semibold text-xs md:text-sm max-w-lg mx-auto">
                        Discover soothing fragrances, soft glows, and artisanal designs crafted to bring comfort into every corner of your home.
                    </p>
                </div>
                
                <button className="bg-yellow-accent flex items-center gap-2 px-6 py-3 rounded-md mt-4 text-black font-medium">
                    <img src={searchBold} alt="Search" className="w-6 h-6" />
                    <span>Shop Collections</span>
                </button>
            </div>
            
            {/* Scroll Down */}
            <div className="pb-8 flex flex-col items-center gap-2 text-white">
                <PajamasScrollDown className="animate-bounce w-6 h-6" />
                <span className="text-xs font-semibold uppercase">Scroll Down</span>
            </div>
        </div>
      </div>

      {/* Product Highlight Section */}
      <div
        ref={productSectionRef}
        className="relative w-full h-screen bg-white flex flex-col md:flex-row overflow-hidden z-20"
      >
        <div className="w-full md:w-1/2 flex flex-col justify-center px-10 md:pl-[100px] py-16 h-full">
          <h2 className="font-normal text-4xl md:text-[62px] leading-tight text-black uppercase max-w-xl mb-12">
            Elevate Your Space With Handcrafted Glow
          </h2>
          <div className="hidden md:block w-full max-w-[540px] h-[1px] bg-black mb-8"></div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-yellow-accent px-6 py-3 rounded-md text-black font-medium text-base capitalize whitespace-nowrap">
              Explore collections
            </button>
            <button className="border border-black px-6 py-3 rounded-md text-black font-medium text-base capitalize hover:bg-black hover:text-white transition whitespace-nowrap">
              Customize Your Candle
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 h-full overflow-hidden">
          <img src={rectangle60} alt="Candle" className="w-full h-full object-cover" />
        </div>
      </div>

      
      {/* Featured Collection Section */}
      {products.length > 0 && (
        <div className="relative w-full bg-white py-16 z-10">
            <div className="max-w-[1280px] mx-auto px-4">
                <h2 className="font-['Montserrat:Regular',sans-serif] font-normal text-4xl md:text-5xl text-black uppercase mb-12 text-center">
                    Our Collection
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="flex flex-col group cursor-pointer">
                            <div className="w-full aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4 relative">
                                <img 
                                    src={getProductImageUrl(product.imageUrl)} 
                                    alt={product.altText || product.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    onError={(e) => { e.target.src = rectangle60; }}
                                />
                                {product.category && (
                                    <span className="absolute top-2 left-2 bg-white px-2 py-1 text-xs font-semibold uppercase tracking-wider rounded">
                                        {product.category}
                                    </span>
                                )}
                            </div>
                            <h3 className="font-['Montserrat:Medium',sans-serif] font-medium text-lg text-black mb-2">
                                {product.name}
                            </h3>
                            <div className="flex justify-between items-center">
                                <p className="font-['Montserrat:Regular',sans-serif] font-normal text-gray-800 text-lg">
                                    ₹{product.price}
                                </p>
                                <span className="font-['Montserrat:Regular',sans-serif] font-normal text-xs text-gray-500 capitalize">
                                    {product.waxType} Wax
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* Why Choose Us Section */}
      <div className="relative w-full h-auto min-h-[650px] bg-gray-50 overflow-hidden z-10">
        <div className="absolute inset-0">
            <img src={macbookAir2} alt="Background" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl"></div>
        </div>
        
        <div className="relative w-full max-w-[1280px] mx-auto py-16 flex flex-col items-center">
            <h2 className="font-semibold text-4xl text-black capitalize mb-2 text-center">Why Choose Us</h2>
            <p className="text-lg text-black mb-16 text-center px-4">Candles crafted to comfort, glow and soothe your space.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-8">
                {features.map((feature, index) => (
                    <div key={feature.id} className="flex flex-col items-center text-center">
                        <div className="mb-6 flex justify-center items-center">
                            <img src={getImage(feature.image)} alt={feature.title} className="w-[170px] h-[170px] rounded-full object-cover" />
                        </div>
                        <h3 className="font-medium text-lg mb-2">{feature.title}</h3>
                        <p className="text-sm text-gray-800">{feature.desc}</p>
                    </div>
                ))}
            </div>
            
            <div className="mt-16 relative z-10">
                 <button className="bg-yellow-accent px-8 py-3 rounded-lg font-medium text-black capitalize">
                    View Catalogue
                 </button>
            </div>
        </div>
      </div>


      {/* Footer Section */}
      <div className="relative w-full bg-[#191816] text-white py-16 overflow-visible z-10">
        {/* Decorative Background Image */}
         <div className="overflow-visible lg:block absolute top-[-170px] right-[2%] w-[380px] h-[500px] opacity-100 pointer-events-none">
             <img src={whatsapp2} alt="Decor" className="w-full h-[100%] object-contain" />
         </div>

         <div className="w-full max-w-[1280px] mx-auto px-8 relative z-10">
             <div className="flex flex-col md:flex-row gap-10 md:gap-20 items-center md:items-start">
                 {/* Footer Image */}
                 <div className="w-[300px] h-[200px] rounded-2xl overflow-hidden relative">
                     <img src={whatsapp3} alt="Footer Candle" className="w-full h-full object-fill" />
                 </div>
                 
                 {/* Links */}
                 <div className="flex gap-20">
                     {/* Navigation Links */}
                     <div className="flex flex-col gap-3 text-sm capitalize">
                         <a href="#" className="hover:text-yellow-accent">Home</a>
                         <a href="#" className="hover:text-yellow-accent">About Us</a>
                         <a href="#" className="hover:text-yellow-accent">Products</a>
                         <a href="#" className="hover:text-yellow-accent">Customize</a>
                         <a href="#" className="hover:text-yellow-accent">Contact Us</a>
                     </div>
                     {/* Contact Details */}
                     <div className="flex flex-col gap-4 text-sm">
                         <p>Instagram</p>
                         <p className="flex items-center gap-2">
                             <img src={mailRounded} alt="Email" className="w-4 h-4" />
                             <a href="mailto:cozycandlecorner13@gmail.com" className="underline">cozycandlecorner13@gmail.com</a>
                         </p>
                         <p className="flex items-center gap-2">
                            <img src={call} alt="Call" className="w-4 h-4" />
                            <span>8019401322</span>
                         </p>
                         <p>📍 Hyderabad, Gajularamaram</p>
                     </div>
                 </div>
             </div>
             
             <div className="w-full h-[1px] bg-white my-8"></div>
             
            <div className="text-center text-xs text-white">© 2025 Cozy Creations. All rights reserved.</div>
        </div>
    </div>
  </div>
  );
}

