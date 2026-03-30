/*
Name: Sheyi Adepoju
Description: This seciton is used to setupt header and footer of the application this is where consistency will be moved throughout all pages and easily be importated and manipulated in one file
*/
import { Link } from "react-router-dom";
import logo from "./citycalgary.png";
function Layout({ children }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#f4f6f8",
      fontFamily: "Arial",
      width: "100%"
    }}>

      
      {/* NAVBAR */}
      <div style={{
        background: "#c8102e",
        color: "white",
        padding: "14px 30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        gap: 20
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          
          {/* logo */}
          <img
            src={logo}
            alt="Calgary"
            style={{ height: 75, objectFit: "contain" }}
          />


        </div>

          <span style={{
            fontSize: 18,
            fontWeight: "bold",
            letterSpacing: 0.5,
            marginLeft: "auto",
          }}>
            Pickleball Court Monitoring System
          </span>
      </div>

      {/* PAGE CONTENT */}
      <div style={{ flex: 1 }}>
        {children}
      </div>

      {/* FOOTER */}
      <div style={{
        background: "#c8102e",
        color: "white",
        padding: "18px",
        textAlign: "center",
        fontSize: 14,
        marginTop: 40
      }}>
        © Sheyi Adepoju - City of Calgary Pickleball Court Management System — Prototype System
      </div>

    </div>
  );
}



export default Layout;