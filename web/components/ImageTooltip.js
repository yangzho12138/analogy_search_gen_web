import React, { useState, useRef, useLayoutEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function ImageTooltip({ image, children }) {

    return (
        <OverlayTrigger
            placement="bottom"
            overlay={
                <Tooltip className="custom-tooltip">
                    <img src={image} style={{ width: '20vw', height: '20vh' }} />
                </Tooltip>
            }
            style={{color: 'transparent'}}
        >
            {children}
        </OverlayTrigger>
    );
}

export default ImageTooltip;
