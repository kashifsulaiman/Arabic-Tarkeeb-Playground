import { useState } from 'react'
import TextDecrease from '@mui/icons-material/TextDecrease';
import TextIncrease from '@mui/icons-material/TextIncrease';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import TarkeebRow from './components/TarkeebRow';
import Edit from '@mui/icons-material/EditSharp';
import Add from '@mui/icons-material/Add';
import './App.css';

function App() {
  const [rows, setRows] = useState([])
  const [editMode, setEditMode] = useState(true)
  const [inputSize, setInputSize] = useState(24)

  const deleteRow = (index) => {
    const tempRows = [...rows]
    tempRows.splice(index, 1)
    setRows(tempRows)
  }

  const addRow = () => {
    const tempRows = [...rows]
    tempRows.push([])
    setRows(tempRows)
  }

  const updateRows = (row, index) => {
    const tempRows = [...rows]
    tempRows[index] = row
    setRows(tempRows)
  }

  const save = () => {
    localStorage.setItem('data', JSON.stringify(rows))
  }

  const load = () => {
    const data = JSON.parse(localStorage.getItem('data'))
    setRows(data)
  }

  return (
    <div className="App">
      <header className="App-header">
        ِ<h1>الترکیب</h1>

        {<div className='row fixed'>
          <TextDecrease />
          <Slider min={10} max={40} valueLabelDisplay="on" aria-label="Volume" value={inputSize} onChange={e => setInputSize(e.target.value)} />
          <TextIncrease />

          <ToggleButton
            value="check"
            selected={editMode}
            onChange={() => {
              setEditMode(!editMode)
            }}
          >
            <Edit style={{ color: 'white' }}/>
          </ToggleButton>
          <Button onClick={() => save()} component="label" variant="contained">
            SAVE
          </Button>
          <Button onClick={() => load()} component="label" variant="contained">
            LOAD
          </Button>
        </div>}

        {rows.map((item, index) => {
          return <div class='row-container'>
              <TarkeebRow
                editMode={editMode}
                inputSize={inputSize}
                index={index}
                updateRows={updateRows}
                row={item} 
                totalRows={rows.length}
                deleteRow={deleteRow}
              />
          </div>
        })}
        <Button onClick={() => addRow()} component="label" variant="contained">
          <Add />
        </Button>
      </header>
    </div>
  );
}

export default App;
