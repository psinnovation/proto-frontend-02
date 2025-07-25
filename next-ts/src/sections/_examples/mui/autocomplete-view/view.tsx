'use client';

import type { BoxProps } from '@mui/material/Box';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

import { CountrySelect } from 'src/components/country-select';

import { ComponentBox, ComponentLayout } from '../../layout';

// ----------------------------------------------------------------------

const OPTIONS = ['Option 1', 'Option 2'];
const COUNTRY_LABELS = ['Armenia', 'Australia', 'Bulgaria'];
const COUNTRY_CODES = ['AR', 'DE', 'BM'];

// ----------------------------------------------------------------------

export function AutocompleteView() {
  const [inputValue, setInputValue] = useState('');

  const [value, setValue] = useState<string | null>(OPTIONS[0]);

  const [singleLabel, setSingleLabel] = useState<string | null>(COUNTRY_LABELS[0]);
  const [multiLabel, setMultiLabel] = useState<string[]>(COUNTRY_LABELS);

  const [singleCode, setSingleCode] = useState<string | null>(COUNTRY_CODES[0]);
  const [multiCode, setMultiCode] = useState<string[]>(COUNTRY_CODES);

  const DEMO_COMPONENTS = [
    {
      name: 'Combo box',
      component: (
        <ComponentBox>
          <Autocomplete
            fullWidth
            options={top100Films}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => <TextField {...params} label="Combo box" margin="none" />}
          />
        </ComponentBox>
      ),
    },
    {
      name: 'Controlled states',
      component: (
        <ComponentBox>
          <Autocomplete
            fullWidth
            value={value}
            options={OPTIONS}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            getOptionLabel={(option) => option}
            renderInput={(params) => <TextField {...params} label="Controllable" />}
          />

          <Typography variant="body2">{`value: ${value !== null ? `'${value}'` : 'null'}`}</Typography>
          <Typography variant="body2">{`inputValue: '${inputValue}'`}</Typography>
        </ComponentBox>
      ),
    },
    {
      name: 'Free solo',
      component: (
        <ComponentBox>
          <Autocomplete
            fullWidth
            freeSolo
            options={top100Films.map((option) => option.title)}
            getOptionLabel={(option) => option}
            renderInput={(params) => <TextField {...params} label="Free solo" />}
          />

          <Autocomplete
            fullWidth
            freeSolo
            disableClearable
            options={top100Films.map((option) => option.title)}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search input"
                slotProps={{ input: { ...params.InputProps, type: 'search' } }}
              />
            )}
          />
        </ComponentBox>
      ),
    },
    {
      name: 'Multiple values',
      component: (
        <ComponentBox>
          <Autocomplete
            fullWidth
            multiple
            limitTags={3}
            options={top100Films}
            getOptionLabel={(option) => option.title}
            defaultValue={top100Films.slice(0, 8)}
            renderInput={(params) => (
              <TextField {...params} label="Multiple select" placeholder="Favorites" />
            )}
            slotProps={{
              chip: {
                size: 'small',
                variant: 'soft',
              },
            }}
          />
        </ComponentBox>
      ),
    },
    {
      name: 'Checkboxes',
      component: (
        <ComponentBox>
          <Autocomplete
            fullWidth
            multiple
            limitTags={3}
            disableCloseOnSelect
            options={top100Films}
            getOptionLabel={(option) => option.title}
            defaultValue={top100Films.slice(0, 1)}
            renderInput={(params) => (
              <TextField {...params} label="Checkboxes" placeholder="Favorites" />
            )}
            renderOption={(props, option, state) => {
              const { key, ...otherProps } = props;

              return (
                <li key={key} {...otherProps}>
                  <Checkbox
                    size="small"
                    disableRipple
                    checked={state.selected}
                    slotProps={{
                      input: {
                        id: `${option.title}-checkbox`,
                        'aria-label': `${option.title} checkbox`,
                      },
                    }}
                  />
                  {option.title}
                </li>
              );
            }}
            slotProps={{
              chip: {
                size: 'small',
                variant: 'soft',
              },
            }}
          />
        </ComponentBox>
      ),
    },
    {
      name: 'Sizes',
      component: (
        <ComponentBox>
          <Autocomplete
            fullWidth
            options={top100Films}
            getOptionLabel={(option) => option.title}
            defaultValue={top100Films[13]}
            renderInput={(params) => (
              <TextField {...params} label="Size medium" placeholder="Favorites" />
            )}
          />

          <Autocomplete
            fullWidth
            multiple
            size="small"
            options={top100Films}
            getOptionLabel={(option) => option.title}
            defaultValue={[top100Films[13]]}
            renderInput={(params) => (
              <TextField {...params} label="Size small" placeholder="Favorites" />
            )}
            slotProps={{
              chip: {
                size: 'small',
                color: 'info',
                variant: 'soft',
              },
            }}
          />
        </ComponentBox>
      ),
    },
    {
      name: 'Country select',
      component: (
        <>
          <Box
            sx={{
              rowGap: 5,
              columnGap: 3,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' },
            }}
          >
            <ComponentBox title="Output label">
              <Box sx={{ gap: 1.5, width: 1, display: 'flex' }}>
                <CountrySelect
                  fullWidth
                  label="Single select label"
                  placeholder="Choose a country"
                  value={singleLabel}
                  onChange={(event, newValue) => setSingleLabel(newValue)}
                />
                <DisplayOutput value={singleLabel} />
              </Box>

              <Box sx={{ gap: 1.5, width: 1, display: 'flex' }}>
                <CountrySelect
                  multiple
                  fullWidth
                  limitTags={3}
                  label="Multi select label"
                  placeholder="Choose a country"
                  value={multiLabel}
                  onChange={(event, newValue) => setMultiLabel(newValue)}
                />
                <DisplayOutput value={multiLabel} />
              </Box>
            </ComponentBox>

            <ComponentBox title="Output code">
              <Box sx={{ gap: 1.5, width: 1, display: 'flex' }}>
                <CountrySelect
                  displayValue="code"
                  fullWidth
                  label="Single select code"
                  placeholder="Choose a country"
                  value={singleCode}
                  onChange={(event, newValue) => setSingleCode(newValue)}
                />
                <DisplayOutput value={singleCode} />
              </Box>

              <Box sx={{ gap: 1.5, width: 1, display: 'flex' }}>
                <CountrySelect
                  displayValue="code"
                  multiple
                  fullWidth
                  limitTags={3}
                  label="Multi select code"
                  placeholder="Choose a country"
                  value={multiCode}
                  onChange={(event, newValue) => setMultiCode(newValue)}
                />
                <DisplayOutput value={multiCode} />
              </Box>
            </ComponentBox>
          </Box>

          <ComponentBox
            title="Variants"
            sx={{
              mt: 5,
              rowGap: 5,
              columnGap: 3,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' },
            }}
          >
            <CountrySelect readOnly variant="outlined" label="Outlined" value={COUNTRY_CODES[1]} />
            <CountrySelect readOnly variant="filled" label="Filled" value={COUNTRY_CODES[1]} />
            <CountrySelect readOnly variant="standard" label="Standard" value={COUNTRY_CODES[1]} />
          </ComponentBox>
        </>
      ),
    },
  ];

  return (
    <ComponentLayout
      sectionData={DEMO_COMPONENTS}
      heroProps={{
        heading: 'Autocomplete',
        moreLinks: ['https://mui.com/material-ui/react-autocomplete/'],
      }}
    />
  );
}

