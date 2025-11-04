import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 50%, #2563EB 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '20%',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
          {/* Shopping bag base */}
          <path
            d="M25 35 L25 85 C25 90 28 93 33 93 L67 93 C72 93 75 90 75 85 L75 35"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Shopping bag handles */}
          <path
            d="M35 35 C35 25 40 15 50 15 C60 15 65 25 65 35"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Hub connection dots */}
          <circle cx="50" cy="55" r="4" fill="white" />
          <circle cx="38" cy="65" r="3" fill="white" />
          <circle cx="62" cy="65" r="3" fill="white" />
          <circle cx="50" cy="75" r="3" fill="white" />
          
          {/* Connection lines */}
          <line x1="50" y1="55" x2="38" y2="65" stroke="white" strokeWidth="2" opacity="0.7" />
          <line x1="50" y1="55" x2="62" y2="65" stroke="white" strokeWidth="2" opacity="0.7" />
          <line x1="38" y1="65" x2="50" y2="75" stroke="white" strokeWidth="2" opacity="0.7" />
          <line x1="62" y1="65" x2="50" y2="75" stroke="white" strokeWidth="2" opacity="0.7" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
