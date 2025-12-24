import React from 'react';

const GlowCircle = React.forwardRef(({ opacity = 1, ...props }, ref) => (
  <svg
    ref={ref}
    width={2120}
    height={2120}
    viewBox="0 0 2120 2120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      shapeRendering: 'optimizeSpeed',
      imageRendering: '-webkit-optimize-contrast',
      willChange: 'auto',
    }}
    {...props}
  >
    <g filter="url(#filter0_f_285_201)" opacity={opacity}>
      <circle cx={579} cy={579} r={579} transform="matrix(1 0 0 -1 481 1639)" fill="#9965FE" />
    </g>

    <g filter="url(#filter1_i_285_201)" opacity={opacity}>
      <circle cx={579} cy={579} r={579} transform="matrix(1 0 0 -1 481 1639)" fill="#9965FE" />
    </g>

    <g style={{ mixBlendMode: 'screen' }} filter="url(#filter2_f_285_201)" opacity={opacity}>
      <circle cx={660} cy={660} r={660} transform="matrix(1 0 0 -1 400 1720)" fill="#9965FE" />
    </g>

    <defs>
      <filter
        id="filter0_f_285_201"
        x={381}
        y={381}
        width={1358}
        height={1358}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation={50} result="effect1_foregroundBlur_285_201" />
      </filter>

      <filter
        id="filter1_i_285_201"
        x={481}
        y={481}
        width={1158}
        height={1175}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={17} />
        <feGaussianBlur stdDeviation={10.3} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_285_201" />
      </filter>

      <filter
        id="filter2_f_285_201"
        x={0}
        y={0}
        width={2120}
        height={2120}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation={200} result="effect1_foregroundBlur_285_201" />
      </filter>
    </defs>
  </svg>
));

GlowCircle.displayName = 'GlowCircle';

export default GlowCircle;

