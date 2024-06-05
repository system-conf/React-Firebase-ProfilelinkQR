import React, { useState, useEffect } from "react";
import {
  db,
  storage,
  ref,
  set,
  onValue,
  push,
  remove,
  update,
  storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "./firebaseConf.jsx";
import {
  FaHeart,
  FaLink,
  FaCoffee,
  FaLinkedin,
  FaGithub,
  FaApple,
  FaAndroid,
} from "react-icons/fa";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [profilePic, setProfilePic] = useState("");
  const [nickname, setNickname] = useState("");
  const [links, setLinks] = useState([]);
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkAddress, setNewLinkAddress] = useState("");
  const [newLinkIcon, setNewLinkIcon] = useState("FaLink");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const profilePicRef = ref(db, "profile/profilePic");
    onValue(profilePicRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProfilePic(data.url);
        setPreview(data.url);
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const previewURL = URL.createObjectURL(selectedFile);
    setPreview(previewURL);
  };

  const handleUpload = async () => {
    if (file) {
      const profilePicsRef = storageRef(storage, "profilePics/");
      const list = await listAll(profilePicsRef);
      for (const item of list.items) {
        await deleteObject(item);
      }

      const newImageRef = storageRef(storage, `profilePics/${file.name}`);
      await uploadBytes(newImageRef, file);
      const fileURL = await getDownloadURL(newImageRef);
      setProfilePic(fileURL);
      const profilePicRef = ref(db, "profile/profilePic");
      await set(profilePicRef, { url: fileURL });
      setFile(null);
      setPreview(fileURL);
    }
  };

  const handleNicknameChange = async () => {
    const nicknameRef = ref(db, "profile/nickname");
    await set(nicknameRef, { nickname });
  };

  const addLink = async () => {
    const linksRef = ref(db, "links");
    const order = links.length;
    const newLinkData = {
      name: newLinkName,
      url: newLinkAddress,
      icon: newLinkIcon,
      order,
    };
    await push(linksRef, newLinkData);
    setNewLinkName("");
    setNewLinkAddress("");
    setNewLinkIcon("FaLink");
  };

  const removeLink = async (key) => {
    const linkRef = ref(db, `links/${key}`);
    await remove(linkRef);
  };

  const moveLinkUp = async (index) => {
    if (index > 0) {
      const newLinks = [...links];
      const temp = newLinks[index - 1];
      newLinks[index - 1] = newLinks[index];
      newLinks[index] = temp;
      await updateLinksOrder(newLinks);
      setLinks(newLinks);
    }
  };

  const moveLinkDown = async (index) => {
    if (index < links.length - 1) {
      const newLinks = [...links];
      const temp = newLinks[index + 1];
      newLinks[index + 1] = newLinks[index];
      newLinks[index] = temp;
      await updateLinksOrder(newLinks);
      setLinks(newLinks);
    }
  };

  const updateLinksOrder = async (updatedLinks) => {
    const updates = {};
    updatedLinks.forEach((link, index) => {
      updates[`links/${link.key}/order`] = index;
    });
    await update(ref(db), updates);
  };

  const updateLink = async (key, newName, newUrl) => {
    const linkRef = ref(db, `links/${key}`);
    await update(linkRef, { name: newName, url: newUrl });
  };

  const updateLinkIcon = async (key, newIcon) => {
    const linkRef = ref(db, `links/${key}`);
    await update(linkRef, { icon: newIcon });
  };

  const icons = {
    FaHeart: <FaHeart />,
    FaLink: <FaLink />,
    FaCoffee: <FaCoffee />,
    FaApple: <FaApple />,
    FaAndroid: <FaAndroid />,
    FaLinkedin: <FaLinkedin />,
    FaGithub: <FaGithub />,
  };

  const renderIcon = (iconName) => {
    return icons[iconName];
  };

  return (
    <div className="admin-panel">
      <div className="profile-section">
      <div className="pf-border pf-border-fix">
        {preview && (
          <img src={preview} alt="Profile Preview" className="profile-image" />
        )}
        </div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload Profile Picture</button>

        <div className="nickname-section">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <button onClick={handleNicknameChange}>Update Nickname</button>
        </div>
      </div>
      <div className="links-section">
        <ul>
          {links.map(({ key, name, url, icon }, index) => (
            <li key={key} className="link-item">
              {renderIcon(icon)}{" "}
              <span className="inputcontainer">
                <input
                className="updown"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setLinks((prevLinks) =>
                      prevLinks.map((link) =>
                        link.key === key ? { ...link, name: newName } : link
                      )
                    );
                    updateLink(key, newName, url);
                  }}
                />
                <br />
                <input
                className="updown"
                  type="text"
                  value={url}
                  onChange={(e) => {
                    const newUrl = e.target.value;
                    setLinks((prevLinks) =>
                      prevLinks.map((link) =>
                        link.key === key ? { ...link, url: newUrl } : link
                      )
                    );
                    updateLink(key, name, newUrl);
                  }}
                />
              </span>
              <div className="updowncontainer">
                <button className="updown" onClick={() => moveLinkUp(index)}>
                  Up
                </button>
                <button className="updown" onClick={() => moveLinkDown(index)}>
                  Down
                </button>
              </div>
              <div className="removecontainer">
                <button className="updown" onClick={() => removeLink(key)}>
                  Remove
                </button>
                <select
                  className="updown"
                  value={icon}
                  onChange={(e) => updateLinkIcon(key, e.target.value)}
                >
                  {Object.keys(icons).map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Link Name"
          value={newLinkName}
          onChange={(e) => setNewLinkName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Link Address"
          value={newLinkAddress}
          onChange={(e) => setNewLinkAddress(e.target.value)}
        />
        <select
          value={newLinkIcon}
          onChange={(e) => setNewLinkIcon(e.target.value)}
        >
          {Object.keys(icons).map((icon) => (
            <option key={icon} value={icon}>
              {icon}
            </option>
          ))}
        </select>
        <button onClick={addLink}>Add Link</button>
      </div>
    </div>
  );
};

export default AdminPanel;
