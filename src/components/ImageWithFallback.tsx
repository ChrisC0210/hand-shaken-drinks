"use client";

import Image from 'next/image';
import React from 'react';

interface Props extends React.ComponentProps<typeof Image> {
  fallbackSrc?: string;
}

export default function ImageWithFallback({ fallbackSrc = '/placeholder.png', alt, ...rest }: Props) {
  // If src is a plain string not a valid path, next/image will still try; keep simple fallback logic.
  // For now, render Image and let Next/Image handle invalid sources in dev.
  return <Image alt={alt || ''} {...rest} />;
}
