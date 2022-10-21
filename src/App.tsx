import { Box, Tabs, Tab } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import './App.scss';
import InfoDropdown from './components/InfoDropdown/InfoDropdown';
import SchemaSelect from './components/SchemaSelect/SchemaSelect';

function App() {

  const [link, setLink] = useState<string | undefined>();
  const [linkObj, setLinkObj] = useState();

  const getLinks = () => { 
    fetch('./links.json')
      .then(response =>
        response.json()
      )
      .then(data =>
        setLinkObj(data)
      );
  }

  useEffect(() => getLinks(), []);

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
      p: 2
    };
  }

  const handleChange = (event: React.SyntheticEvent, newValue: string | undefined) => {
    setLink(newValue);
  }
  

  return (
      <div>
        <nav className="container">
          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', flexDirection: "row", alignItems: "center" }}>
            <Tabs onChange={handleChange} aria-label="basic tabs example" >
              <Tab label="Dashboard" {...a11yProps(0)} value={linkObj?.["dashboard"]}  />
              <Tab label="Dashboard" {...a11yProps(0)} value={linkObj?.["dashboard"]}  />
              <Tab label="Grafana" {...a11yProps(1)}  value={linkObj?.["grafana"]} />
              <Tab label="RabbitMQ" {...a11yProps(2)} value={linkObj?.["rabbitMq"]} />
              <Tab label="Infra Editor" {...a11yProps(3)} value={linkObj?.["infraEditor"] } />
            </Tabs>
            <SchemaSelect handleChange={ value => setLink(value)} schema={link}/>
            <InfoDropdown/>
          </Box>
        </nav>
        <iframe src={link} title="app window" className="iframe" id="Iframe"/>
      </div>
  );
}

export default App;