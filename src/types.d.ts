declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      alt?: string;
      'auto-rotate'?: boolean | string;
      'rotation-per-second'?: string;
      'camera-controls'?: boolean | string;
      'interaction-prompt'?: string;
      exposure?: string;
      'shadow-intensity'?: string;
      'environment-image'?: string;
    };
  }
}
