import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { galleryItems } from "../Data/data.js";
import { Canvas } from "@react-three/fiber";
import CoffeeOBJ from "../models/Coffeebag.jsx";
import { OrbitControls } from "@react-three/drei";

const OurCoffees = () => {
  const [activeTexture, setActiveTexture] = useState(galleryItems[0].textureurl);
  const [isHovering, setIsHovering] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState('250g');
  const [grindType, setGrindType] = useState('Whole Bean');

  useEffect(() => {
    const gallery = document.querySelector(".gallery");
    const blurryPrev = document.querySelector(".blurry-prev");
    const projectPreview = document.querySelector(".project-preview");
    const itemCount = galleryItems.length;

    // Clear existing gallery items first
    gallery.innerHTML = "";
    projectPreview.innerHTML = "";

    let activeItemIndex = 0;
    let isAnimating = false;

    // Populate the gallery with items
    galleryItems.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("item", "relative");
      if (index === 0) itemDiv.classList.add("active");

      // Background preview image
      const previewImg = document.createElement("img");
      previewImg.src = item.imageurl;
      previewImg.alt = `${item.title} Preview`;
      previewImg.className = "w-full h-full object-cover";

      // Logo overlay
      const logo = document.createElement("img");
      logo.src = item.titleurl;
      logo.alt = `${item.title} Logo`;
      logo.className = "absolute inset-0 w-full h-full object-contain  p-4";

      itemDiv.appendChild(previewImg);
      itemDiv.appendChild(logo);

      // Hover animation
      itemDiv.addEventListener("mouseenter", () => {
        gsap.to(itemDiv, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      itemDiv.addEventListener("mouseleave", () => {
        gsap.to(itemDiv, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      itemDiv.dataset.index = index;
      itemDiv.addEventListener("click", () => handleItemClick(index));
      gallery.appendChild(itemDiv);
    });

    // Initialize project preview
    const initializeProjectPreview = () => {
      const activeItem = galleryItems[0];
      renderPreviewContent(activeItem);
    };

    const renderPreviewContent = (item) => {
      projectPreview.innerHTML = "";

      const logo = document.createElement("img");
      logo.src = item.titleurl;
      logo.alt = `${item.title} Logo`;
      logo.className = "w-72 mb-4 mx-auto";

      const info = document.createElement("div");
      info.className =
        "text-xs space-y-2 font-light leading-5 max-h-28 overflow-y-auto";

      // Create formatted content
      info.innerHTML = `
        <p class="mb-2">${item.copy}</p>
        
        <div class="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
          ${Object.entries(item.details)
            .map(
              ([key, value]) => `
            <div class="flex items-center">
              <span class="font-medium">${key}:</span>
              <span class="ml-1">${value}</span>
            </div>
          `
            )
            .join("")}
        </div>
      `;

      const projectImgContainer = document.createElement("div");
      projectImgContainer.className =
        "w-full h-[400px] max-h-[400px] overflow-hidden rounded-lg mb-2 mt-4";

      const projectImg = document.createElement("img");
      projectImg.src = item.imageurl;
      projectImg.alt = `${item.title} Preview`;
      projectImg.className = "w-full h-full object-cover";

      projectImgContainer.appendChild(projectImg);

      projectPreview.appendChild(logo);
      projectPreview.appendChild(info);
      projectPreview.appendChild(projectImgContainer);
    };

    // Handle item click
    const handleItemClick = (index) => {
      if (index === activeItemIndex || isAnimating) return;
      isAnimating = true;
      setIsLoading(true);

      const activeItem = galleryItems[index];

      // Update active texture and index
      setActiveTexture(activeItem.textureurl);
      setActiveIndex(index);

      // Add timeout to simulate loading and ensure smooth transition
      setTimeout(() => {
        setIsLoading(false);
      }, 800);

      gsap.to(projectPreview.children, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.inOut",
        onComplete: () => {
          renderPreviewContent(activeItem);
          gsap.to(projectPreview.children, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: "power2.out",
            onComplete: () => {
              isAnimating = false;
            },
          });
        },
      });

      gallery.children[activeItemIndex].classList.remove("active");
      gallery.children[index].classList.add("active");
      activeItemIndex = index;

      const newBlurryImg = document.createElement("img");
      newBlurryImg.src = activeItem.imageurl;

      blurryPrev.insertBefore(newBlurryImg, blurryPrev.firstChild);
      const currentBlurryImg = blurryPrev.querySelector("img:nth-child(2)");
      if (currentBlurryImg) {
        gsap.to(currentBlurryImg, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => blurryPrev.removeChild(currentBlurryImg),
        });
      }
      gsap.to(newBlurryImg, { opacity: 1, duration: 0.8, ease: "power2.inOut" });
    };

    initializeProjectPreview();

    // Cleanup function to prevent memory leaks
    return () => {
      gallery.innerHTML = "";
      projectPreview.innerHTML = "";
    };
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-auto text-white">
      {/* Blurry Preview */}
      <div className="fixed w-screen h-screen inset-0 blurry-prev -z-10">
        <img
          src={galleryItems[0].imageurl}
          alt="Blurry Preview"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 backdrop-blur-[80px] bg-black/30"></div>
      </div>

      {/* Site Info / Product Details */}
      <div className="relative flex flex-[0.75] flex-col justify-center p-4 border-r border-white/10">
        <div className="relative flex flex-col items-center">
          {/* Hover Image */}
          <img
            src={galleryItems[activeIndex].hoverUrl}
            alt="Coffee Doodle"
            className="absolute z-10 w-[250px] h-[250px] object-contain pointer-events-none transition-opacity duration-300 ease-in-out"
            style={{ 
              opacity: isHovering ? 1 : 0,
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />
          
          {/* Canvas wrapper */}
          <div
            className="transition-opacity duration-800 ease-in-out"
            style={{ opacity: isLoading ? 0 : 1 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Canvas
              style={{ width: '250px', height: '250px' }}
              camera={{ position: [0, 0, 12] }}
            >
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <CoffeeOBJ texturePath={activeTexture} scale={[0.5, 0.5, 0.5]} />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 2}
              />
            </Canvas>
          </div>
          
          {/* Product Details Container */}
          <div className="w-[300px] space-y-4 p-0">
            {/* Price */}
            <div className="text-center text-lg font-medium">
              {galleryItems[activeIndex].price}
            </div>

            {/* Dropdown Menus */}
            <div className="space-y-3">
              <select 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2 bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
              >
                <option value="250g">250g</option>
                <option value="500g">500g</option>
                <option value="1kg">1kg</option>
              </select>

              <select 
                value={grindType}
                onChange={(e) => setGrindType(e.target.value)}
                className="w-full p-2 bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
              >
                <option value="Whole Bean">Whole Bean</option>
                <option value="Espresso">Espresso</option>
                <option value="Filter">Filter</option>
                <option value="French Press">French Press</option>
              </select>

              {/* Add to Cart Button */}
              <button 
                onClick={() => {
                  console.log(`Added ${quantity} of ${grindType} ${galleryItems[activeIndex].title} to cart`);
                }}
                className="w-full py-2 px-4 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors duration-200"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Preview */}
      <div className="relative flex-[1.75] p-4 pb-8 project-preview mx-auto bg-black/20 backdrop-blur-sm overflow-y-auto"></div>

      {/* Gallery */}
      <div className="relative z-10 flex flex-col gap-3 overflow-y-auto h-full p-4 bg-black/30 border-l border-white/10 backdrop-blur-md gallery w-[300px]">
        {/* Gallery items will be populated here */}
      </div>
    </div>
  );
};

export default OurCoffees;
