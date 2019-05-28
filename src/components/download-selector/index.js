import React, { useState } from 'react';

import { withStyles, Fab } from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import DownloadIcon from '@material-ui/icons/CloudDownload';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  selectButtonGroup: {
    boxShadow: '0 0',
    borderRadius: 3,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.palette.grey[400],
    backgroundColor: theme.palette.grey[100]
  }
});

const DownloadSelector = ({options, classes}) => {
  const [selectedOption, setSelectedOption] = useState(0);

  const handleSelect = (_event, selected) => {
    setSelectedOption(selected);
  }

  const { downloadUrl, fileName } = options[selectedOption];

  return (
    <div className={classes.root}>
      <ToggleButtonGroup exclusive value={selectedOption} onChange={handleSelect} className={classes.selectButtonGroup}>
        {options.map(({label}, i) => (
          <ToggleButton value={i} className={classes.selectButton}>
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <Fab component='a' href={downloadUrl} download={fileName} size='small'>
        <DownloadIcon/>
      </Fab>
    </div>
  )
};

export default withStyles(styles)(DownloadSelector);
