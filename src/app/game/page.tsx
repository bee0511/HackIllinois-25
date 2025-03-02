"use client";

import React, { Component } from "react";
import Navbar from "../../components/game/Navbar";
import MapContainer from "@/components/game/MapContainer";

class Home extends Component {
  render() {
    return <>
      <Navbar />
      <MapContainer />
    </>;
  }
}

export default Home;