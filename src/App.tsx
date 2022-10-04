import { Box, Tabs, Tab } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import './App.scss';

function App() {

  const [link, setLink] = useState<string | undefined>();
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
        setLinkObj(data);
      });
  }

  useEffect(() => getLinks(), []);

  const handleChange = (event: React.SyntheticEvent, newValue: string | undefined) => {
    setLink(newValue);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
      p: 2
    };
  }

  return (
      <div className="container">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Dashboard" {...a11yProps(0)} value={linkObj?.["dashboard"]}  />
            <Tab label="Grafana" {...a11yProps(1)}  value={linkObj?.["grafana"]} />
            <Tab label="RabbitMQ" {...a11yProps(2)} value={linkObj?.["rabbitMq"]} />
            <Tab label="InfraEditor" {...a11yProps(3)} value={linkObj?.["infraEditor"]} />
          </Tabs>
        </Box>
        <iframe src={link} title="app window" className="iframe" id="Iframe"/>
      </div>
  );
}

export default App;