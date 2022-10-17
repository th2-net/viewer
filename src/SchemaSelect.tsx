import { FormControl, InputLabel, Select, OutlinedInput, Box, MenuItem, SvgIcon, IconButton, Tooltip, createTheme, CircularProgress } from "@mui/material";
import ReportIcon from '@mui/icons-material/Report';
import { useEffect, useState } from "react";
import './SchemaSelect.scss';
import { ThemeProvider } from "@mui/system";

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

export interface SchemaSelectProps<T> {
  schema: T | undefined,
  handleChange: (schema: T) => void
}

const SchemaSelect = (props: SchemaSelectProps<string>): JSX.Element => {
  type checkSchemaResult = [isBackendRunning: boolean, result: string, schemaUrl: string, schemaName: string];

  const [schemas, setSchemas] = useState<string[] | undefined>();
  const [runningSchemas, setRunningSchemas] = useState<string[] | undefined>();
  const [loading, setLoading] = useState<boolean | undefined>(true);

  const theme = createTheme({
    typography: {
      fontSize: 16,
    },
  });

  // get all the schemas, set them in state
  const getSchemas = () => {
    fetch("http://de-th2-qa:30000/editor/backend/schemas")
      .then(response => response.json())
      .then(res => setSchemas(res))
  }

  // check, whether a certain schema has a backend running.
  const checkSchema = (schemaName: string): Promise<any | checkSchemaResult> => {
    return fetch(`http://de-th2-qa:30000/th2-${schemaName}/`)
      .then(response => {
        if (response.ok) {
          return [true, 200, `http://de-th2-qa:30000/th2-${schemaName}/`, schemaName];
        }
        throw new Error(`${response.status}`);
      })
      .catch(err => {
        return [false, err.message, `http://de-th2-qa:30000/th2-${schemaName}/`, schemaName];
      })
  }

  const setFunctionalSchemas = () => {
    let promiseArr = [];
    let funcSchemaArr: any[] = [];
    if (!schemas) {
      return [];
    }
    for (let i = 0; i < schemas.length; i++) {
      // below is non-atomary way of adding to an array, which can lead to entry losses.
      promiseArr.push(checkSchema(schemas[i]).then((res) => funcSchemaArr.push(res)));
    }
    Promise.all(promiseArr).then(() => {
      // the below filter checks, that the schemas left return either with 200 or 500 code
      funcSchemaArr = funcSchemaArr.filter((schema) => schema[0]===true || `${schema[1]}`.match(serverErrorPattern));
      funcSchemaArr.sort(function(schema1, schema2) {
        if (schema1[0] > schema2[0]) {
          return -1;
        }
        if (schema1[0] < schema2[0]) {
          return 1;
        }
        return 0;
      });
      setLoading(false);
      setRunningSchemas(funcSchemaArr);
    });
  }

  const serverErrorPattern = /4\d{2}/;

  useEffect(() => getSchemas(), []);
  useEffect(() => {
    setFunctionalSchemas();
    console.log("runningSchemas");
    console.log(runningSchemas);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemas]);

  return (
    <div>
      {loading && <CircularProgress />}
      <FormControl sx={{ m: 1, width: 300 }}>
        {/* the word schema below doesn't fit in the border, also the options are a little shifted */}
        <InputLabel id="demo-multiple-chip-label">Schema</InputLabel> 
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          value={props.schema}
          onChange={(event) => props.handleChange(event.target.value[2])}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              <div>
                {selected[3]}
              </div>
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {runningSchemas && runningSchemas.map((schema) => ( 
            <MenuItem
              key={schema}
              value={schema}
              sx={{display: "flex", justifyContent: "space-between"}}
              className="schema-name"
            >
              <div>
                {schema[3]}
              </div>
              <ThemeProvider theme={theme}>
                {`${schema[1]}`.match(serverErrorPattern) && 
                    <Tooltip title="Server error" className="error-tooltip" placement="right"         
                      PopperProps={{
                        modifiers: [
                            {
                                name: "offset",
                                options: {
                                    offset: [0, -20],
                                },
                            },
                            {
                                name: "fontSize",
                                options: {
                                    offset: [0, -20],
                                },
                            },
                        ],
                    }}>
                      <IconButton>
                        <ReportIcon />
                      </IconButton>
                    </Tooltip>
                }
              </ThemeProvider>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}


export default SchemaSelect;
