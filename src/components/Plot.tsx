import React from 'react';

interface PlotProps {
  text: string;
}

export default function Plot({ text }: PlotProps) {
  return <div>{text}</div>;
}
