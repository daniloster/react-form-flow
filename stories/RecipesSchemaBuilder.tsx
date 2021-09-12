import React, { useCallback, useMemo, useState } from 'react';
import hasValue from '../react-form-flow-examples/validationRecipes/hasValue';
import { SchemaBuilder } from '../src';
import Editor from '../tools/helpers/components/Editor';
import RecipesValidations from './RecipesValidations';

export function decode(text) {
  const parser = document.createElement('div');

  parser.innerHTML = text;
  return parser.textContent;
}

export default function RecipesSchemaBuilder({ data: dataProps, schemaData: schemaDataProps }) {
  const [_schemaData, set_schemaData] = useState(schemaDataProps || schemaData);
  const schemaDataObject = useMemo(() => {
    const getSchemaData = new Function(
      'SchemaBuilder',
      'hasValue',
      decode(_schemaData)
    );
    return getSchemaData(SchemaBuilder, hasValue);
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
          <legend>Assumed SchemaBuilder and hasValue are available...</legend>
          <code>{'import { SchemaBuilder } from "react-form-flow";'}</code>
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
          <legend>Body of getShemaData(SchemaBuilder, hasValue)</legend>
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

/** 
 * Once you factory it, you can use as many times as you want via "check"
 **/
if (!SchemaBuilder.get("string.required")) {
  SchemaBuilder.factory("string.required", (metadata) => hasValue(metadata.value));
}

/** 
 * You can provide extra arguments such as message, or use some translation library to
 * transform the property "key" returned into a message.
 **/
return SchemaBuilder.builder()
  .with("name", [])
  .check("string.required")
  .end()
  .with("description", [])
  .check("string.required", { message: "Description is required" })
  .end()
  .build();

`.trim();
