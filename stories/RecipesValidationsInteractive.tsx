import React, { useCallback, useMemo, useState } from 'react';
import hasValue from '../react-form-flow-examples/hasValue';
import { createValidations } from '../src';
import Editor from '../tools/helpers/components/Editor';
import RecipesValidations from './RecipesValidations';

export function decode(text) {
  const parser = document.createElement('div');

  parser.innerHTML = text;
  return parser.textContent;
}

function parse(text) {
  return JSON.parse(decode(text));
}

export default function RecipesValidationsInteractive({ data: dataProps, schemaData: schemaDataProps }) {
  const [_schemaData, set_schemaData] = useState(schemaDataProps || schemaData);
  const schemaDataObject = useMemo(() => {
    const getSchemaData = new Function(
      'createValidations',
      'hasValue',
      decode(_schemaData)
    );
    return getSchemaData(createValidations, hasValue);
  }, [_schemaData]);
  const [_schemaDataObjectSaved, set_schemaDataObjectSaved] = useState(schemaDataObject);
  const onUpdateCode = useCallback(() => {
    set_schemaDataObjectSaved(null);
    setTimeout(() => void set_schemaDataObjectSaved(schemaDataObject), 300);
  }, [schemaDataObject]);

  return (
    _schemaDataObjectSaved != null && (
      <>
        <fieldset>
          <legend>factories</legend>
          <code>{'import { createValidations } from "react-form-flow";'}</code>
          <code>
            <pre>
              {`
export default function hasValue(value) {
  return (
    value !== null && value !== undefined && (typeof value !== 'string' || (value && value.trim()))
  );
}           
              `}
            </pre>
          </code>
        </fieldset>
        <fieldset>
          <legend>schemaData</legend>
          <Editor value={_schemaData} onChangeValue={set_schemaData} />
        </fieldset>
        <div>
          <button type="button" onClick={onUpdateCode}>Update Code</button>
        </div>
        <RecipesValidations data={dataProps} schemaData={_schemaDataObjectSaved} />
      </>
    )
  );
}

export const data = {
  "name": "",
  "description": "",
  "passport": {
    "visa": {
      "value": 3,
      "unit": "days"
    }
  }
};
export const schemaData = `
/* Put your factory functions here in order to use in the schemaData */
/* Example */
  
function createRequiredValidation(message) {
  return ({ data, value, path }) => {
    const key = \`\${path}-required\`;
    const isValid = hasValue(value);
    
    return { data, value, path, key, isValid, message };
  };
}

/* End: Example */

return {
  name: createValidations(
    [],
    createRequiredValidation('Name is required.')
  ),
  description: createValidations(
    [],
    createRequiredValidation('Description is required.')
  )
}
`.trim();
