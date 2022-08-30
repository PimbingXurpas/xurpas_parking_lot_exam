import { Layout } from "antd";
import React from "react";
import SideNav from "./Components/SideNav";
import NearestEntrance from "./Pages/NearestEntrance";
import ParkingSlot from "./Pages/ParkingSlot";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Ticket from "./Pages/Ticket/Ticket";

const siteMap = [
  {
    title: "",
    path: "/",
  },
  {
    title: "Parking Slot",
    path: "/parking-slot",
    element: <ParkingSlot />,
  },
  {
    title: "Nearest Entrance",
    path: "/nearest-entrance",
    element: <NearestEntrance />,
  },
  {
    title: "Ticket",
    path: "/ticket",
    element: <Ticket />,
  },
];
function App() {
  return (
    <Layout>
      <BrowserRouter>
        <SideNav navList={siteMap}>
          <Routes>
            {siteMap.map((item: any, i: any) => (
              <Route key={i} path={item.path} element={item.element} />
            ))}
          </Routes>
        </SideNav>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
