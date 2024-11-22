import { memo, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import CoffeeBag, { CoffeeOBJ } from './Coffeebag';
import { OrbitControls } from '@react-three/drei';

const Loader = memo(() => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-[#e6e6e6] border-t-transparent rounded-full animate-spin"></div>
  </div>
));

const ProductInfo = memo(() => (
  <div className="w-full text-sm text-[#e6e6e6] leading-relaxed text-left">
    $11.25/lb || $7.78/10oz || $24.75/Kilo || $56.25/5lb<br/><br/>
    
    Our flagship blend does double duty for both brewed coffee and espresso applications. 
    Pronounced fruit, chocolate, and caramel notes from three separate origins make for a 
    coffee that's incredibly intricate, yet roasted to be beautifully balanced. You can 
    dig in and analyze it, or just turn your brain off and enjoy it. In milk based drinks 
    The Answer melts into pure caramel and butterscotch, with hints of fruit peeking around 
    the corner. We've been working on this one for a while and are incredibly proud of what 
    we've created together.<br/><br/>
    
    Origin // Colombia, Brazil, Ethiopia <br/>
    Region // Huila, Mogiana, Yirgacheffe <br/>
    Farm // Various <br/>
    Variety // Caturra, Yellow Bourbon, Heirloom <br/>
    Elevation // 1,100-1,900 masl <br/>
    Process // Natural, Washed <br/>
    Flavor Notes // Caramel, Berries, Chocolate <br/>
    Espresso Preparation // 19.1 - 19.7 g's in, 31 - 34 g's out, 26 - 32 sec's
  </div>
));

const Scene = memo(({ texturePath }) => {
  // Create refs for both bags
  const leftBagRef = useRef();
  const rightBagRef = useRef();

  // Convert degrees to radians
  const LEFT_BAG_ANGLE = Math.PI/80; // 180 degrees
  const RIGHT_BAG_ANGLE = Math.PI+Math.PI/80; // 180 degrees

  // Set the rotation angles
  useFrame(() => {
    if (rightBagRef.current) {
      rightBagRef.current.rotation.y = -RIGHT_BAG_ANGLE;
      console.log('Right Bag:', rightBagRef.current.rotation.y);
    }
    if (leftBagRef.current) {
      leftBagRef.current.rotation.y = LEFT_BAG_ANGLE;
      console.log('Left Bag:', leftBagRef.current.rotation.y);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* First bag - rotate to π/3 */}
      <group position={[-4, 0, 0]} ref={leftBagRef}>
        <CoffeeOBJ texturePath={texturePath}/>
      </group>
      
      {/* Second bag - rotate to -π/3 */}
      <group position={[4, 0, 0]} ref={rightBagRef}>
        <CoffeeOBJ texturePath={texturePath}/>
      </group>
      
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        rotateSpeed={2}
        dampingFactor={0.02}
        enableDamping={true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  );
});

const Product = ({ 
  layout = 'left', 
  texturePath = '/images/Pack2.png',
  logoUrl = '/images/The Answer Logo.webp'
}) => {
  return (
    <div className="w-full bg-white flex justify-center items-center p-5">
      <div className={`flex flex-row w-full gap-8 max-w-7xl ${layout === 'right' ? 'flex-row-reverse' : ''}`}>
        {/* Content Section */}
        <div className="bg-[#0a192f] p-6 w-1/2 flex flex-col items-center relative z-10">
          <div className="flex justify-center w-full mb-4">
            <img 
              src={logoUrl} 
              alt="The Answer Logo" 
              className="max-w-[280px] w-full"
              loading="eager"
            />
          </div>
          <ProductInfo />
        </div>

        {/* Canvas Section - Adjusted camera position for wider view */}
        <div className="w-1/2 relative">
          <Canvas 
            camera={{ position: [0, 0, 25], fov: 45 }}
            dpr={[1, 2]}
            performance={{ min: 0.5 }}
            gl={{ clearColor: '#ffffff' }}
          >
            <Suspense fallback={<Loader />}>
              <Scene texturePath={texturePath}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default memo(Product);
