import React, { useState } from "react";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import { Outlet } from "react-router-dom";
import SignUpModal from "./components/SignupModal/SignupModal.jsx";

function Layout() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Header onSignUpClick={openModal} />
      <main className={`${isModalOpen ? "blur-sm" : ""}`}>
        <Outlet />
      </main>
      <Footer />
      {isModalOpen && <SignUpModal onClose={closeModal} />}
    </>
  );
}

export default Layout;
