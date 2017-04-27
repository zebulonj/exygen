import React from 'react';
import PropTypes from 'prop-types';

export default Document;

export function Document( props ) {
  const { state, content, scripts } = props;
  const json = JSON.stringify( state );

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
      </head>
      <body>
        <div id="content" dangerouslySetInnerHTML={{ __html: content || '' }}></div>

        <script type="text/json" id="state" dangerouslySetInnerHTML={{ __html: json || '' }}></script>
        { scripts && scripts.map( script => (<script type="text/javascript" key={ script } src={ script }></script>) ) }
      </body>
    </html>
  );
}

Document.propTypes = {
  state:    PropTypes.object,
  content:  PropTypes.string,
  scripts:  PropTypes.array
};
