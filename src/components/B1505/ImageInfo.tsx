import React from 'react';
import { PlotObjectType } from 'react-plot';
import { Button } from '../tailwind-ui';

interface ImageInfoProps {
  data: PlotObjectType;
}

function downloadImage(url: string, name: string) {
  let downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = name;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

export default function ImageInfo({ data }: ImageInfoProps) {
  return (
    <div>
      <Button
        className="m-2"
        onClick={() => {
          const svg = document.getElementById('b1505')?.outerHTML;
          if (!svg) return null;
          const type = 'image/svg+xml;charset=utf-8';
          const svgBlob = new Blob([svg], { type });
          const svgUrl = URL.createObjectURL(svgBlob);
          downloadImage(svgUrl, 'b1505.svg');
        }}
      >
        Download SVG
      </Button>
      <Button
        className="m-2"
        onClick={() => {
          const svg = document.getElementById('b1505')?.outerHTML;
          if (!svg || !data.dimensions) return null;
          const type = 'image/svg+xml;charset=utf-8';
          const svgBlob = new Blob([svg], { type });
          try {
            let canvas = document.createElement('canvas');
            canvas.width = data.dimensions.width;
            canvas.height = data.dimensions.height;
            let context = canvas.getContext('2d');
            if (!context) return null;
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);
            let img = new Image();
            let url = URL.createObjectURL(svgBlob);
            img.onload = async function () {
              if (!context) return null;
              context.drawImage(img, 0, 0);
              let png = canvas.toDataURL('image/png', 1);
              downloadImage(png, 'b1505.png');
              URL.revokeObjectURL(png);
            };
            img.src = url;
          } catch (error) {
            console.error(error);
          }
        }}
      >
        Download PNG
      </Button>
    </div>
  );
}
