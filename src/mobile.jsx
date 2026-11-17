import React, { useState } from "react";
import Prototype from "./Prototype";
import "./style.css";

export default function MobileApp() {
  const [route, setRoute] = useState("home");
  const [brand, setBrand] = useState("SATTVA");
  return (
    <main className="standalone-shell" aria-label="SATTVA / YOG">
      <Prototype route={route} setRoute={setRoute} brand={brand} setBrand={setBrand} />
    </main>
  );
}

