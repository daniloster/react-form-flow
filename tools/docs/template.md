## {{projectName}}

{{#if description}}{{{description}}}{{/if}}

[\`npm: {{projectName}}\`]({{npmLink}})

{{#if components.length}}
{{projectName}} has overall {{components.length}} components exported.
{{/if}}

{{#each files}}
### {{this.fileName}}

{{#each components}}
#### {{this.displayName}}

{{#if description}}{{{description}}}{{/if}}

prop | type | default | required | description
---- | :----: | :-------: | :--------: | -----------
{{#each this.props}}
**{{@key}}** | {{this.type.name}} | {{#if this.defaultValue}}{{{this.defaultValue.value}}}{{/if}} | {{#if this.required}}:white_check_mark:{{else}}:x:{{/if}} | {{#if this.description}}{{{strip_linebreaks this "description"}}}{{/if}}
{{/each}}

{{/each}}
{{/each}}