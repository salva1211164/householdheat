namespace Product.Main {

    /**
     * Constants related to the Product Main functionality
     */

    //Product
    const TYPE = 'hhh_type';

    //Boiler fields
    const BOILER_TYPE = 'hhh_boilertype';
    const CONFIGURATION_TYPE = 'hhh_configurationtype';
    const ORIENTATION = 'hhh_orientation';
    const FEATURES = 'hhh_features';
    const POWER = 'hhh_power';
    const ENERGY_TYPE = 'hhh_energytype';

    //Solar panel fields
    const SOLAR_PANEL_TYPE = 'hhh_solarpaneltype';
    const ELECTRICAL_CURRENT = 'hhh_electricalcurrent';
    const VOLTAGE = 'hhh_voltage';
    const TOLERANCE = 'hhh_tolerance';
    const LENGTH = 'hhh_length';
    const WIDTH = 'hhh_width';
    const EFFICIENCY = 'hhh_efficiency';
    const SOLAR_CELL_TYPES = 'hhh_solarcelltypethinfilm';

    //Shared  fields
    const WATER_CAPACITY = 'hhh_watercapacity';
    
    //Default Values
    const DEFAULT_POWER_VALUE_COMPATIBLE_BOILER = 24;
    const DEFAULT_POWER_VALUE_CONVENTIONAL_BOILER = 18;
    const DEFAULT_WATER_CAPACITY_VALUE_CONVENTIONAL_BOILER = 120;
    const DEFAULT_WATER_CAPACITY_VALUE_SOLAR_WATER_HEATING_SYSTEM = 200;

    const TYPE_VALUES = {
        BOILER:      2,
        SOLAR_PANEL: 1,
    };

    const BOILER_TYPE_VALUES = {
        CONVENTIONAL_BOILER:  0,
        COMPATIBLE_BOILER:   1,
    };

    const SOLAR_PANEL_TYPE_VALUES = {
        SOLAR_WATER_HEATING_SYSTEM: 0,
        SOLAR_PHOTOVOLTAIC_PANEL: 1,
    };


    //List of fields related to either Solar Panels or Boilers, used to hide the fields when they're not needed
    const ALL_BOILER_FIELDS = [BOILER_TYPE, CONFIGURATION_TYPE, ORIENTATION, FEATURES, POWER, ENERGY_TYPE, WATER_CAPACITY];
    const ALL_SOLAR_PANEL_FIELDS = [SOLAR_PANEL_TYPE, ELECTRICAL_CURRENT, VOLTAGE, TOLERANCE, LENGTH, WIDTH, EFFICIENCY, SOLAR_CELL_TYPES, WATER_CAPACITY];

    /**
     * Handles the form's onLoad
     * 
     */
    export async function onLoad(executionContext: Xrm.Events.EventContext) {
        const formContext = executionContext.getFormContext();

        applyFieldRules(executionContext); //function that applies the visibility, required level, and default value rules for the fields on the form based on the type of product and other field values

        if ((executionContext as any).getEventArgs().getDataLoadState() === 1) {
            formContext.getAttribute(TYPE).addOnChange(applyFieldRules); //whenever the type of product changes, re-apply field rules
            formContext.getAttribute(BOILER_TYPE).addOnChange(applyBoilerFieldRules); //whenever the type of boiler changes, re-apply boiler field rules
            formContext.getAttribute(SOLAR_PANEL_TYPE).addOnChange(applySolarPanelFieldRules); //whenever the type of solar panel changes, re-apply solar panel field rules
        }
    }


    /**
     * Applies the visibility, required level, and default value rules for the fields on the form based on the type of product and other field values
     * 
     */
    function applyFieldRules(executionContext: Xrm.Events.EventContext): void {
        
        const formContext = executionContext.getFormContext();
        const typeAttribute = formContext.getAttribute<Xrm.Attributes.OptionSetAttribute>(TYPE).getValue();
        
        if (typeAttribute === TYPE_VALUES.BOILER) { //if product type is boiler, show boiler related fields and hide solar panel related fields
            hideFields(executionContext, ALL_SOLAR_PANEL_FIELDS);
            formContext.getAttribute(SOLAR_PANEL_TYPE).setRequiredLevel('none');
            applyBoilerFieldRules(executionContext);
        } else if (typeAttribute === TYPE_VALUES.SOLAR_PANEL) { //if product type is solar panel, show solar panel related fields and hide boiler related fields
            hideFields(executionContext, ALL_BOILER_FIELDS);
            formContext.getAttribute(BOILER_TYPE).setRequiredLevel('none');
            applySolarPanelFieldRules(executionContext);
        } else { //if product type has not been defined yet, hide both solar panel and boiler related fields
            hideFields(executionContext, ALL_SOLAR_PANEL_FIELDS);
            hideFields(executionContext, ALL_BOILER_FIELDS);
            formContext.getAttribute(BOILER_TYPE).setRequiredLevel('none');
            formContext.getAttribute(SOLAR_PANEL_TYPE).setRequiredLevel('none'); 
        }

    }

    /**
     * Handles the visibility, required level, and default value of fields related to boilers based on the type of boiler selected
     * 
     */

    function applyBoilerFieldRules(executionContext: Xrm.Events.EventContext): void {
        
        const formContext = executionContext.getFormContext();
        
        const isNewRecord = formContext.ui.getFormType() === 1; //1 corresponds to when the form is created but not yet saved

        const boilerTypeAttribute = formContext.getAttribute<Xrm.Attributes.OptionSetAttribute>(BOILER_TYPE);
        const powerAttribute = formContext.getAttribute<Xrm.Attributes.NumberAttribute>(POWER);
        const waterCapacityAttribute = formContext.getAttribute<Xrm.Attributes.NumberAttribute>(WATER_CAPACITY);

        const isConventionalBoiler = boilerTypeAttribute.getValue() === BOILER_TYPE_VALUES.CONVENTIONAL_BOILER;

        const boilerTypeControl = formContext.getControl<Xrm.Controls.OptionSetControl>(BOILER_TYPE);
        const configurationTypeControl = formContext.getControl<Xrm.Controls.StandardControl>(CONFIGURATION_TYPE);
        const orientationControl = formContext.getControl<Xrm.Controls.OptionSetControl>(ORIENTATION);
        const featuresControl = formContext.getControl<Xrm.Controls.OptionSetControl>(FEATURES);
        const powerControl = formContext.getControl<Xrm.Controls.StandardControl>(POWER);
        const energyTypeControl = formContext.getControl<Xrm.Controls.OptionSetControl>(ENERGY_TYPE);
        const waterCapacityControl = formContext.getControl<Xrm.Controls.StandardControl>(WATER_CAPACITY);

        //Show boiler general fields
        boilerTypeControl.setVisible(true);
        boilerTypeAttribute.setRequiredLevel('required'); 
        configurationTypeControl.setVisible(true);
        orientationControl.setVisible(true);
        featuresControl.setVisible(true);

        if (isConventionalBoiler) { //if it's a conventional boiler, show energy type

            energyTypeControl.setVisible(true);

            if (!isNewRecord) { //if besides being a conventional boiler, the record has already been created, show and lock power and water capacity fields and set default values for them

                powerControl.setVisible(true);
                powerControl.setDisabled(true);
                powerAttribute.setValue(DEFAULT_POWER_VALUE_CONVENTIONAL_BOILER);
                waterCapacityControl.setVisible(true);
                waterCapacityControl.setDisabled(true);
                waterCapacityAttribute.setValue(DEFAULT_WATER_CAPACITY_VALUE_CONVENTIONAL_BOILER);
            }

        } else { //if it's a compatible boiler, hide energy type and water capacity

            energyTypeControl.setVisible(false);
            waterCapacityControl.setVisible(false);

            if (!isNewRecord) { //if besides being a compatible boiler, the record has already been created, show and lock power field and set default value for it

                powerControl.setVisible(true);
                powerControl.setDisabled(true);
                powerAttribute.setValue(DEFAULT_POWER_VALUE_COMPATIBLE_BOILER);
            }
        }
        
    }

    /**
     * Handles the visibility, required level, and default value of fields related to solar panels based on the type of solar panel selected
     * 
     */

    function applySolarPanelFieldRules(executionContext: Xrm.Events.EventContext): void {
        
        const formContext = executionContext.getFormContext();

        const isNewRecord = formContext.ui.getFormType() === 1; //1 corresponds to when the form is created but not yet saved

        const solarPanelTypeAttribute = formContext.getAttribute<Xrm.Attributes.OptionSetAttribute>(SOLAR_PANEL_TYPE);
        const waterCapacityAttribute = formContext.getAttribute<Xrm.Attributes.NumberAttribute>(WATER_CAPACITY);

        const isSolarWaterHeatingSystem = solarPanelTypeAttribute.getValue() === SOLAR_PANEL_TYPE_VALUES.SOLAR_WATER_HEATING_SYSTEM;
        const isSolarPhotovoltaicPanel = solarPanelTypeAttribute.getValue() === SOLAR_PANEL_TYPE_VALUES.SOLAR_PHOTOVOLTAIC_PANEL;

        const solarPanelTypeControl = formContext.getControl<Xrm.Controls.OptionSetControl>(SOLAR_PANEL_TYPE);
        const electricalCurrentControl = formContext.getControl<Xrm.Controls.StandardControl>(ELECTRICAL_CURRENT);
        const voltageControl = formContext.getControl<Xrm.Controls.StandardControl>(VOLTAGE);
        const toleranceControl = formContext.getControl<Xrm.Controls.StandardControl>(TOLERANCE);
        const lengthControl = formContext.getControl<Xrm.Controls.StandardControl>(LENGTH);
        const widthControl = formContext.getControl<Xrm.Controls.StandardControl>(WIDTH);
        const efficiencyControl = formContext.getControl<Xrm.Controls.StandardControl>(EFFICIENCY);
        const solarCellTypesControl = formContext.getControl<Xrm.Controls.StandardControl>(SOLAR_CELL_TYPES);
        const waterCapacityControl = formContext.getControl<Xrm.Controls.StandardControl>(WATER_CAPACITY);

        //Show solar panel general fields
        solarPanelTypeControl.setVisible(true);
        solarPanelTypeAttribute.setRequiredLevel('required');
        electricalCurrentControl.setVisible(true);
        voltageControl.setVisible(true);
        toleranceControl.setVisible(true);
        lengthControl.setVisible(true);
        widthControl.setVisible(true);
        efficiencyControl.setVisible(true);

        if (isSolarWaterHeatingSystem) { //if it's a solar water heating system, show water capacity

            solarCellTypesControl.setVisible(false);

            if (!isNewRecord) { //if besides being a solar water heating system, the record has already been created, show and lock water capacity field and set default value for it

                waterCapacityControl.setVisible(true);
                waterCapacityControl.setDisabled(true);
                waterCapacityAttribute.setValue(DEFAULT_WATER_CAPACITY_VALUE_SOLAR_WATER_HEATING_SYSTEM);

            } else { //if instead it's a new record, hide water capacity

                waterCapacityControl.setVisible(false);

            }

        } else if (isSolarPhotovoltaicPanel) { //if it's a solar photovoltaic panel, show solar cell types and hide water capacity

            solarCellTypesControl.setVisible(true);
            waterCapacityControl.setVisible(false);

        } else { //if it has not been defined yet, hide both water capacity and solar cell types

            waterCapacityControl.setVisible(false);
            solarCellTypesControl.setVisible(false);

        }

    }

    /**
     * This fuction receives an array containing the logical name of fields, and then iterates through them, hiding each
     */
    function hideFields(executionContext: Xrm.Events.EventContext, fields: string[]): void {
        const formContext = executionContext.getFormContext();

        fields.forEach(field => formContext.getControl<Xrm.Controls.StandardControl>(field).setVisible(false));
    }
}