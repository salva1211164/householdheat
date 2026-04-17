namespace Container.Main {
    /** 
     * Constants related to the Container Main functionality.
     */
    const TYPE_OF_PRODUCT = 'hhh_typeofproduct';
    const WEIGHT = 'hhh_weight';
    const PRODUCT_TYPE_VALUES = {
        Items: 2,
        Units: 1,
        RawMaterial: 0,
    };
    const ITEM_SECTION = 'section_items';
    const UNIT_SECTION = 'section_units';
    const RAW_MATERIAL_SECTION = 'section_rawmaterials';
    const TAB_GENERAL = 'tab_general';

    /**
     * Handles the form's onLoad.
     * 
     * The Type of Product field is used to determine which sections should be visible on the form. 
     * When the form is in a create state, all sections are hidden until a Type of Product is selected. 
     * When the form is in an update state (after being created), the sections are shown or hidden based on the value of the Type of Product field.
     * 
     */
    export async function onLoad(executionContext: Xrm.Events.EventContext) {
        const formContext = executionContext.getFormContext();
        
        toggleSubgridSections(executionContext);
        warnOfItemContainer(executionContext);

        if ((executionContext as any).getEventArgs().getDataLoadState() === 1) {
            formContext.getAttribute(TYPE_OF_PRODUCT).addOnChange(toggleSubgridSections);
            formContext.getAttribute(TYPE_OF_PRODUCT).addOnChange(warnOfItemContainer);
            formContext.getAttribute(TYPE_OF_PRODUCT).addOnChange(warnOfWrongStockInContainer);
        }
    }

    /**
     * Core logic to evaluate the type and hide/show sections accordingly.
     */
    function toggleSubgridSections(executionContext: Xrm.Events.EventContext): void {
        const formContext = executionContext.getFormContext();

        const typeAttribute = formContext.getAttribute<Xrm.Attributes.OptionSetAttribute>(TYPE_OF_PRODUCT);
        
        if (!typeAttribute) {
            console.warn(`Attribute ${TYPE_OF_PRODUCT} is missing from the form.`);
            return;
        }

        const tab = formContext.ui.tabs.get(TAB_GENERAL);
        if (!tab) {
            console.warn(`Tab ${TAB_GENERAL} is missing from the form.`);
            return;
        }

        // Get the sections
        const itemsSection = tab.sections.get(ITEM_SECTION);
        const unitsSection = tab.sections.get(UNIT_SECTION);
        const rawMaterialsSection = tab.sections.get(RAW_MATERIAL_SECTION);

        // 1. Hide all sections by default (Provides a clean slate)
        if (itemsSection) itemsSection.setVisible(false);
        if (unitsSection) unitsSection.setVisible(false);
        if (rawMaterialsSection) rawMaterialsSection.setVisible(false);

        // 2. Get the current value and show the relevant section
        const typeValue = typeAttribute.getValue();

        switch (typeValue) {
            case PRODUCT_TYPE_VALUES.Items:
                if (itemsSection) itemsSection.setVisible(true);
                break;
            case PRODUCT_TYPE_VALUES.Units:
                if (unitsSection) unitsSection.setVisible(true);
                break;
            case PRODUCT_TYPE_VALUES.RawMaterial:
                if (rawMaterialsSection) rawMaterialsSection.setVisible(true);
                break;
            default:
                // If the field is null/empty, all sections remain hidden
                break;
        }
    }

    function warnOfItemContainer (executionContext: Xrm.Events.EventContext): void {
        const formContext = executionContext.getFormContext();

        const typeAttribute = formContext.getAttribute<Xrm.Attributes.OptionSetAttribute>(TYPE_OF_PRODUCT);
    
        formContext.ui.clearFormNotification('warnOfItemContainer');

        if (typeAttribute.getValue() === PRODUCT_TYPE_VALUES.Items) {

            formContext.ui.setFormNotification(
                'This is an Item Container, be careful while dealing with it',
                'INFO',
                'warnOfItemContainer',
            );

        }

    }

    //Functions that send the user a warning when he changes the type of product in a container, and there's already stock in it from a different type
    function warnOfWrongStockInContainer (executionContext: Xrm.Events.EventContext): void {
        const formContext = executionContext.getFormContext();

        const weightAttribute = formContext.getAttribute<Xrm.Attributes.NumberAttribute>(WEIGHT);

        formContext.ui.clearFormNotification('warnOfWrongStockInContainer');

        if (weightAttribute.getValue() > 0) {

            formContext.ui.setFormNotification(
                'This container has stock, changing the type of product may cause issues with the existing stock',
                'WARNING',
                'warnOfWrongStockInContainer',
            );

        }
    }

}