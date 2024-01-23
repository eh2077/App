import pdfWorkerSource from 'pdfjs-dist/legacy/build/pdf.worker';
import React, {useEffect} from 'react';
import {Document, pdfjs, Thumbnail} from 'react-pdf';
import FullScreenLoadingIndicator from '@components/FullscreenLoadingIndicator';
import addEncryptedAuthTokenToURL from '@libs/addEncryptedAuthTokenToURL';

type WebPDFThumbnailProps = {
    /** Source URL for the preview image */
    previewSourceURL: string | number;

    /** Whether the image requires an authToken */
    isAuthTokenRequired: boolean;

    updateImageSize: (args: {width: number; height: number}) => void;
};

type UpdatePDFSizeParams = {
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
};

function WebPDFThumbnail({previewSourceURL, isAuthTokenRequired, updateImageSize}: WebPDFThumbnailProps) {

    useEffect(() => {
        const workerURL = URL.createObjectURL(new Blob([pdfWorkerSource], {type: 'text/javascript'}));
        if (pdfjs.GlobalWorkerOptions.workerSrc !== workerURL) {
            pdfjs.GlobalWorkerOptions.workerSrc = workerURL;
        }
    }, []);

    return (
        <Document
            loading={<FullScreenLoadingIndicator />}
            file={isAuthTokenRequired ? addEncryptedAuthTokenToURL(previewSourceURL as string) : previewSourceURL}
            options={{
                cMapUrl: 'cmaps/',
                cMapPacked: true,
            }}
            externalLinkTarget="_blank"
        >
            <Thumbnail
                pageIndex={0}
                onLoadSuccess={({width, height, originalWidth, originalHeight}: UpdatePDFSizeParams) => {
                    updateImageSize({width, height});
                    console.log(`width=${width}, height=${height}, originalWidth=${originalWidth}, originalHeight=${originalHeight}`);
                }}
            />
        </Document>
    );
}

WebPDFThumbnail.displayName = 'WebPDFThumbnail';
export default React.memo(WebPDFThumbnail);
