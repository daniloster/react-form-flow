function defaultResponse(args, validationName) {
  return { key: `${args.path}.errors.${validationName}`.replace(/\[\d*\]/g, '') };
}

export default function test(validationName, isValid, response = defaultResponse) {
  return args => ({ ...args, isValid: isValid(args), ...response(args, validationName) });
}
