import React, { useState, useEffect, useRef } from 'react';
import { FallbackProps } from 'react-error-boundary'

function ErrorFallback({ error }: FallbackProps): React.ReactElement {
  return (
    <div>
      <h2>Sorry! error occurred! please reload</h2>
      <pre>{error.message}</pre>
    </div>
  )
}
export default ErrorFallback;