// ----------------------------------------------------------------------

type DisplayOutputProps = BoxProps & {
  value: string | string[] | null;
};

function DisplayOutput({ value, sx, ...other }: DisplayOutputProps) {
  return (
    <Box
      sx={[
        {
          p: 1,
          width: 0.5,
          minHeight: 54,
          borderRadius: 1,
          display: 'flex',
          textAlign: 'right',
          typography: 'body2',
          flexDirection: 'column',
          bgcolor: 'background.neutral',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <small>Output</small>
      <strong>
        <small>{JSON.stringify(value)}</small>
      </strong>
    </Box>
  );
}

// ----------------------------------------------------------------------

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
  { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
  { title: 'Casablanca', year: 1942 },
  { title: 'City Lights', year: 1931 },
  { title: 'Psycho', year: 1960 },
  { title: 'The Green Mile', year: 1999 },
  { title: 'The Intouchables', year: 2011 },
  { title: 'Modern Times', year: 1936 },
  { title: 'Raiders of the Lost Ark', year: 1981 },
  { title: 'Rear Window', year: 1954 },
  { title: 'The Pianist', year: 2002 },
  { title: 'The Departed', year: 2006 },
  { title: 'Terminator 2: Judgment Day', year: 1991 },
  { title: 'Back to the Future', year: 1985 },
  { title: 'Whiplash', year: 2014 },
  { title: 'Gladiator', year: 2000 },
  { title: 'Memento', year: 2000 },
  { title: 'The Prestige', year: 2006 },
  { title: 'The Lion King', year: 1994 },
  { title: 'Apocalypse Now', year: 1979 },
  { title: 'Alien', year: 1979 },
  { title: 'Sunset Boulevard', year: 1950 },
  { title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', year: 1964 },
  { title: 'The Great Dictator', year: 1940 },
  { title: 'Cinema Paradiso', year: 1988 },
  { title: 'The Lives of Others', year: 2006 },
  { title: 'Grave of the Fireflies', year: 1988 },
  { title: 'Paths of Glory', year: 1957 },
  { title: 'Django Unchained', year: 2012 },
  { title: 'The Shining', year: 1980 },
  { title: 'WALL·E', year: 2008 },
  { title: 'American Beauty', year: 1999 },
  { title: 'The Dark Knight Rises', year: 2012 },
  { title: 'Princess Mononoke', year: 1997 },
  { title: 'Aliens', year: 1986 },
  { title: 'Oldboy', year: 2003 },
  { title: 'Once Upon a Time in America', year: 1984 },
  { title: 'Witness for the Prosecution', year: 1957 },
  { title: 'Das Boot', year: 1981 },
  { title: 'Citizen Kane', year: 1941 },
  { title: 'North by Northwest', year: 1959 },
  { title: 'Vertigo', year: 1958 },
  { title: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
  { title: 'Reservoir Dogs', year: 1992 },
  { title: 'Braveheart', year: 1995 },
  { title: 'M', year: 1931 },
  { title: 'Requiem for a Dream', year: 2000 },
  { title: 'Amélie', year: 2001 },
  { title: 'A Clockwork Orange', year: 1971 },
  { title: 'Like Stars on Earth', year: 2007 },
  { title: 'Taxi Driver', year: 1976 },
  { title: 'Lawrence of Arabia', year: 1962 },
  { title: 'Double Indemnity', year: 1944 },
  { title: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
  { title: 'Amadeus', year: 1984 },
  { title: 'To Kill a Mockingbird', year: 1962 },
  { title: 'Toy Story 3', year: 2010 },
  { title: 'Logan', year: 2017 },
  { title: 'Full Metal Jacket', year: 1987 },
  { title: 'Dangal', year: 2016 },
  { title: 'The Sting', year: 1973 },
  { title: '2001: A Space Odyssey', year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: 'Toy Story', year: 1995 },
  { title: 'Bicycle Thieves', year: 1948 },
  { title: 'The Kid', year: 1921 },
  { title: 'Inglourious Basterds', year: 2009 },
  { title: 'Snatch', year: 2000 },
  { title: '3 Idiots', year: 2009 },
  { title: 'Monty Python and the Holy Grail', year: 1975 },
];
