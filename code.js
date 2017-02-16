var miad = {
    injectCss: function() {
        var style = document.createElement('style');
        style.innerText = `

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
    renderSpecification: function() {
        var data = JSON.parse(this.innerText)
        $(document.body).append(
            miad.renderInfo(data),
            miad.renderPaths(data),
            miad.renderModels(data)
        );
    },
    renderInfo(data) {
        return $('<div>').append(
            $('<h1>', {text: data.info.title}),
            $('<p>', {text: data.info.description}),
            $('<p>', {text: 'Version: ' + data.info.version}),
            miad.renderInfoContact(data.info.contact),
            miad.renderInfoTermsOfService(data.info.termsOfService),
            miad.renderInfoLicense(data.info.license)
        );
    },
    renderInfoTermsOfService(data) {
        return $('<section>').append(
            $('<h4>', {text: 'Terms of service'}),
            $('<p>').append(
                $('<a>', {href: data, text: data})
            )
        );
    },
    renderInfoLicense(data) {
        return $('<section>').append(
            $('<h4>', {text: 'License'}),
            $('<p>').append(
                data.url
                    ? $('<a>', {href: data.url, text: data.name})
                    : document.createTextNode(data.name)
            )
        );
    },
    renderInfoContact(data) {
        var $p = $('<p>');
        if (data.name) {
            $p.append(
                document.createTextNode(data.name),
                '<br>'
            )
        }
        if (data.url) {
            $p.append(
                $('<a>', {href: data.url, text: data.url}),
                '<br>'
            )
        }
        if (data.email) {
            $p.append(
                $('<a>', {href: 'mailto:' + data.email, text: data.email}),
                '<br>'
            )
        }
        return $('<section>').append(
            $('<h4>', {text: 'Contact information'}),
            $p
        );
    },
    renderPaths(data) {
        return $('<div>').append(
            $('<header>').append(
                $('<h2>', {text: 'Paths'})
            ),
            $('<ul>', {'class': 'paths'}).append(
                $.map(data.paths, miad.renderPath)
            )
        );
    },
    renderPath(data, path) {
        return $('<li>', {'class': 'path'}).append(
            $('<h3>', {text: path}),
            $('<ul>', {'class': 'operations'}).append(
                $.map(data, miad.renderOperation.bind(miad, path))
            )
        );
    },
    renderOperation(path, data, operation) {
        return $('<li>', {'class': 'operation ' + operation}).append(
            $('<header>').append(
                $('<div>', {'class': 'http-method', text: operation.toUpperCase() + ' ' + path}),
                miad.renderOperationDescription(data.description),
                miad.renderOperationParameters(data.parameters),
                miad.renderOperationResponses(data.responses)
            )
        );
    },
    renderOperationDescription(data) {
        return $('<section>').append(
            $('<h4>', {text: 'Description'}),
            $('<p>', {text: data})
        );
    },
    renderOperationParameters(data) {
        return $('<section>').append(
            $('<h4>', {text: 'Parameters'}),
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
                $('<tbody>').append($.map(data, function(parameter) {
                    return $('<tr>').append(
                        $('<td>', {text: parameter.name}),
                        $('<td>', {text: parameter.query}),
                        $('<td>', {text: parameter.description}),
                        $('<td>', {text: parameter.required ? 'true' : 'false'}),
                        $('<td>', {text: '@todo'})
                    );
                }))
            )
        );
    },
    renderOperationResponses(data) {
        return $('<section>').append(
            $('<h4>', {text: 'Responses'}),
            $('<table>').append(
                $('<thead>').append(
                    $('<tr>').append(
                        $('<th>', {text: 'Code'}),
                        $('<th>', {text: 'Description'}),
                        $('<th>', {text: 'Schema'})
                    )
                ),
                $('<tbody>').append($.map(data, function(parameter, code) {
                    return $('<tr>').append(
                        $('<td>', {text: code}),
                        $('<td>', {text: parameter.description}),
                        $('<td>', {text: '@todo'})
                    );
                }))
            )
        );
    },
    renderModels(data) {
        return $('<section>').append(
            $('<h2>', {text: 'Models'}),
            $('<ul>').append(
                $.map(data.definitions, miad.renderDefinitionItem)
            )
        );
    },
    renderDefinitionItem(data, definitionName) {
        return $('<li>').append(
            $('<h3>', {text: definitionName}),
            miad.renderDefinition(data)
        );
    },
    renderDefinition(data) {
        return "@todo";
    }
};

miad.injectCss();
miad.loadScript('https://code.jquery.com/jquery-3.1.1.min.js', function() {
    $('script[type="application/json"]').each(miad.renderSpecification);
});