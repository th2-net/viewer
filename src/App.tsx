import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import './App.scss';

function App() {

  const [link, setLink] = useState();
  const [linkObj, setLinkObj] = useState();

  const getLinks = () => { 
    fetch('./links.json'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        return response.json();
      })
      .then(data => {
        console.log(data);
        setLinkObj(data?.links);
      });
  }

  useEffect(() => getLinks(), []);

  

  return (
    <>
      <header className="header">
        <div className="header__container">
          <div className="app-link" onClick={() => setLink(linkObj?.["dashboard"])}>Dashboard</div>
          <div className="app-link" onClick={() => setLink(linkObj?.["grafana"])}>Grafana</div>
          <div className="app-link" onClick={() => setLink(linkObj?.["rabbitMq"])}>RabbitMQ</div>
          <div className="app-link" onClick={() => setLink(linkObj?.["infraEditor"])}>Infra Editor</div>
        </div>
      </header>
      <iframe src={link} title="app window" className="iframe"/>
    </>
  );
}

export default App;