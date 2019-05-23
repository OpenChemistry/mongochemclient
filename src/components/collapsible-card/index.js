import React, { useState } from 'react';

import {
  Card, CardHeader, CardContent,
  IconButton,
  Collapse
} from '@material-ui/core';

import KeyBoardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';

export default ({title, children}) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Card>
      <CardHeader
        title={title}
        titleTypographyProps={{variant: 'h6'}}
        action={
          <IconButton
            onClick={() => {setCollapsed(!collapsed)}}
          >
            {collapsed ? <KeyBoardArrowDown/> : <KeyboardArrowUp/>}
          </IconButton>
        }
      />
      <Collapse in={!collapsed}>
        <CardContent>
          {children}
        </CardContent>
      </Collapse>
    </Card>
  );
};
