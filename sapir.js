var sapir = {
    methods: ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'],

    injectCss: function() {
        var style = document.createElement('style');
        style.innerText = `
            body {
                font-family: sans-serif;
            }
            body > section {
                page-break-inside: avoid;
            }
            h1, h2, h3, h4, h5 {
                margin-top: 0;
                margin-bottom: 0.5em;
            }
            p {
                margin-top: 0;
            }
            ul {
                padding-left: 1.5em;
            }
            li {
                list-style: none;
            }
            /****************/
            .operation {
                border-radius: 3px;
                margin-bottom: 2em;
                page-break-inside: avoid;
            }
            .operation > header > h4 {
                padding: 0.7em;
                margin: 0 0.7em 0 0;
                color: white;
            }
            .operation > header * {
                display: inline-block;
            }
            .operation > section {
                padding: 1em;
                clear: both;
            }
            .operation h5 {
                font-size: 1.1em;
                margin-bottom: 0.1em;
            }
            /****************/
            .operation.get {
                border: 1px solid #2392f7;
            }
            .operation.get > header {
                background-color: #e9f4ff;
            }
            .operation.get > header > h4 {
                background-color: #2392f7;
            }
            .operation.get h5 {
                color: #2392f7;
            }
            /****************/
            .operation.post {
                border: 1px solid #13c20f;
            }
            .operation.post > header {
                background-color: #e7f9e7;
            }
            .operation.post > header > h4 {
                background-color: #13c20f;
            }
            .operation.post h5 {
                color: #13c20f;
            }
            /****************/
            .operation.put {
                border: 1px solid #ff9000;
            }
            .operation.put > header {
                background-color: #fff4e6;
            }
            .operation.put > header > h4 {
                background-color: #ff9000;
            }
            .operation.put h5 {
                color: #ff9000;
            }
            /****************/
            .operation.patch {
                border: 1px solid #af01d9;
            }
            .operation.patch > header {
                background-color: #f7e6fc;
            }
            .operation.patch > header > h4 {
                background-color: #af01d9;
            }
            .operation.patch h5 {
                color: #af01d9;
            }
            /****************/
            .operation.delete {
                border: 1px solid #e30012;
            }
            .operation.delete > header {
                background-color: #fde6e7;
            }
            .operation.delete > header > h4 {
                background-color: #e30012;
            }
            .operation.delete h5 {
                color: #e30012;
            }
            /****************/
            .operation.options {
                border: 1px solid #bdc3c7;
            }
            .operation.options > header {
                background-color: #f9f9fa;
            }
            .operation.options > header > h4 {
                background-color: #bdc3c7;
            }
            .operation.options h5 {
                color: #bdc3c7;
            }
            /****************/
            label.yes {
                color: #13c20f;
            }
            label.no {
                color: #e30012;
            }
            label.deprecated {
                background: #c52a5e;
                padding: 0.2em 0.3em;
                border: 1px solid #fff;
                color: #fff;
            }
            .operation ul.tags {
                float: right;
            }
            label.tag {
                display: inline-block;
                border-radius: 3px;
                background-color: #a60000;
                color: #fff;
                padding: 2px 10px;
                margin: 2px;
            }
            .monospace {
                font-family: "Lucidia Console", Monaco, "Courier New", Courier, monospace;
            }
            table {
                border-collapse: collapse;
                border-spacing: 0;
                width: 100%;
                margin-bottom: 0.5em;
            }
            thead {
                background-color: #f7f7f7;
            }
            th, td {
                text-align: left;
                padding: 0.3em;
                vertical-align: top;
            }
            tr + tr {
                border-top: 1px solid silver;
            }
            /****************/
            .code {
                color: #555;
                font-weight: bold;
            }
            .code-200 {
                color: #13c20f;
            }
            .code-300 {
                color: #0072bc;
            }
            .code-400 {
                color: #f39822;
            }
            .code-500 {
                color: #d40011;
            }
            /****************/
            .definition {
                margin-bottom: 1em;
            }
        `;
        document.getElementsByTagName('head')[0].appendChild(style);
    },

    loadScript: function(path, onLoad) {
        var script = document.createElement('script');
        script.async = true;
        script.src = path;
        script.onload = onLoad;
        document.getElementsByTagName('head')[0].appendChild(script);
    },

    renderDocument: function(i, script) {
        try {
            var doc = JSON.parse(script.innerText)
        } catch (e) {
            return;
        }

        $(document.body).append(
            sapir.renderTitle(doc, doc.info),
            sapir.renderInfo(doc, doc.info),
            sapir.renderToc(doc, doc.paths),
            doc.tags && sapir.renderTags(doc, doc.tags),
            sapir.renderPaths(doc, doc.paths),
            doc.definitions && sapir.renderDefinitions(doc, doc.definitions)
        );
    },

    renderTitle: function(doc, info) {
        info.title && (document.title = info.title + ' - Simple API renderer');
        return $('<h1>', {text: info.title});
    },

    renderInfo: function(doc, info) {
        var $section = $('<section>', {'class': 'info'});
        info.description && $section.append(
            sapir.renderGfm(doc, info.description, 'p')
        );
        $section.append(
            $('<p>').append(
                $('<strong>', {text: 'Version: '}),
                info.version
            )
        );
        info.termsOfService && $section.append(
            sapir.renderInfoTermsOfService(doc, info.termsOfService)
        );
        info.contact && $section.append(
            sapir.renderInfoContact(doc, info.contact)
        );
        info.license && $section.append(
            sapir.renderInfoLicense(doc, info.license)
        );
        return $section;
    },

    renderInfoTermsOfService: function(doc, tos) {
        return $('<section>').append(
            $('<h4>', {text: 'Terms of service'}),
            $('<p>').append(
                $('<a>', {href: tos, text: tos})
            )
        );
    },

    renderInfoLicense: function(doc, license) {
        return $('<section>').append(
            $('<h4>', {text: 'License'}),
            $('<p>').append(
                license.url
                    ? $('<a>', {href: license.url, text: license.name})
                    : document.createTextNode(license.name)
            )
        );
    },

    renderInfoContact: function(doc, contact) {
        var $p = $('<p>');
        contact.name && $p.append(
            document.createTextNode(contact.name),
            '<br>'
        );
        contact.url && $p.append(
            $('<a>', {href: contact.url, text: contact.url}),
            '<br>'
        );
        contact.email && $p.append(
            $('<a>', {href: 'mailto:' + contact.email, text: contact.email}),
            '<br>'
        );
        return $('<section>').append(
            $('<h4>', {text: 'Contact information'}),
            $p
        );
    },

    renderToc: function(doc, paths) {
        var $ul = $('<ul>');
        $.each(paths, function(pathName, path) {
            $.each(path, function(operationName, operation) {
                $ul.append(
                    $('<li>').append(
                        $('<a>', {
                            href: '#' + sapir.operationFragmentLink(doc, operationName, pathName),
                            text: operationName.toUpperCase() + ' ' + pathName
                        })
                    )
                );
            });
        });
        return $('<section>', {'class': 'toc'}).append(
            $('<h2>', {text: 'ToC'}),
            $ul
        );
    },

    operationFragmentLink(doc, operationName, pathName) {
        pathName = pathName.replace(/{([^}]*)}/g, '-$1');
        return operationName.replace(/[^a-z0-9_-]/ig, '') + '-' + pathName.replace(/[^a-z0-9_-]/ig, '');
    },

    renderTags: function(doc, tags) {
        return $('<section>', {'class': 'tags'}).append(
            $('<table>').append(
                $('<tbody>').append(
                    $.map(tags, sapir.renderTag.bind(sapir, doc))
                )
            )
        );
    },

    renderTag: function(doc, tag) {
        return $('<tr>').append(
            $('<td>').append(
                $('<label>', {'class': 'tag', text: tag.name})
            ),
            $('<td>').append(
                tag.description && sapir.renderGfm(doc, tag.description)
            ),
            $('<td>').append(
                tag.externalDocs && sapir.renderTagExternalDocs(doc, tag.externalDocs)
            )
        );
    },

    renderTagExternalDocs: function(doc, externalDocs) {
        return $('<div>').append(
            externalDocs.description && sapir.renderGfm(doc, externalDocs.description),
            $('<a>', {href: externalDocs.url, text: externalDocs.url})
        );
    },

    renderPaths: function(doc, paths) {
        return $('<section>').append(
            $('<header>').append(
                $('<h2>', {text: 'Paths'})
            ),
            $('<ul>', {'class': 'paths'}).append(
                $.map(paths, sapir.renderPath.bind(sapir, doc))
            )
        );
    },

    renderPath: function(doc, path, pathString) {
        $operations = $('<ul>', {'class': 'operations'});
        for (var methodName of sapir.methods) {
            path[methodName] && $operations.append(
                sapir.renderOperation(doc, pathString, path[methodName], methodName)
            );
        }
        return $('<li>', {'class': 'path'}).append(
            $('<h3>', {'class': 'monospace', text: pathString}),
            $operations
        );
    },

    renderOperation: function(doc, pathString, data, methodName) {
        var $section = $('<section>');
        data.tags && $section.append(
            sapir.renderOperationTags(doc, data.tags)
        );
        data.summary && $section.append(
            sapir.renderOperationSummary(doc, data.summary)
        );
        data.description && $section.append(
            sapir.renderOperationDescription(doc, data.description)
        );
        data.externalDocs && $section.append(
            sapir.renderOperationExternalDocs(doc, data.externalDocs)
        );
        data.parameters && $section.append(
            sapir.renderOperationParameters(doc, data.parameters)
        );
        data.security && $section.append(
            sapir.renderOperationSecurity(doc, data.security)
        );
        $section.append(
            sapir.renderOperationResponses(doc, data.responses)
        );
        return $('<li>', {'class': 'operation ' + methodName}).append(
            $('<a>', {name: sapir.operationFragmentLink(doc, methodName, pathString)}),
            sapir.renderOperationHeader(doc, data, methodName, pathString),
            $section
        );
    },

    renderOperationSummary: function(doc, summary) {
        return $('<section>').append(
            $('<h5>', {text: 'Summary'}),
            $('<p>', {text: summary})
        );
    },

    renderOperationExternalDocs: function(doc, externalDocs) {
        var $p = $('<p>');
        externalDocs.description && $p.append(
            sapir.renderGfm(doc, externalDocs.description)
        );
        $p.append(
            $('<a>', {href: externalDocs.url, text: externalDocs.url})
        );
        return $('<section>').append(
            $('<h5>', {text: 'External Documentation'}),
            $p
        );
    },

    renderOperationHeader: function(doc, header, methodName, pathString) {
        var $header = $('<header>').append(
            $('<h4>', {'class': 'monospace', text: methodName.toUpperCase() + ' ' + pathString})
        );
        header.deprecated && $header.append(
            $('<label>', {'class': 'deprecated', text: 'Deprecated'})
        );
        return $header;
    },

    renderOperationTags: function(doc, tags) {
        return $('<ul>', {'class': 'tags'}).append(
            $.map(tags, function(tag) {
                return $('<li>').append(
                    $('<label>', {'class': 'tag', text: tag})
                );
            })
        );
    },

    renderOperationDescription: function(doc, description) {
        return $('<section>').append(
            $('<h5>', {text: 'Description'}),
            $('<p>', {text: description})
        );
    },

    renderOperationSecurity: function(doc, security) {
        return $('<section>', {text: '@todo operation.security'});
    },

    renderOperationParameters: function(doc, parameters) {
        return $('<section>').append(
            $('<h5>', {text: 'Parameters'}),
            $('<table>').append(
                $('<thead>').append(
                    $('<tr>').append(
                        $('<th>', {text: 'Name'}),
                        $('<th>', {text: 'Located in'}),
                        $('<th>', {text: 'Description'}),
                        $('<th>', {text: 'Required'}),
                        $('<th>', {text: 'Schema'})
                    )
                ),
                $('<tbody>').append($.map(parameters, function(parameter) {
                    return $('<tr>').append(
                        $('<td>', {text: parameter.name}),
                        $('<td>', {text: parameter.in}),
                        $('<td>').append(
                            sapir.renderGfm(doc, parameter.description)
                        ),
                        $('<td>').append(
                            $('<label>', {
                                'class': parameter.required ? 'yes' : 'no',
                                text: parameter.required ? 'Yes' : 'No'
                            })
                        ),
                        $('<td>').append(
                            parameter.in === 'body'
                                ? sapir.renderSchemaObject(doc, parameter.schema)
                                : sapir.renderItemsObject(doc, parameter)
                        )
                    );
                }))
            )
        );
    },

    renderItemsObject(doc, item) {
        return $('<ul>').append(
            $('<li>').append(
                $('<strong>', {text: 'Type: '}),
                $('<span>', {'class': 'monospace', text: item.type})
            ),
            item.format && $('<li>').append(
                $('<strong>', {text: 'Format: '}),
                $('<span>', {'class': 'monospace', text: item.format})
            ),
            typeof item.allowEmptyValue !== 'undefined' && $('<li>').append(
                $('<strong>', {text: 'Allow empty: '}),
                $('<label>', {'class': item.allowEmptyValue ? 'yes' : 'no', text: item.allowEmptyValue ? 'Yes' : 'No'})
            ),
            item.items && $('<ul>').append(
                sapir.renderItemsObject(doc, item.items)
            ),
            item.collectionFormat && $('<li>').append(
                $('<strong>', {text: 'Collection format: '}),
                document.createTextNode(item.collectionFormat)
            ),
            typeof item.default !== 'undefined' && $('<li>').append(
                $('<strong>', {text: 'Default: '}),
                $('<span>', {'class': 'monospace', text: item.default})
            ),
            typeof item.maximum !== 'undefined' && $('<li>').append(
                $('<strong>', {text: 'Maximum: '}),
                $('<span>', {'class': 'monospace', text: item.maximum})
            ),
            typeof item.exclusiveMaximum !== 'undefined' && $('<li>').append(
                $('<strong>', {text: 'Exclusive Maximum: '}),
                $('<label>', {'class': item.exclusiveMaximum ? 'yes' : 'no', text: item.exclusiveMaximum ? 'Yes' : 'No'})
            ),
            typeof item.minimum !== 'undefined' && $('<li>').append(
                $('<strong>', {text: 'Minimum: '}),
                $('<span>', {'class': 'monospace', text: item.minimum})
            ),
            typeof item.exclusiveMinimum !== 'undefined' && $('<li>').append(
                $('<strong>', {text: 'Exclusive Minimum: '}),
                $('<label>', {'class': item.exclusiveMinimum ? 'yes' : 'no', text: item.exclusiveMinimum ? 'Yes' : 'No'})
            ),
            typeof item.maxLength !== 'undefined' && $('<li>').append(
                $('<strong>', {text: 'MaxLength: '}),
                $('<span>', {'class': 'monospace', text: item.maxLength})
            ),
            typeof item.minLength !== 'undefined' && $('<li>').append(
                $('<strong>', {text: 'minLength: '}),
                $('<span>', {'class': 'monospace', text: item.minLength})
            ),
            item.pattern && $('<li>').append(
                $('<strong>', {text: 'Pattern: '}),
                document.createTextNode(item.pattern)
            ),
            typeof item.maxItems !== 'undefined' && $('<li>').append(
                $('<strong>', {text: 'MaxItems: '}),
                $('<span>', {'class': 'monospace', text: item.maxItems})
            ),
            typeof item.minItems !== 'undefined' && $('<li>').append(
                $('<strong>', {text: 'MinItems: '}),
                $('<span>', {'class': 'monospace', text: item.minItems})
            ),
            typeof item.uniqueItems !== 'undefined' && $('<li>').append(
                $('<strong>', {text: 'Unique items: '}),
                $('<label>', {'class': item.uniqueItems ? 'yes' : 'no', text: item.exclusiveMinimum ? 'Yes' : 'No'})
            ),
            typeof item.enum !== 'undefined' && $('<li>').append(
                $('<strong>', {text: 'Enum: '}),
                $('<span>', {'class': 'monospace', text: item.enum})
            ),
            typeof item.multipleOf !== 'undefined' && $('<li>').append(
                $('<strong>', {text: 'MultipleOf: '}),
                $('<span>', {'class': 'monospace', text: item.multipleOf})
            )
        );
    },

    renderOperationResponses: function(doc, responses) {
        var hasHeaders = false;
        var hasExamples = false;
        var hasSchema = false;
        for (var responseName in responses) {
            if (responses[responseName].examples) {
                hasExamples = true;
            }
            if (responses[responseName].headers) {
                hasHeaders = true;
            }
            if (responses[responseName].schema) {
                hasSchema = true;
            }
        }
        return $('<section>').append(
            $('<h5>', {text: 'Responses'}),
            $('<table>').append(
                $('<thead>').append(
                    $('<tr>').append(
                        $('<th>', {text: 'Code'}),
                        $('<th>', {text: 'Description'}),
                        hasHeaders && $('<th>', {text: 'Headers'}),
                        hasSchema && $('<th>', {text: 'Schema'}),
                        hasExamples && $('<th>', {text: 'Examples'})
                    )
                ),
                $('<tbody>').append($.map(responses, function(parameter, code) {
                    return $('<tr>').append(
                        $('<td>').append(
                            $('<span>', {'class': sapir.codeToClass(code), text: code})
                        ),
                        $('<td>').append(
                            sapir.renderGfm(doc, parameter.description)
                        ),
                        hasHeaders && $('<td>').append(
                            parameter.headers && sapir.renderOperationResponseHeaders(doc, parameter.headers)
                        ),
                        hasSchema && $('<td>').append(
                            sapir.renderSchemaObject(doc, parameter.schema)
                        ),
                        hasExamples && $('<td>').append(
                            parameter.examples && sapir.renderOperationResponseExamples(doc, parameter.examples)
                        )
                    );
                }))
            )
        );
    },

    renderOperationResponseHeaders(doc, headers) {
        return $('<table>', {'class': 'headers'}).append(
            $('<thead>').append(
                $('<tr>').append(
                    $('<th>', {text: 'Name'}),
                    $('<th>', {text: 'Description'}),
                    $('<th>', {text: 'Type'}),
                    $('<th>', {text: 'Details'})
                )
            ),
            $('<tbody>').append($.map(headers, function(header, headerName) {
                return $('<tr>').append(
                    $('<td>', {'class': 'monospace', text: headerName}),
                    $('<td>').append(sapir.renderGfm(doc, header.description)),
                    $('<td>', {'class': 'monospace', text: header.type}),
                    $('<td>').append(sapir.renderItemsObject(doc, header))
                );
            }))
        );
    },

    renderOperationResponseExamples(doc, examples) {
        return $.map(examples, function(example, contentType) {
            var out = typeof example !== 'string' ? JSON.stringify(example, null, 2) : example;
            return $('<pre>', {text: contentType + ': ' + out});
        });
    },

    codeToClass: function(code) {
        return 'code code-' + ('' + code.substr(0, 1)) + '00';
    },

    renderDefinitions: function(doc, definitions) {
        return $('<section>').append(
            $('<h2>', {text: 'Models'}),
            $('<ul>', {'class': 'definitions'}).append(
                $.map(definitions, sapir.renderDefinition.bind(sapir, doc))
            )
        );
    },

    renderDefinition: function(doc, definition, definitionName) {
        return $('<li>', {'class': 'definition'}).append(
            $('<h3>', {text: definitionName}),
            sapir.renderSchemaObject(doc, definition)
        );
    },

    renderSchemaObject: function(doc, schema) {
        if (!schema) {
            return null;
        }
        if (ref = schema['$ref']) {
            schema = sapir.find(doc, ref);
        }
        return $('<pre>', {text: JSON.stringify(schema, null, 2)});
    },

    renderGfm: function(doc, text, as) {
        return $('<' + (as || 'div') + '>', {text: text});
    },

    find(doc, ref) {
        var parts = ref.split('/');
        var context = null;
        for (n in parts) {
            var part = parts[n];
            if (part === '#') {
                context = doc;
            } else if (typeof context[part] !== 'undefined') {
                context = context[part];
            } else {
                return null;
            }
        }
        return context;
    }
};

sapir.injectCss();
sapir.loadScript('https://code.jquery.com/jquery-3.1.1.slim.min.js', function() {
    var scripts = $('script').remove();
    $(document.body).empty();
    scripts.each(sapir.renderDocument);
});
