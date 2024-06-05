import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, ref, onValue } from "./firebaseConf.jsx";
import { FaHeart, FaLink, FaCoffee, FaLinkedin, FaGithub, FaApple, FaAndroid } from "react-icons/fa";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const icons = {
  FaHeart: <FaHeart />,
  FaLink: <FaLink />,
  FaCoffee: <FaCoffee />,
  FaApple: <FaApple />,
  FaAndroid: <FaAndroid />,
  FaLinkedin: <FaLinkedin />,
  FaGithub: <FaGithub />,
};

const HomePage = () => {
  const [profilePic, setProfilePic] = useState("");
  const [nickname, setNickname] = useState("");
  const [links, setLinks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const profilePicRef = ref(db, "profile/profilePic");
    onValue(profilePicRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProfilePic(data.url);
      }
    });

    const nicknameRef = ref(db, "profile/nickname");
    onValue(nicknameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setNickname(data.nickname);
      }
    });

    const linksRef = ref(db, "links");
    onValue(linksRef, (snapshot) => {
      const linksData = [];
      snapshot.forEach((childSnapshot) => {
        linksData.push({ key: childSnapshot.key, ...childSnapshot.val() });
      });
      linksData.sort((a, b) => a.order - b.order);
      setLinks(linksData);
    });
  }, []);

  const renderIcon = (iconName) => {
    return icons[iconName];
  };

  const formatUrl = (url) => {
    if (url.startsWith("mailto:")) {
      return url;
    }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `http://${url}`;
    }
    return url;
  };

  const goToAdminPage = () => {
    navigate("/panel");
  };

  return (
    <div className="container">
      <div className="column">
        <div className="pf-border">
          <img className="pf" src={profilePic} alt="Profile" />
        </div>
        <div className="nick">{nickname}</div>
        {links.map(({ key, name, url, icon }) => (
          <a key={key} href={formatUrl(url)} className="button">
            {renderIcon(icon)}
            <div className="link-name">{name}</div>
          </a>
        ))}
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        {/* <button onClick={goToAdminPage} className="admin-button">Admin Page</button> */}
      </div>
    </div>
  );
};

export default HomePage;
