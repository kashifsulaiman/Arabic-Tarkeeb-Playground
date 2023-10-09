import { useState, useRef, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Remove from '@mui/icons-material/Remove';
import Add from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/system';
import '../App.css';

const RedCircleClearIcon = styled('div')({
  backgroundColor: 'red',
  width: 24,
  height: 24,
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  color: 'white'
});

const BlueCircleClearIcon = styled('div')({
  backgroundColor: '#1665C0',
  width: 24,
  height: 24,
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  color: 'white',
});

function TarkeebRow({ editMode, inputSize, updateRows, index, row, totalRows }) {
  const [inputs, setInputs] = useState(row)
  const [rowsLength, setRowsLength] = useState(totalRows)

  useEffect(() => {
    updateRows(inputs, index)
  }, [inputs])

  useEffect(() => {
    if (totalRows < rowsLength) {
      setInputs(row)
      setRowsLength(totalRows)
    }
  }, [totalRows])

  const onPaste = (e) => {
    let paste = (e.clipboardData || window.clipboardData).getData("text");
    paste = paste.trim().split(" ");

    const newInputs = []

    paste.map(item => {
      newInputs.push({ columns: [], value: item })
    })
    setInputs(newInputs)
    e.preventDefault()
  };

  const deleteInput = (index) => {
    const tempInputs = [...inputs]
    tempInputs.splice(index, 1)
    setInputs(tempInputs)
  }

  const updateInput = (e, index) => {
    const tempInputs = [...inputs]
    tempInputs[index].value = e.target.value
    setInputs(tempInputs)
  }

  const updateColInput = (e, index, colIndex) => {
    const tempInputs = [...inputs]
    tempInputs[index].columns[colIndex].value = e.target.value
    setInputs(tempInputs)
  }

  const addRowInput = () => {
    setInputs([...inputs, { columns: [], value: '' }])
  }

  const addColInput = (index) => {
    const tempInputs = [...inputs]
    tempInputs[index].columns.push({ value: '' })
    setInputs(tempInputs)
  }

  const deleteInputCol = (index, colIndex) => {
    const tempInputs = [...inputs]
    tempInputs[index].columns.splice(colIndex, 1)
    setInputs(tempInputs)
  }

  const addInputAfter = (index) => {
    const tempInputs = [...inputs]
    tempInputs.splice(index + 1, 0, { columns: [], value: '' })
    setInputs(tempInputs)
  }

  const inputElements = inputs.map((_, index) => {
    return <div class='input-elements'>
      {!editMode ?
        <>
          <p style={{ fontSize: inputSize }}>{inputs[index].value}</p>
          {_.columns.map((column) => {
            return <p style={{ fontSize: inputSize, color: 'green' }}>{column.value}</p>
          })}
        </>
        :
        <>
          <Button onClick={() => deleteInput(index)} component="label" variant="contained">
            <Remove />
          </Button>
          <div>
            <TextField
              onPaste={(e) => index === 0 && onPaste(e, index)}
              label={`خانہ # ${index + 1}`}
              margin="normal"
              color="secondary"
              className="input"
              variant="outlined"
              value={inputs[index].value}
              style={{ width: inputSize * 5 + 'px', margin: 10 }}
              onChange={(e) => updateInput(e, index)}
              inputProps={{ style: { fontSize: inputSize } }}
              InputLabelProps={{ style: { fontSize: inputSize - 3 } }} // font size of input label
            />
            {index < inputs.length - 1 && <BlueCircleClearIcon
              style={{ width: inputSize, height: inputSize, position: 'relative', top: -60, right: 10 }}
              onClick={() => addInputAfter(index)}
            >
              <Add style={{ fontSize: inputSize }} />
            </BlueCircleClearIcon>}
          </div>

          {_.columns.map((column, colIndex) => {
            return <div className='sub-inputs'>
              <TextField
                label={`خانہ # ${index + 1}.${colIndex + 1}`}
                margin="normal"
                color="secondary"
                className="input"
                variant="outlined"
                value={column.value}
                style={{ width: inputSize * 4 + 'px', heigth: inputSize + 30 + 'px' }}
                onChange={(e) => updateColInput(e, index, colIndex)}
                inputProps={{ style: { fontSize: inputSize - 5 } }}
                InputLabelProps={{ style: { fontSize: inputSize - 3 } }} // font size of input label
              />
              <RedCircleClearIcon
                style={{ width: inputSize, height: inputSize, position: 'relative', top: -18, right: 10 }}
                onClick={() => deleteInputCol(index, colIndex)}
              >
                <ClearIcon style={{ fontSize: inputSize }} />
              </RedCircleClearIcon>
            </div>
          })}

          <Button className='checks' onClick={() => addColInput(index)} component="label" variant="contained">
            <Add />
          </Button>


        </>}
    </div>
  })

  return (
    <div className='inputs-container'>
      {editMode && <Button onClick={addRowInput} component="label" variant="contained">
        <Add />
      </Button>}
      {inputElements.reverse()}
    </div>
  );
}

export default TarkeebRow;
