import InfoIcon from '@mui/icons-material/Info';
import { Popper, Fade, Box } from '@mui/material';
import { useEffect, useState } from 'react';

const InfoDropdown = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [result, setResult] = useState<undefined | any>(undefined);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? 'transition-popper' : undefined;

  const getLinks = () => {
    fetch(`http://de-th2-qa:30000/meta.json`)
      .then(response => response.json())
      .then(res => {
        setResult(res);
      })
      .catch(err => {
        setResult(err);
      })
  }
  console.log("INFODROPPER");
  useEffect(() => getLinks(), []);
  useEffect(() => console.log(result), [result]);

  return (
    <div>
      <button aria-describedby={id} type="button" onClick={handleClick}>
        <InfoIcon/>
      </button>
      <Popper id={id} open={open} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
              <h4>Schema repository:</h4>
              {result && result.infraMgr.git.repository}
              <h4>Docker registries</h4>
              {result && result["registries"].map((registry: string) => (
                <li>{registry}</li>
              ))}
            </Box>
          </Fade>
        )}
      </Popper>
    </div>
  );
}

export default InfoDropdown;