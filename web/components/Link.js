import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const Link = ({ id, children, title }) => (
    <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>} placement='bottom'>
      {children}
    </OverlayTrigger>
);

export default Link;