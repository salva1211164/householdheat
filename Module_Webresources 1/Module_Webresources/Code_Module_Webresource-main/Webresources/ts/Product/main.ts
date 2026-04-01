namespace Product.Main {
    /**
     * Constants related to the Product Main functionality
     */
    // Product
    const TYPE = 'hhh_type';

    // Boiler fields
    const BOILER_TYPE        = 'hhh_boilertype';
    const CONFIGURATION_TYPE = 'hhh_configurationtype';
    const ORIENTATION        = 'hhh_orientation';
    const FEATURES           = 'hhh_features';
    const POWER              = 'hhh_power';

    // Solar panel fields
    const SOLAR_PANEL_TYPE   = 'hhh_solarpaneltype';
    const ELECTRICAL_CURRENT = 'hhh_electricalcurrent';
    const VOLTAGE            = 'hhh_voltage';
    const TOLERANCE          = 'hhh_tolerance';
    const LENGTH             = 'hhh_length';
    const WIDTH              = 'hhh_width';
    const EFFICIENCY         = 'hhh_efficiency';

    // Shared conditional fields
    const WATER_CAPACITY     = 'hhh_watercapacity';
    const ENERGY_TYPE        = 'hhh_energytype';
    const SOLAR_CELL_TYPES   = 'hhh_solarcelltypethinfilm';

    //Default Values
    const DEFAULT_POWER_VALUE_COMPATIBLE_BOILER = 24;
    const DEFAULT_POWER_VALUE_CONVENTIONAL_BOILER = 18;
    const DEFAULT_WATER_CAPACITY_VALUE_CONVNTIONAL_BOILER = 120;
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

    /**
     * Handles the form's onLoad
     * 
     */
    export async function onLoad(executionContext: Xrm.Events.EventContext) {
        const formContext = executionContext.getFormContext();

        applyFieldRules(executionContext);

        if ((executionContext as any).getEventArgs().getDataLoadState() === 1) {
            formContext.getAttribute(TYPE).addOnChange(applyFieldRules);
            formContext.getAttribute(BOILER_TYPE).addOnChange(applyBoilerFieldRules);
            formContext.getAttribute(SOLAR_PANEL_TYPE).addOnChange(applySolarPanelFieldRules);
        }
    }

    function applyFieldRules(executionContext: Xrm.Events.EventContext): void {
        
        const typeAttribute = executionContext.getFormContext().getAttribute<Xrm.Attributes.OptionSetAttribute>(TYPE).getValue();
        
        if (typeAttribute === TYPE_VALUES.BOILER) {
            hideAllSolarPanelFields(executionContext);
            applyBoilerFieldRules(executionContext);
        } else if (typeAttribute === TYPE_VALUES.SOLAR_PANEL) {
            hideAllBoilerFields(executionContext);
            applySolarPanelFieldRules(executionContext);
        } else {
            hideAllBoilerFields(executionContext);
            hideAllSolarPanelFields(executionContext);
        }

    }

    function applyBoilerFieldRules(executionContext: Xrm.Events.EventContext): void {
        
        const formContext = executionContext.getFormContext();
        
        const isNewRecord = executionContext.getFormContext().ui.getFormType() === 1; //1 corresponds to when the form is created but not yet saved

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
        if (!isNewRecord) {
            powerControl.setVisible(true);
            powerControl.setDisabled(true);
            if (isConventionalBoiler) {
                powerAttribute.setValue(DEFAULT_POWER_VALUE_CONVENTIONAL_BOILER);
            } else {
                powerAttribute.setValue(DEFAULT_POWER_VALUE_COMPATIBLE_BOILER);
            }
        }


        if (isConventionalBoiler) {
            energyTypeControl.setVisible(true);
            if (!isNewRecord) {
                waterCapacityControl.setVisible(true);
                waterCapacityControl.setDisabled(true);
                waterCapacityAttribute.setValue(DEFAULT_WATER_CAPACITY_VALUE_CONVNTIONAL_BOILER);
            }
        } else {
            energyTypeControl.setVisible(false);
            waterCapacityControl.setVisible(false);
        }
        
    }

    function applySolarPanelFieldRules(executionContext: Xrm.Events.EventContext): void {
        
        const formContext = executionContext.getFormContext();

        const isNewRecord = executionContext.getFormContext().ui.getFormType() === 1; //1 corresponds to when the form is created but not yet saved

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

        if (isSolarWaterHeatingSystem && !isNewRecord) {
            solarCellTypesControl.setVisible(false);
            waterCapacityControl.setVisible(true);
            waterCapacityControl.setDisabled(true);
            waterCapacityAttribute.setValue(DEFAULT_WATER_CAPACITY_VALUE_SOLAR_WATER_HEATING_SYSTEM);
        } else if (isSolarPhotovoltaicPanel) {
            solarCellTypesControl.setVisible(true);
            waterCapacityControl.setVisible(false);
        } else {
            waterCapacityControl.setVisible(false);
            solarCellTypesControl.setVisible(false);
        }
    }

    function hideAllBoilerFields(executionContext: Xrm.Events.EventContext): void {
        const formContext = executionContext.getFormContext();

        formContext.getControl<Xrm.Controls.OptionSetControl>(BOILER_TYPE).setVisible(false);
        formContext.getAttribute<Xrm.Attributes.OptionSetAttribute>(BOILER_TYPE).setRequiredLevel('none');
        formContext.getControl<Xrm.Controls.StandardControl>(CONFIGURATION_TYPE).setVisible(false);
        formContext.getControl<Xrm.Controls.OptionSetControl>(ORIENTATION).setVisible(false);
        formContext.getControl<Xrm.Controls.StandardControl>(FEATURES).setVisible(false);
        formContext.getControl<Xrm.Controls.StandardControl>(POWER).setVisible(false);
        formContext.getControl<Xrm.Controls.OptionSetControl>(ENERGY_TYPE).setVisible(false);
        formContext.getControl<Xrm.Controls.StandardControl>(WATER_CAPACITY).setVisible(false);
    }

    function hideAllSolarPanelFields(executionContext: Xrm.Events.EventContext): void {
        const formContext = executionContext.getFormContext();
        
        formContext.getControl<Xrm.Controls.OptionSetControl>(SOLAR_PANEL_TYPE).setVisible(false);
        formContext.getAttribute<Xrm.Attributes.OptionSetAttribute>(SOLAR_PANEL_TYPE).setRequiredLevel('none');
        formContext.getControl<Xrm.Controls.StandardControl>(ELECTRICAL_CURRENT).setVisible(false);
        formContext.getControl<Xrm.Controls.StandardControl>(VOLTAGE).setVisible(false);
        formContext.getControl<Xrm.Controls.StandardControl>(TOLERANCE).setVisible(false);
        formContext.getControl<Xrm.Controls.StandardControl>(LENGTH).setVisible(false);
        formContext.getControl<Xrm.Controls.StandardControl>(WIDTH).setVisible(false);
        formContext.getControl<Xrm.Controls.StandardControl>(EFFICIENCY).setVisible(false);
        formContext.getControl<Xrm.Controls.StandardControl>(SOLAR_CELL_TYPES).setVisible(false);
        formContext.getControl<Xrm.Controls.StandardControl>(WATER_CAPACITY).setVisible(false);
    }
}