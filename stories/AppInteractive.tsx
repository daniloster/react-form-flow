import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { SchemaBuilder } from '../src';
import App from './App';

function hasValue(value) {
  return (
    value !== null && value !== undefined && (typeof value !== 'string' || (value && value.trim()))
  );
}

/**
 * If you try to add the same validation name twice it will throw an error. See recommendation in Getting Started docs.
 */
try { SchemaBuilder.factory("max-length", ({ value, max }) => !hasValue(value ?? "") || (value ?? "").length <= max); } catch {}
try { SchemaBuilder.factory("min-length", ({ value, min }) => !hasValue(value ?? "") || (value ?? "").length >= min); } catch {}
try { SchemaBuilder.factory("required-array", ({ value }) => hasValue(value) && typeof value.forEach === "function" && value.length >= 0); } catch {}
try { SchemaBuilder.factory("required", ({ value }) => hasValue(value ?? "") && (value ?? "").length >= 0); } catch {}



export default function AppInteractive({
  requiredNameMessage,
  requiredDescriptionMessage,
  minNameLength,
  minDescriptionLength,
}) {
  const schemaData = useRef(SchemaBuilder.builder()
  .with("name")
  .check("required", { response: () => ({ message: requiredNameMessage })})
  .check("min-length", { min: minNameLength, response: (metadata) => {
    const { value, min } = metadata;
    const length = (value ?? "").length;
    const message = 
    `Name should have more than ${min} characters. (Remaining ${
      length > min ? 0 : min - length
    })`;
    return { message };
  } })
  .end()
  .with("description")
  .check("required", { response: () => ({ message: requiredDescriptionMessage })})
  .check("min-length", { min: minDescriptionLength, response: (metadata) => {
    const { value, min } = metadata;
    const length = (value ?? "").length;
    const message = 
    `Description should have more than ${min} characters. (Remaining ${
      length > min ? 0 : min - length
})`;
    return { message };
  } })
  .end()
  .build());
  
  return <App schemaData={schemaData.current} />;
}

AppInteractive.propTypes = {
  requiredNameMessage: PropTypes.string.isRequired,
  requiredDescriptionMessage: PropTypes.string.isRequired,
  minNameLength: PropTypes.number.isRequired,
  minDescriptionLength: PropTypes.number.isRequired,
};
