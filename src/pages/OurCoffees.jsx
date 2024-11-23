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
      logo.className = "w-48 mb-4 mx-auto";

      const info = document.createElement("div");
      info.className =
        "text-xs space-y-2 font-light leading-5 max-h-40 overflow-y-auto";

      // Create formatted content
      info.innerHTML = `
        <p class="mb-2">${item.copy}</p>
        <p class="text-sm font-medium">${item.price}</p>
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
        "w-full h-[240px] max-h-[350px] overflow-hidden rounded-lg"; // Fixed height for image container

      const projectImg = document.createElement("img");
      projectImg.src = item.imageurl;
      projectImg.alt = `${item.title} Preview`;
      projectImg.className = "h-full w-96 mx-auto my-auto object-cover"; // Image fits within fixed dimensions

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

      {/* Site Info */}
      <div className="relative flex flex-1 flex-col justify-center p-4 border-r border-white/10">
        <div 
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <img
            src={galleryItems[activeIndex].hoverUrl}
            alt="Coffee Doodle"
            className="absolute inset-0 z-10 w-[300px] h-[350px] object-contain pointer-events-none transition-opacity duration-300 ease-in-out"
            style={{ 
              top: '-50px',
              opacity: isHovering ? 1 : 0
            }}
          />
          
          {/* Updated Canvas wrapper with transition */}
          <div
            className="transition-opacity duration-800 ease-in-out"
            style={{ opacity: isLoading ? 0 : 1 }}
          >
            <Canvas
              style={{ width: '300px', height: '350px', position: 'relative', margin: '0', top: '-50px' }}
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
        </div>
      </div>

      {/* Project Preview */}
      <div className="relative flex-[2] p-4 project-preview space-y-4 bg-black/20 backdrop-blur-sm"></div>

      {/* Gallery */}
      <div className="relative z-10 flex flex-col gap-3 overflow-y-auto h-full p-4 bg-black/30 border-l border-white/10 backdrop-blur-md gallery w-[300px]">
        {/* Gallery items will be populated here */}
      </div>
    </div>
  );
};

export default OurCoffees;
