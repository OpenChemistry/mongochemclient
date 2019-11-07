import React, { useRef } from 'react';

import { Dialog, Fab, withStyles, Button, Input, Typography } from '@material-ui/core';
import { Add, Cancel, CloudUpload, InsertDriveFile } from '@material-ui/icons';

import { isEmpty } from 'lodash-es';

const style = () => (
  {
    add: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginRight: '5px',
    },
    icon: {
      marginLeft: '5px'
    },
    upload: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    button: {
      margin: '5px'
    },
    text: {
      display: 'flex',
      justifyContent: 'center',
      padding: '10px'
    },
    input: {
      display: 'none'
    },
    fileSelect: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginTop: '10px'
    },
    fab: {
      alignItems: 'flex-end'
    },
    file: {
      display: 'flex',
      alignItems: 'flex-end'
    }
  }
);

function FileDialog(props) {
  const [fileName, setFileName] = React.useState('');
  const { onClose, open, onCalculationUpload, classes } = props;
  const inputRef = useRef(null);

  const handleClose = () => {
    setFileName('');
    onClose();
  };

  const handleGetFiles = () => {
    inputRef.current.click();
  }

  const fileSelected = () => {
    setFileName(inputRef.current.files[0].name)
  }

  const onCalcUpload = () => {
    onCalculationUpload(inputRef.current.files[0]);
    handleClose();
  }
  
  return (
    <Dialog fullWidth maxWidth='xs' onClose={handleClose} open={open} className={classes.dialog}>
      <div className={classes.fileSelect}>
        <Button color='primary' className={classes.button} variant="contained" onClick={handleGetFiles}>
          Select File...
        </Button>
        <Input type='file' className={classes.input} inputRef={inputRef} onChange={fileSelected}></Input>
        <div><Typography className={classes.text}>
          {isEmpty(fileName)
          ? 'No File Selected'
          : <div className={classes.file}><InsertDriveFile/> {fileName} </div>}
        </Typography></div>
      </div>
      <div className={classes.upload}>
        <Button className={classes.fab} onClick={onCalcUpload} disabled={isEmpty(fileName)}>
          Upload
          <CloudUpload color={isEmpty(fileName) ? 'disabled' : 'primary'} className={classes.icon}/>
        </Button>
        <Button className={classes.fab} onClick={handleClose}>
          Cancel
          <Cancel color='secondary' className={classes.icon}/>
        </Button>
      </div>
    </Dialog>
  );
}

function FileUpload(props) {
  const [open, setOpen] = React.useState(false);
  const { classes } = props;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.add}>
      <Fab component='a' variant='extended' size='small' onClick={handleClickOpen}>
        Create Calculation from File
        <Add className={classes.icon}/>
      </Fab>
      <FileDialog open={open} onClose={handleClose} {...props}/>
    </div>
  );
}

export default withStyles(style)(FileUpload)