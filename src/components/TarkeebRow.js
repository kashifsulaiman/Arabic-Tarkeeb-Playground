import { useState, useEffect } from 'react'
import Xarrow from "react-xarrows";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Remove from '@mui/icons-material/Remove';
import Add from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/system';
import ToggleButton from '@mui/material/ToggleButton';
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
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

const GrayCircleClearIcon = styled('div')({
  backgroundColor: 'gray',
  width: 24,
  height: 24,
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  color: 'white',
});

function TarkeebRow({ editMode: allEditMode, inputSize, updateRows, index: rowIndex, row, totalRows, deleteRow }) {
  const [QuranMetaData, setQuranMetaData] = useState([])
  const [surah, setSurah] = useState()
  const [ayah, setAyah] = useState()
  const [inputs, setInputs] = useState(row)
  const [rowsLength, setRowsLength] = useState(totalRows)
  const [editMode, setEditMode] = useState(allEditMode)
  const [currentInput, setCurrentInput] = useState()
  const [linkStartIndex, setLinkStartIndex] = useState(null)
  const [timer, setTimer] = useState(true)
  const [loading, setLoading] = useState(!!row.length)

  useEffect(() => {
    updateRows(inputs, rowIndex)
    setTimeout(() => {
      addDynamicHeight()
    }, 1200)
  }, [inputs])

  useEffect(() => {
    if (totalRows < rowsLength) {
      setInputs(row)
      setRowsLength(totalRows)
    }
  }, [totalRows])

  useEffect(() => {
    setEditMode(allEditMode)
  }, [allEditMode])

  useEffect(() => {
    if (timer) {
      //added for child arrow generation
      setTimeout(() => {
        setTimer(false)
        setLoading(false)
      }, 1000)
    }
  }, [timer])

  useEffect(() => {
    getQuranMetaData()
  }, [])

  useEffect(() => {
    getAyahData()
  }, [ayah])
  
  
  const getQuranMetaData = async () => {
    const response = await fetch('http://api.alquran.cloud/v1/meta')
    const QuranData = await response.json()
    setQuranMetaData(QuranData.data.surahs.references)
  }

  const getAyahData = async () => {
    const response = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranacademy/${surah}/${ayah}.json`)
    const ayahData = await response.json()
    onPaste(false, ayahData.text)
  }

  const addDynamicHeight = () => {
    const container = document.getElementById(`inputs-container-${rowIndex}`);
    if (!container) return
    const arrows = document.querySelectorAll(`.xarrow-${rowIndex}`);

    let totalHeight = 0;

    arrows.forEach(arrow => {
      let top
      if (arrow.className.includes('link')) {
        const arrowRect = arrow.getBoundingClientRect();
        top = arrowRect.top
      } else {
        top = arrow.offsetTop
      }
      totalHeight = Math.max(totalHeight, top);
    });

    container.style.height = totalHeight ? `${totalHeight + 200}px` : 'auto'
  }

  const onPaste = (e, dataFromApi) => {
    let text = dataFromApi || (e.clipboardData || window.clipboardData).getData("text");
    text = text.trim().split(" ");

    const newInputs = []

    text.map(item => {
      newInputs.push({ columns: [], value: item })
    })
    setInputs(newInputs)
    e && e.preventDefault()
  };

  const deleteInput = (index) => {
    const tempInputs = [...inputs]
    tempInputs.splice(index, 1)
    setInputs(tempInputs)
  }

  const updateInput = (e, index, isLink, isChild) => {
    const tempInputs = [...inputs]
    const value = isLink ? isChild ? 'childLinkValue' : 'linkValue' : 'value'
    tempInputs[index][value] = e.target.value
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
    tempInputs.splice(index, 0, { columns: [], value: '' })
    setInputs(tempInputs)
  }

  const getLeftBorderClass = (index) => {
    return !editMode && index !== inputs.length - 1 && 'left-border'
  }

  const getRightBorderClass = (index) => {
    return !editMode && index !== 0 && 'right-border'
  }

  const getIndexFromId = (id) => {
    const splittedId = id.split('-')
    return splittedId[splittedId.length - 1]
  }

  const addLink = (id, child) => {
    const tempInputs = [...inputs]
    const indexFromId = getIndexFromId(id)
    const input = tempInputs[linkStartIndex ? getIndexFromId(linkStartIndex) : indexFromId]
    if (!linkStartIndex) {
      if (child) {
        input.childLinkStart = id
        input.childLinkEnd = ''
      } else {
        input.linkStart = id
        input.linkEnd = ''
      }
      setLinkStartIndex(id)
    } else if (linkStartIndex === id) {
      if (child) {
        delete input.childLinkStart
      } else {
        delete input.linkStart
      }
      setLinkStartIndex(null)
    } else {
      const linkIndexNewExists = linkStartIndex.includes('new')
      if ((child && linkIndexNewExists) || linkIndexNewExists) {
        input.childLinkEnd = id
      } else {
        input.linkEnd = id
      }
      setLinkStartIndex(null)
    }
    setInputs(tempInputs)
  }

  const inputElements = inputs.map((_, index) => {
    const { linkStart, linkEnd, linkValue, childLinkStart, childLinkEnd, childLinkValue } = _
    const linkEndNewExists = linkEnd?.includes('new')
    return <div className={`input-elements ${!editMode && 'padding'} ${getRightBorderClass(index)} ${getLeftBorderClass(index)}`}>
      {!editMode ?
        <>
          <p style={{ fontSize: inputSize }}>{inputs[index].value}</p>
          {_.columns.map((column, colIndex) => {
            const lastColumn = colIndex === _.columns.length - 1
            return <>
              {(linkEndNewExists && !timer || !linkEndNewExists) && linkStart && linkEnd && lastColumn && <Xarrow
                start={linkStart} //can be react ref
                end={linkEnd} //or an id
                startAnchor={'bottom'}
                endAnchor={'bottom'}
                curveness={0}
                _cpy1Offset={180}
                _cpy2Offset={200}
                path='straight'
                animateDrawing={0.8}
                showHead={false}
                labels={
                  <p id={`row-${rowIndex}-link-new-${index}`}
                    className={`xarrow-${rowIndex} link`}
                    style={{ position: 'relative', top: 50, border: linkValue ? '1px solid black' : '', backgroundColor: 'white', width: 200 }}>{linkValue}</p>
                }
              />}
              {!timer && childLinkStart && childLinkEnd && lastColumn && <Xarrow
                start={childLinkStart} //can be react ref
                end={childLinkEnd} //or an id
                curveness={0}
                startAnchor={'bottom'}
                endAnchor={'bottom'}
                _cpy1Offset={180}
                _cpy2Offset={200}
                color='orange'
                animateDrawing={0.8}
                showHead={false}
                labels={
                  <p style={{ position: 'relative', top: 50, border: childLinkValue ? '1px solid black' : '', backgroundColor: 'white', width: 200 }}>{childLinkValue}</p>
                }
              />}
              <p
                id={lastColumn && `row-${rowIndex}-link-${index}`}
                className={`xarrow-${rowIndex} link`}
                style={{ fontSize: inputSize, color: 'green' }}>
                {column.value}
              </p>
            </>
          })}
        </>
        :
        <>
          <Button onClick={() => deleteInput(index)} component="label" variant="contained">
            <Remove />
          </Button>
          <div className='input-plus-container'>
            <TextField
              onPaste={(e) => index === 0 && onPaste(e, index)}
              label={`خانہ # ${index + 1}`}
              id={index + 1}
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
            {index !== 0 && index < inputs.length && <GrayCircleClearIcon
              style={{ width: inputSize, height: inputSize }}
              onClick={() => addInputAfter(index)}
            >
              <Add style={{ fontSize: inputSize }} />
            </GrayCircleClearIcon>}
          </div>

          {_.columns.map((column, colIndex) => {
            return <div className='sub-inputs'>
              <TextField
                label={`خانہ # ${index + 1}.${colIndex + 1}`}
                id={`${index + 1}.${colIndex + 1}`}
                margin="normal"
                color="secondary"
                className={`input animate xarrow-${rowIndex}`}
                variant="outlined"
                value={column.value}
                style={{ width: inputSize * (currentInput === `${index}.${colIndex}` ? 8 : 4) + 'px', heigth: inputSize + 30 + 'px' }}
                onChange={(e) => updateColInput(e, index, colIndex)}
                onFocus={() => setCurrentInput(`${index}.${colIndex}`)}
                onBlur={() => setCurrentInput()}
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
          {(linkEndNewExists && !timer || !linkEndNewExists) && linkStart && linkEnd && <Xarrow
            start={linkStart} //can be react ref
            end={linkEnd} //or an id
            path='straight'
            animateDrawing={0.8}
            startAnchor={'bottom'}
            endAnchor={'bottom'}
            curveness={0}
            _cpy1Offset={180}
            _cpy2Offset={200}
            showHead={false}
            path='straight'
            labels={<>
              <TextField
                label={`خانہ`}
                margin="normal"
                color="secondary"
                className={`input animate xarrow-${rowIndex} link`}
                variant="outlined"
                value={linkValue}
                style={{ zIndex: 100, width: inputSize * (currentInput === `row-${rowIndex}-link-${index}` ? 8 : 4) + 'px', heigth: inputSize + 30 + 'px', background: 'white' }}
                onChange={(e) => updateInput(e, index, true)}
                onFocus={() => setCurrentInput(`row-${rowIndex}-link-${index}`)}
                onBlur={() => setCurrentInput()}
                inputProps={{ style: { fontSize: inputSize - 5 } }}
                InputLabelProps={{ style: { fontSize: inputSize - 3 } }} // font size of input label
              />
              <br />
              <ToggleButton
                id={`row-${rowIndex}-link-new-${index}`}
                value="check"
                selected={linkStartIndex === `row-${rowIndex}-link-new-${index}`}
                color='warning'
                onChange={() => addLink(`row-${rowIndex}-link-new-${index}`, true)}
              >
                Link
            </ToggleButton>
            </>
            }
          />}
          {!timer && childLinkStart && childLinkEnd && <Xarrow
            start={childLinkStart} //can be react ref
            end={childLinkEnd} //or an id
            path='straight'
            animateDrawing={0.8}
            startAnchor={'bottom'}
            endAnchor={'bottom'}
            curveness={0}
            color='orange'
            _cpy1Offset={180}
            _cpy2Offset={200}
            showHead={false}
            path='straight'
            labels={<>
              <TextField
                label={`خانہ`}
                margin="normal"
                color="secondary"
                className={`input animate xarrow-${rowIndex} link`}
                variant="outlined"
                value={childLinkValue}
                style={{ zIndex: 100, width: inputSize * (currentInput === `row-${rowIndex}-link-new-${index}` ? 8 : 4) + 'px', heigth: inputSize + 30 + 'px', background: 'white' }}
                onChange={(e) => updateInput(e, index, true, true)}
                onFocus={() => setCurrentInput(`row-${rowIndex}-link-new-${index}`)}
                onBlur={() => setCurrentInput()}
                inputProps={{ style: { fontSize: inputSize - 5 } }}
                InputLabelProps={{ style: { fontSize: inputSize - 3 } }} // font size of input label
              />
            </>
            }
          />}
          {!!_.columns.length && <ToggleButton
            id={`row-${rowIndex}-link-${index}`}
            value="check"
            selected={linkStartIndex === `row-${rowIndex}-link-${index}`}
            color='warning'
            onChange={() => addLink(`row-${rowIndex}-link-${index}`)}
          >
            Link
            </ToggleButton>}
        </>}
    </div>
  })

  const renderSurahDropdown = () => {
    return <FormControl sx={{ m: 1, minWidth: 80 }}>
    <InputLabel id="demo-simple-select-label">سورة</InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      disabled={!editMode}
      value={surah}
      label="سورة"
      onChange={e => setSurah(e.target.value)}
    >
      {QuranMetaData.map((surah, index) => <MenuItem value={index + 1}>{surah.name} ( {index + 1}</MenuItem>)}
    </Select>
  </FormControl>
  }

  const renderAyahDropdown = () => {
    const ayahs = new Array(QuranMetaData[surah - 1].numberOfAyahs).fill('')
    return <FormControl sx={{ m: 1, minWidth: 80 }}>
    <InputLabel id="demo-simple-select-label">آیت</InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      disabled={!editMode}
      value={ayah}
      label="آیت"
      onChange={e => setAyah(e.target.value)}
    >
      {ayahs.map((_, index) => <MenuItem value={index + 1}>{index + 1}</MenuItem>)}
    </Select>
  </FormControl>
  }

  return (
    <Card variant="outlined" className='outline'>
      <CardHeader
        action={
          <div className='row'>
            {surah && renderAyahDropdown()}
            {renderSurahDropdown()}
            <ToggleButton
              value="check"
              selected={editMode}
              onChange={() => {
                setEditMode(!editMode)
                setTimer(true)
              }}
            >
              <EditIcon />
            </ToggleButton>
            <IconButton aria-label="settings" onClick={() => deleteRow(rowIndex)}>
              <DeleteIcon />
            </IconButton>
          </div>
        }
        title={<u><h2>عبارت # {rowIndex + 1}</h2></u>}
      />
      <div className="blur-container">
        <div id={`inputs-container-${rowIndex}`} className='inputs-container animate-height'>
        {editMode && <Button onClick={addRowInput} component="label" variant="contained">
          <Add />
        </Button>}
          {inputElements.reverse()}
        </div>
        {loading && <div className="blur-background"></div>}
        {loading && <CircularProgress className="circular-progress" size={50} />}
      </div>
    </Card>
  );
}

export default TarkeebRow;
