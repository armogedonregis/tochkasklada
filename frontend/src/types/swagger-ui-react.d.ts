declare module 'swagger-ui-react' {
  import { ComponentType } from 'react';

  interface SwaggerUIProps {
    spec?: any;
    url?: string;
    layout?: string;
    docExpansion?: 'list' | 'full' | 'none';
    deepLinking?: boolean;
    filter?: boolean | string;
    persistAuthorization?: boolean;
    displayOperationId?: boolean;
    defaultModelsExpandDepth?: number;
    defaultModelExpandDepth?: number;
    defaultModelRendering?: 'example' | 'model';
    displayRequestDuration?: boolean;
    syntaxHighlight?: {
      activate?: boolean;
      theme?: string;
    };
    showExtensions?: boolean;
    showCommonExtensions?: boolean;
    [key: string]: any;
  }

  const SwaggerUI: ComponentType<SwaggerUIProps>;
  export default SwaggerUI;
} 