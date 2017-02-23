var sapir = {
    methods: ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'],

    each: function(it, fn) {
        var ret = [];
        for (var key in it) {
            if (it.hasOwnProperty(key)) {
                ret.push(fn(key, it[key]));
            }
        }
        return ret;
    },

    el: function(type, attr, children) {
        if (arguments.length === 2 && (typeof attr === 'string' || Array.isArray(attr))) {
            children = attr;
            attr = null;
        }
        var element = document.createElement(type);
        if (typeof attr === 'object') {
            sapir.each(attr, function(key, value) {
                element.setAttribute(key, value);
            });
        }
        sapir.append(element, children);
        return element;
    },

    append: function(target, source) {
        if (Array.isArray(source)) {
            sapir.each(source, function(key, value) {
                sapir.append(target, value);
            });

        } else if (typeof source === 'string') {
            target.appendChild(document.createTextNode(source));

        } else if (source !== null && typeof source === 'object') {
            target.appendChild(source);
        }
    },

    injectCss: function() {
        var style = document.createElement('style');
        style.innerText = "\
            body {\
                font-family: sans-serif;\
            }\
            body > section {\
                page-break-inside: avoid;\
            }\
            h1, h2, h3, h4, h5 {\
                margin-top: 0;\
                margin-bottom: 0.5em;\
            }\
            p {\
                margin-top: 0;\
            }\
            ul {\
                padding-left: 1.5em;\
            }\
            li {\
                list-style: none;\
            }\
            /****************/\
            .operation {\
                border-radius: 3px;\
                margin-bottom: 2em;\
                page-break-inside: avoid;\
            }\
            .operation > header > h4 {\
                padding: 0.7em;\
                margin: 0 0.7em 0 0;\
                color: white;\
            }\
            .operation > header * {\
                display: inline-block;\
            }\
            .operation > section {\
                padding: 1em;\
                clear: both;\
            }\
            .operation h5 {\
                font-size: 1.1em;\
                margin-bottom: 0.1em;\
            }\
            /****************/\
            .operation.get {\
                border: 1px solid #2392f7;\
            }\
            .operation.get > header {\
                background-color: #e9f4ff;\
            }\
            .operation.get > header > h4 {\
                background-color: #2392f7;\
            }\
            .operation.get h5 {\
                color: #2392f7;\
            }\
            /****************/\
            .operation.post {\
                border: 1px solid #13c20f;\
            }\
            .operation.post > header {\
                background-color: #e7f9e7;\
            }\
            .operation.post > header > h4 {\
                background-color: #13c20f;\
            }\
            .operation.post h5 {\
                color: #13c20f;\
            }\
            /****************/\
            .operation.put {\
                border: 1px solid #ff9000;\
            }\
            .operation.put > header {\
                background-color: #fff4e6;\
            }\
            .operation.put > header > h4 {\
                background-color: #ff9000;\
            }\
            .operation.put h5 {\
                color: #ff9000;\
            }\
            /****************/\
            .operation.patch {\
                border: 1px solid #af01d9;\
            }\
            .operation.patch > header {\
                background-color: #f7e6fc;\
            }\
            .operation.patch > header > h4 {\
                background-color: #af01d9;\
            }\
            .operation.patch h5 {\
                color: #af01d9;\
            }\
            /****************/\
            .operation.delete {\
                border: 1px solid #e30012;\
            }\
            .operation.delete > header {\
                background-color: #fde6e7;\
            }\
            .operation.delete > header > h4 {\
                background-color: #e30012;\
            }\
            .operation.delete h5 {\
                color: #e30012;\
            }\
            /****************/\
            .operation.options {\
                border: 1px solid #bdc3c7;\
            }\
            .operation.options > header {\
                background-color: #f9f9fa;\
            }\
            .operation.options > header > h4 {\
                background-color: #bdc3c7;\
            }\
            .operation.options h5 {\
                color: #bdc3c7;\
            }\
            /****************/\
            label.yes {\
                color: #13c20f;\
            }\
            label.no {\
                color: #e30012;\
            }\
            label.deprecated {\
                background: #c52a5e;\
                padding: 0.2em 0.3em;\
                border: 1px solid #fff;\
                color: #fff;\
            }\
            .operation ul.tags {\
                float: right;\
            }\
            label.tag {\
                display: inline-block;\
                border-radius: 3px;\
                background-color: #a60000;\
                color: #fff;\
                padding: 2px 10px;\
                margin: 2px;\
            }\
            .monospace {\
                font-family: 'Lucidia Console', Monaco, 'Courier New', Courier, monospace;\
            }\
            table {\
                border-collapse: collapse;\
                border-spacing: 0;\
                width: 100%;\
                margin-bottom: 0.5em;\
            }\
            thead {\
                background-color: #f7f7f7;\
            }\
            th, td {\
                text-align: left;\
                padding: 0.3em;\
                vertical-align: top;\
            }\
            tr + tr {\
                border-top: 1px solid silver;\
            }\
            .schema > ul {\
                padding-left: 0;\
            }\
            /****************/\
            .code {\
                color: #555;\
                font-weight: bold;\
            }\
            .code-200 {\
                color: #13c20f;\
            }\
            .code-300 {\
                color: #0072bc;\
            }\
            .code-400 {\
                color: #f39822;\
            }\
            .code-500 {\
                color: #d40011;\
            }\
            /****************/\
            .definition {\
                margin-bottom: 1em;\
            }\
            .error span {\
                color: red;\
            }\
        ";
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
        if (script === '') {
            return;
        }

        try {
            var doc = JSON.parse(script)
        } catch (e) {
            sapir.append(document.body, sapir.renderParseError(e, script));
            return;
        }

        sapir.append(document.body, [
            sapir.renderTitle(doc, doc.info),
            sapir.renderInfo(doc, doc.info),
            sapir.renderToc(doc, doc.paths),
            doc.tags && sapir.renderTags(doc, doc.tags),
            sapir.renderPaths(doc, doc.paths),
            doc.definitions && sapir.renderDefinitions(doc, doc.definitions)
        ]);
    },

    renderParseError: function(e, def) {
        var error = sapir.el('div', {'class': 'error'}, [
            sapir.el('p', 'Error parsing definition:'),
            sapir.el('p', [
                sapir.el('code', null, e)
            ])
        ]);

        var positionMatch = /position (\d+)/.exec(e.message);
        if (positionMatch) {
            var pos = parseInt(positionMatch[1]);
            var before = def.substr(Math.max(0, pos - 100), 100);
            var after = def.substr(pos, 100);
            sapir.append(error, null, sapir.el('p', null, [
                sapir.el('code', {'class': 'monospace'}, '...' + before),
                sapir.el('span', '^'),
                sapir.el('code', {'class': 'monospace'}, after + '...')
            ]));
        }

        return error;
    },

    renderTitle: function(doc, info) {
        info.title && (document.title = info.title + ' - Simple API renderer');
        return sapir.el('h1', info.title);
    },

    renderInfo: function(doc, info) {
        var section = sapir.el('section', {'class': 'info'});
        info.description && sapir.append(section, [
            sapir.renderGfm(doc, info.description, 'p')
        ]);
        sapir.append(section, sapir.el('p', [
            sapir.el('strong', null, 'Version: '),
            info.version
        ]));

        info.termsOfService && sapir.append(section, [
            sapir.renderInfoTermsOfService(doc, info.termsOfService)
        ]);
        info.contact && sapir.append(section, [
            sapir.renderInfoContact(doc, info.contact)
        ]);
        info.license && sapir.append(section, [
            sapir.renderInfoLicense(doc, info.license)
        ]);
        return section;
    },

    renderInfoTermsOfService: function(doc, tos) {
        return sapir.el('section', [
            sapir.el('h4', 'Terms of service'),
            sapir.el('p', [
                sapir.el('a', {href: tos}, tos)
            ])
        ]);
    },

    renderInfoLicense: function(doc, license) {
        return sapir.el('section', [
            sapir.el('h4', 'License'),
            sapir.el('p', [
                license.url
                    ? sapir.el('a', {href: license.url}, license.name)
                    : license.name
            ])
        ]);
    },

    renderInfoContact: function(doc, contact) {
        var p = sapir.el('p');
        contact.name && sapir.append(p, [
            contact.name,
            sapir.el('br')
        ]);
        contact.url && sapir.append(p, [
            sapir.el('a', {href: contact.url}, contact.url),
            sapir.el('br')
        ]);
        contact.email && sapir.append(p, [
            sapir.el('a', {href: 'mailto:' + contact.email}, contact.email),
            sapir.el('br')
        ]);
        return sapir.el('section', [
            sapir.el('h4', 'Contact information'),
            p
        ]);
    },

    renderToc: function(doc, paths) {
        var ul = sapir.el('ul');
        sapir.each(paths, function(pathName, path) {
            sapir.each(path, function(operationName, operation) {
                sapir.append(ul, sapir.el('li', [
                    sapir.el(
                        'a',
                        {href: '#' + sapir.operationFragmentLink(doc, operationName, pathName)},
                        operationName.toUpperCase() + ' ' + pathName
                    )
                ]));
            });
        });
        return sapir.el('section', {'class': 'toc'}, [
            sapir.el('h2', 'ToC'),
            ul
        ]);
    },

    operationFragmentLink: function(doc, operationName, pathName) {
        pathName = pathName.replace(/{([^}]*)}/g, '-$1').replace(/\//g, '-');
        return operationName.replace(/[^a-z0-9_-]/ig, '') + '-' + pathName.replace(/[^a-z0-9_-]/ig, '');
    },

    renderTags: function(doc, tags) {
        return sapir.el('section', {'class': 'tags'}, [
            sapir.el('table', null, [
                sapir.el('tbody', null, [
                    sapir.each(tags, sapir.renderTag.bind(sapir, doc))
                ])
            ])
        ]);
    },

    renderTag: function(doc, tag) {
        return sapir.el('tr', [
            sapir.el('td', [
                sapir.el('label', {'class': 'tag'}, tag.name)
            ]),
            sapir.el('td', [
                tag.description && sapir.renderGfm(doc, tag.description)
            ]),
            sapir.el('td', [
                tag.externalDocs && sapir.renderTagExternalDocs(doc, tag.externalDocs)
            ])
        ]);
    },

    renderTagExternalDocs: function(doc, externalDocs) {
        return sapir.el('div', [
            externalDocs.description && sapir.renderGfm(doc, externalDocs.description),
            sapir.el('a', {href: externalDocs.url}, externalDocs.url)
        ]);
    },

    renderPaths: function(doc, paths) {
        return sapir.el('section', [
            sapir.el('header', [
                sapir.el('h2', 'Paths')
            ]),
            sapir.el('ul', {'class': 'paths'}, [
                sapir.each(paths, sapir.renderPath.bind(sapir, doc))
            ])
        ]);
    },

    renderPath: function(doc, pathString, path) {
        var operations = sapir.el('ul', {'class': 'operations'});
        sapir.each(sapir.methods, function(i, methodName) {
            path[methodName] && sapir.append(operations, [
                sapir.renderOperation(doc, pathString, path[methodName], methodName)
            ]);
        });
        return sapir.el('li', {'class': 'path'}, [
            sapir.el('h3', {'class': 'monospace'}, pathString),
            operations
        ]);
    },

    renderOperation: function(doc, pathString, data, methodName) {
        var section = sapir.el('section');
        data.tags && sapir.append(section, [
            sapir.renderOperationTags(doc, data.tags)
        ]);
        data.summary && sapir.append(section, [
            sapir.renderOperationSummary(doc, data.summary)
        ]);
        data.description && sapir.append(section, [
            sapir.renderOperationDescription(doc, data.description)
        ]);
        data.externalDocs && sapir.append(section, [
            sapir.renderOperationExternalDocs(doc, data.externalDocs)
        ]);
        data.parameters && sapir.append(section, [
            sapir.renderOperationParameters(doc, data.parameters)
        ]);
        data.security && sapir.append(section, [
            sapir.renderOperationSecurity(doc, data.security)
        ]);
        sapir.append(section, [
            sapir.renderOperationResponses(doc, data.responses)
        ]);
        return sapir.el('li', {'class': 'operation ' + methodName}, [
            sapir.el('a', {name: sapir.operationFragmentLink(doc, methodName, pathString)}),
            sapir.renderOperationHeader(doc, data, methodName, pathString),
            section
        ]);
    },

    renderOperationSummary: function(doc, summary) {
        return sapir.el('section', [
            sapir.el('h5', 'Summary'),
            sapir.el('p', [summary])
        ]);
    },

    renderOperationExternalDocs: function(doc, externalDocs) {
        var p = sapir.el('p');
        externalDocs.description && sapir.append(p, [
            sapir.renderGfm(doc, externalDocs.description)
        ]);
        sapir.append(p, [
            sapir.el('a', {href: externalDocs.url}, externalDocs.url)
        ]);
        return sapir.el('section').append(
            sapir.el('h5', 'External Documentation'),
            p
        );
    },

    renderOperationHeader: function(doc, header, methodName, pathString) {
        var retheader = sapir.el('header', [
            sapir.el('h4', {'class': 'monospace'}, methodName.toUpperCase() + ' ' + pathString)
        ]);
        retheader.deprecated && sapir.append(retheader, [
            sapir.el('label', {'class': 'deprecated'}, 'Deprecated')
        ]);
        return retheader;
    },

    renderOperationTags: function(doc, tags) {
        return sapir.el('ul', {'class': 'tags'}, [
            sapir.each(tags, function(key, value) {
                return sapir.el('li', [
                    sapir.el('label', {'class': 'tag'}, value)
                ]);
            })
        ]);
    },

    renderOperationDescription: function(doc, description) {
        return sapir.el('section', [
            sapir.el('h5', 'Description'),
            sapir.el('p', [description])
        ]);
    },

    renderOperationSecurity: function(doc, security) {
        return sapir.el('section', '@todo operation.security');
    },

    renderOperationParameters: function(doc, parameters) {
        return sapir.el('section', [
            sapir.el('h5', 'Parameters'),
            sapir.el('table', [
                sapir.el('thead', [
                    sapir.el('tr', [
                        sapir.el('th', 'Name'),
                        sapir.el('th', 'Located in'),
                        sapir.el('th', 'Description'),
                        sapir.el('th', 'Required'),
                        sapir.el('th', 'Schema')
                    ])
                ]),
                sapir.el('tbody', sapir.each(parameters, function(key, parameter) {
                    return sapir.el('tr', [
                        sapir.el('td', [parameter.name]),
                        sapir.el('td', [parameter.in]),
                        sapir.el('td', [
                            sapir.renderGfm(doc, parameter.description)
                        ]),
                        sapir.el('td', [
                            sapir.el(
                                'label',
                                {'class': parameter.required ? 'yes' : 'no'},
                                parameter.required ? 'Yes' : 'No'
                            )
                        ]),
                        sapir.el('td', {'class': 'schema'}, [
                            parameter.in === 'body'
                                ? sapir.renderSchemaObject(doc, parameter.schema)
                                : sapir.renderItemsObject(doc, parameter)
                        ])
                    ]);
                }))
            ])
        ]);
    },

    renderItemsObject: function(doc, item) {
        return sapir.el('ul', [
            sapir.el('li', [
                sapir.el('strong', 'Type: '),
                sapir.el('span', {'class': 'monospace'}, item.type)
            ]),
            item.format && sapir.el('li', [
                sapir.el('strong', 'Format: '),
                sapir.el('span', {'class': 'monospace'}, item.format)
            ]),
            typeof item.allowEmptyValue !== 'undefined' && sapir.el('li', [
                sapir.el('strong', 'Allow empty: '),
                sapir.el('label', {'class': item.allowEmptyValue ? 'yes' : 'no'}, item.allowEmptyValue ? 'Yes' : 'No')
            ]),
            item.items && sapir.el('ul', [
                sapir.renderItemsObject(doc, item.items)
            ]),
            item.collectionFormat && sapir.el('li', [
                sapir.el('strong', 'Collection format: '),
                item.collectionFormat
            ]),
            typeof item.default !== 'undefined' && sapir.el('li', [
                sapir.el('strong', 'Default: '),
                sapir.el('span', {'class': 'monospace'}, item.default)
            ]),
            typeof item.maximum !== 'undefined' && sapir.el('li', [
                sapir.el('strong', 'Maximum: '),
                sapir.el('span', {'class': 'monospace'}, item.maximum)
            ]),
            typeof item.exclusiveMaximum !== 'undefined' && sapir.el('li', [
                sapir.el('strong', 'Exclusive Maximum: '),
                sapir.el('label', {'class': item.exclusiveMaximum ? 'yes' : 'no'}, item.exclusiveMaximum ? 'Yes' : 'No')
            ]),
            typeof item.minimum !== 'undefined' && sapir.el('li', [
                sapir.el('strong', 'Minimum: '),
                sapir.el('span', {'class': 'monospace'}, item.minimum)
            ]),
            typeof item.exclusiveMinimum !== 'undefined' && sapir.el('li', [
                sapir.el('strong', 'Exclusive Minimum: '),
                sapir.el('label', {'class': item.exclusiveMinimum ? 'yes' : 'no'}, item.exclusiveMinimum ? 'Yes' : 'No')
            ]),
            typeof item.maxLength !== 'undefined' && sapir.el('li', [
                sapir.el('strong', 'MaxLength: '),
                sapir.el('span', {'class': 'monospace'}, item.maxLength)
            ]),
            typeof item.minLength !== 'undefined' && sapir.el('li', [
                sapir.el('strong', 'minLength: '),
                sapir.el('span', {'class': 'monospace'}, item.minLength)
            ]),
            item.pattern && sapir.el('li', [
                sapir.el('strong', 'Pattern: '),
                item.pattern
            ]),
            typeof item.maxItems !== 'undefined' && sapir.el('li>', [
                sapir.el('strong', 'MaxItems: '),
                sapir.el('span', {'class': 'monospace'}, item.maxItems)
            ]),
            typeof item.minItems !== 'undefined' && sapir.el('li', [
                sapir.el('strong', 'MinItems: '),
                sapir.el('span', {'class': 'monospace'}, item.minItems)
            ]),
            typeof item.uniqueItems !== 'undefined' && sapir.el('li', [
                sapir.el('strong', 'Unique items: '),
                sapir.el('label', {'class': item.uniqueItems ? 'yes' : 'no'}, item.exclusiveMinimum ? 'Yes' : 'No')
            ]),
            typeof item.enum !== 'undefined' && sapir.el('li', [
                sapir.el('strong', 'Enum: '),
                sapir.el('span', {'class': 'monospace'}, item.enum)
            ]),
            typeof item.multipleOf !== 'undefined' && sapir.el('li', [
                sapir.el('strong', 'MultipleOf: '),
                sapir.el('span', {'class': 'monospace'}, item.multipleOf)
            ])
        ]);
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
        return sapir.el('section', [
            sapir.el('h5', 'Responses'),
            sapir.el('table', [
                sapir.el('thead', [
                    sapir.el('tr', [
                        sapir.el('th', 'Code'),
                        sapir.el('th', 'Description'),
                        hasHeaders && sapir.el('th', 'Headers'),
                        hasSchema && sapir.el('th', 'Schema'),
                        hasExamples && sapir.el('th', 'Examples')
                    ])
                ]),
                sapir.el('tbody', sapir.each(responses, function(code, parameter) {
                    return sapir.el('tr', [
                        sapir.el('td', [
                            sapir.el('span', {'class': sapir.codeToClass(code)}, code)
                        ]),
                        sapir.el('td', [
                            sapir.renderGfm(doc, parameter.description)
                        ]),
                        hasHeaders && sapir.el('td', [
                            parameter.headers && sapir.renderOperationResponseHeaders(doc, parameter.headers)
                        ]),
                        hasSchema && sapir.el('td', [
                            sapir.renderSchemaObject(doc, parameter.schema)
                        ]),
                        hasExamples && sapir.el('td', [
                            parameter.examples && sapir.renderOperationResponseExamples(doc, parameter.examples)
                        ])
                    ]);
                }))
            ])
        ]);
    },

    renderOperationResponseHeaders: function(doc, headers) {
        return sapir.el('table', {'class': 'headers'}, [
            sapir.el('thead', [
                sapir.el('tr', [
                    sapir.el('th', 'Name'),
                    sapir.el('th', 'Description'),
                    sapir.el('th', 'Type'),
                    sapir.el('th', 'Details')
                ])
            ]),
            sapir.el('tbody', sapir.each(headers, function(headerName, header) {
                return sapir.el('tr', [
                    sapir.el('td', {'class': 'monospace'}, headerName),
                    sapir.el('td', [
                        sapir.renderGfm(doc, header.description)
                    ]),
                    sapir.el('td', {'class': 'monospace'}, header.type),
                    sapir.el('td', [
                        sapir.renderItemsObject(doc, header)
                    ])
                ]);
            }))
        ]);
    },

    renderOperationResponseExamples: function(doc, examples) {
        return sapir.each(examples, function(contentType, example) {
            var out = typeof example !== 'string' ? JSON.stringify(example, null, 2) : example;
            return sapir.el('pre', [contentType + ': ' + out]);
        });
    },

    codeToClass: function(code) {
        return 'code code-' + ('' + code.substr(0, 1)) + '00';
    },

    renderDefinitions: function(doc, definitions) {
        return sapir.el('section', [
            sapir.el('h2', 'Models'),
            sapir.el('ul', {'class': 'definitions'}, [
                sapir.each(definitions, sapir.renderDefinition.bind(sapir, doc))
            ])
        ]);
    },

    renderDefinition: function(doc, definitionName, definition) {
        return sapir.el('li', {'class': 'definition'}, [
            sapir.el('h3', [definitionName]),
            sapir.renderSchemaObject(doc, definition)
        ]);
    },

    renderSchemaObject: function(doc, schema) {
        if (!schema) {
            return null;
        }
        if (ref = schema['$ref']) {
            schema = sapir.find(doc, ref);
        }
        return sapir.el('pre', [JSON.stringify(schema, null, 2)]);
    },

    renderGfm: function(doc, text, as) {
        return sapir.el(as || 'div', null, text);
    },

    find: function(doc, ref) {
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
window.onload = function() {
    var scripts = sapir.each(document.getElementsByTagName('script'), function(key, script) {
        return script.textContent;
    });
    document.body.textContent = "";
    sapir.each(scripts, sapir.renderDocument);
};
