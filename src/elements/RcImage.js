import React, { useState } from 'react'
import { Image } from 'react-bootstrap';
import { icons } from '../constants';

export const RcImage = (props) => {
    const {src=null, ...otherProps} = props;
    const defaultImage = icons.noImgIcn;
    const imgSrc = src && src.length > 0 ? src : defaultImage
    const [viewDefaultImage, setViewDefaultImage] = useState(false)
    const onError = (e) => {
        console.log("error loading image",e);
        setViewDefaultImage(true)
    }
    return (
        <>
            <Image src={viewDefaultImage ? defaultImage : imgSrc} {...otherProps} onError={onError}  />
            {/* <img src={viewDefaultImage ? defaultImage : imgSrc} {...otherProps} onError={(e) => onError(e)} alt={otherProps.alt || "image"}    /> */}
        </>
    )
}
