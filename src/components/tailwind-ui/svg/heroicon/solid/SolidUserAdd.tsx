import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgSolidUserAdd({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zm0 2a6 6 0 016 6H2a6 6 0 016-6zm8-4a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
    </svg>
  );
}

export default SvgSolidUserAdd;
