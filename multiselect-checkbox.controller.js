(function () {
    'use strict';

    angular
        .module('nrev')
        .controller('multiselectCheckboxController', multiselectCheckboxController);

	multiselectCheckboxController.$inject = [
        '$scope',
        '$attrs',
        '$window'
	];

    function multiselectCheckboxController(
        $scope,
        $attrs,
        $window
    ) {

        var multiselectlistoptions = $attrs.multiselectlistoptions,
            multiselectmodel = $attrs.multiselectmodel,
            multiselectcallback = $attrs.multiselectcallback,
            tablesrc = $attrs.tablesrc,
            multiselectconfig = JSON.parse($attrs.multiselectconfig),
            checkboxVariables = multiselectconfig.variables;

        // multiselect model
        $scope[multiselectmodel] = {};

        // variableEnum
        $scope.variableEnum = [];

        $scope.$watch('localData.regvars.' + checkboxVariables[0] + '.value', function() {
            var anyVariableSelected = false;

            for (var variable in checkboxVariables) {
                if (checkboxVariables.hasOwnProperty(variable)) {
                    var registerVariable = checkboxVariables[variable];

                    if (!!$scope.localData.regvars[registerVariable].value) {
                        anyVariableSelected = true;

                        break;
                    }
                }
            }

            if (!anyVariableSelected) {
                $scope[multiselectmodel].selected = null;
            }

        });

        /**
         * Check onload if the variables have values selected if so set multiselect with the values
         */
         function checkVariables() {

            if (checkboxVariables && checkboxVariables.length > 0) {
                var selectedValues = [],
                    allMultiselectOptionSrc = $scope[multiselectlistoptions];

                if (!!$scope.localData.regvars[checkboxVariables[0]].value) {

                    for (var variable in checkboxVariables) {
                        if (checkboxVariables.hasOwnProperty(variable)) {
                            var registerVariable = checkboxVariables[variable],
                                variableVal = $scope.localData.regvars[registerVariable].value,
                                enumVariable = $scope.variableEnum[variable],
                                enumVariableVal = enumVariable[registerVariable] ? enumVariable[registerVariable].value : undefined;

                            allMultiselectOptionSrc.map(function(selectedOption) {

                                if (!!variableVal && selectedOption.value === enumVariableVal) {
                                    selectedValues.push(selectedOption);
                                }

                            });

                        }
                    }

                    $scope[multiselectmodel].selected = selectedValues;
                }

            }

         }

        /**
         * Add options to multiselect variable
         */
        function addMultiselectValues() {
            var metadata = $scope.metadata[tablesrc],
                multiselectOptions = [];

            if (metadata && metadata.regvars) {

                checkboxVariables.map(function(variableName) {
                    var formatVariableEnum = {},
                        multiSelectFormat = {},
                        variableDescription = !!metadata.regvars[variableName] ? metadata.regvars[variableName].description : undefined;

                    formatVariableEnum[variableName] = {};

                    if (!!formatVariableEnum[variableName]) {
                        formatVariableEnum[variableName].value = variableDescription;
                    }

                    multiSelectFormat.value = formatVariableEnum[variableName].value;
                    multiselectOptions.push(multiSelectFormat);

                    $scope.variableEnum.push(formatVariableEnum);

                });

            }

            $scope[multiselectlistoptions] = multiselectOptions;

            checkVariables();
        }

        // Populate multiselect
        addMultiselectValues();

        /**
         * option selected in multiselect
         */
        $scope.onSelectCallback = function (item, model) {
            var baseCallback = $scope[multiselectcallback];

            if (item !== undefined) {

                for (var variable in checkboxVariables) {
                    if (checkboxVariables.hasOwnProperty(variable)) {
                        var registerVariable = checkboxVariables[variable],
                            variableIsEmpty = !$scope.localData.regvars[registerVariable].value,
                            enumVariable = $scope.variableEnum[variable],
                            enumVariableVal = enumVariable[registerVariable] ? enumVariable[registerVariable].value : undefined;

                        if (variableIsEmpty && enumVariableVal === item.value) {
                            $scope.localData.regvars[registerVariable].value = true;

                            if (baseCallback && typeof baseCallback === 'function') {
                                baseCallback(registerVariable);
                            }

                            break;
                        }

                    }
                }

            }

        };

        /**
         * option cleared
         */
        $scope.clearOptions = function (item, model) {
            var baseCallback = $scope[multiselectcallback];

            if (item !== undefined) {

                for (var variable in checkboxVariables) {
                    if (checkboxVariables.hasOwnProperty(variable)) {
                        var registerVariable = checkboxVariables[variable],
                            variableVal = $scope.localData.regvars[registerVariable].value,
                            enumVariable = $scope.variableEnum[variable],
                            enumVariableVal = enumVariable[registerVariable] ? enumVariable[registerVariable].value : undefined;

                        if (item.value === enumVariableVal) {
                            $scope.localData.regvars[registerVariable].value = null;

                            if (baseCallback && typeof baseCallback === 'function') {
                                baseCallback(registerVariable);
                            }

                            break;
                        }
                    }
                }

            }

        };

    }

}());
