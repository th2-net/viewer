import { FormControl, InputLabel, Select, OutlinedInput, Box, Chip, MenuItem, SelectChangeEvent, Theme, useTheme } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react"

interface ISchemaSelectProps {
  isVisible: boolean,
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const SchemaSelect = (props: ISchemaSelectProps) => {
  type checkSchemaResult = [isBackendRunning: boolean, result: string];

  const [schemas, setSchemas] = useState<string[] | undefined>();
  const [runningSchemas, setRunningSchemas] = useState<string[] | undefined>();

  const getSchemas = () => {
    fetch("http://de-th2-qa:30000/editor/backend/schemas")
      .then(response => response.json())
      .then(res => setSchemas(res))
  }

  const checkSchema = (schemaName: string): Promise<any | checkSchemaResult> => {
    return fetch(`http://de-th2-qa:30000/th2-${schemaName}/`)
      .then(response => {
        console.log("first then");
        if (response.ok) {
          return response.json();
        }
        throw new Error(`${response.status}`);
      })
      .then(res => {
        console.log("success");
        return [true, res];
      })
      .catch(err => {
        // console.log(err);
        return [false, err];
      })
  }

  const setFunctionalSchemas = () => {
    let promiseArr = [];
    let funcSchemaArr: any[] = [];
    if (!schemas) {
      return [];
    }
    for (let i = 0; i < schemas.length; i++) {
      promiseArr.push(checkSchema(schemas[i]).then((res) => funcSchemaArr.push(res)));
    }
    Promise.all(promiseArr).then(() => {
      console.log("THIS IS THE ENDGAME");
      console.log(funcSchemaArr);
      setRunningSchemas(funcSchemaArr);
    });
  }

  useEffect(() => getSchemas(), []);
  useEffect(() => {
    setFunctionalSchemas();
    console.log(runningSchemas)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemas])

  function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        {/* the word schema below doesn't fit in the border */}
        <InputLabel id="demo-multiple-chip-label">Schema</InputLabel> 
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {runningSchemas && runningSchemas.map((schema) => (
            <MenuItem
              key={schema}
              value={schema}
              style={getStyles(schema, personName, theme)}
            >
              {1}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}


export default SchemaSelect;

//import ReportIcon from '@mui/icons-material/Report';