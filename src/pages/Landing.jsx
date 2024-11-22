import React from 'react'
import ReactDOM from 'react-dom/client';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
// import Background from '../assets/images/CatandCloud Bags.png';
import Experience from '../models/Experience';



const Landing = () => {
  return (
    <section className="w-screen h-screen">
      {/* <div className="max-w-full mx-auto object-cover ">
      <img className="max-w-full max-h-full object-cover" src={Background}/>
      </div> */}

      {/* render 3D text and "Donuts" */}

      <Canvas
        className="w-full h-full"
        camera={ {
            fov: 45,
            near: 0.1,
            far: 200,
            position: [ 5, 2, 8 ]
        } }
        gl={{ clearColor: 'white' }}
    >
        <Experience />
    </Canvas>

    </section>
  );
}

export default Landing;
