const _loadTemplate = function(templateFile, after) {
    $('div.templates').load(templateFile, after);
};

export {
    _loadTemplate as loadTemplate
};